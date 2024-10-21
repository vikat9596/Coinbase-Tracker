const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const WebSocketManager = require("./WebSocketManager");
const SubscriptionManager = require("./SubscriptionManager");
const DataManager = require("./DataManager");

// Create an instance of the Express application
const app = express();
// Create an HTTP server and bind it to the Express app
const server = http.createServer(app);
// Set up Socket.IO for real-time communication
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Middleware to enable CORS and parse JSON request bodies
app.use(cors());
app.use(express.json());

// Initialize managers for WebSocket and data handling
const wsManager = new WebSocketManager();
const subManager = new SubscriptionManager(wsManager);
const dataManager = new DataManager();

// Handle client connections
io.on("connection", (socket) => {
  console.log("A client connected:", socket.id);

  // Handle subscription requests from clients
  socket.on("subscribe", ({ product }) => {
    try {
      subManager.subscribe(product);
    } catch (error) {
      console.error("Error subscribing:", error);
      socket.emit("error", { message: "Subscription failed." });
    }
  });

  // Handle unsubscription requests from clients
  socket.on("unsubscribe", ({ product }) => {
    try {
      subManager.unsubscribe(product);
    } catch (error) {
      console.error("Error unsubscribing:", error);
      socket.emit("error", { message: "Unsubscription failed." });
    }
  });

  // Handle client disconnections
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Handle messages from the WebSocket manager
wsManager.on("message", (message) => {
  try {
    const parsedMessage = JSON.parse(message);

    // Process different types of messages from the WebSocket
    if (parsedMessage.type === "subscriptions") {
      io.emit("systemStatus", parsedMessage.channels);
    } else if (parsedMessage.type === "l2update") {
      dataManager.updateLevel2(parsedMessage);
    } else if (parsedMessage.type === "match") {
      io.emit("match", parsedMessage);
    }
  } catch (error) {
    console.error("Error parsing message:", error);
  }
});

// Emit level 2 data updates at regular intervals
setInterval(() => {
  try {
    io.emit("level2Update", dataManager.getLevel2Data());
  } catch (error) {
    console.error("Error emitting level 2 update:", error);
  }
}, 50);

// Start the server and handle errors
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}).on("error", (error) => {
  console.error("Server error:", error);
});
