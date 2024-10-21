const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const WebSocketManager = require("./WebSocketManager");
const SubscriptionManager = require("./SubscriptionManager");
const DataManager = require("./DataManager");

// index.js
//const WebSocketManager = require("./WebSocketManager");

//const manager = new WebSocketManager();


const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
// console.log("gjkshdkdsklsdjklsdj")
app.use(express.json())

const wsManager = new WebSocketManager();
const subManager = new SubscriptionManager(wsManager);
const dataManager = new DataManager();

io.on("connection", (socket) => {
  console.log("A client connected:", socket.id);

  socket.on("subscribe", ({ product }) => {
    subManager.subscribe(product);
  });

  socket.on("unsubscribe", ({ product }) => {
    subManager.unsubscribe(product);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

wsManager.on("message", (message) => {
  const parsedMessage = JSON.parse(message);

  if (parsedMessage.type === "subscriptions") {
    io.emit("systemStatus", parsedMessage.channels);
  } else if (parsedMessage.type === "l2update") {
    dataManager.updateLevel2(parsedMessage);
  } else if (parsedMessage.type === "match") {
    io.emit("match", parsedMessage);
  }
});

setInterval(() => {
  io.emit("level2Update", dataManager.getLevel2Data());
}, 50);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
