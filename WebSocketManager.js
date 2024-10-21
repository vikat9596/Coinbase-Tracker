const WebSocket = require("ws");
const EventEmitter = require("events");
const crypto = require("crypto");
const dotenv = require("dotenv");

dotenv.config();

class WebSocketManager extends EventEmitter {
  constructor() {
    super();
    this.wsUrl = "wss://ws-feed.exchange.coinbase.com"; // Update URL if needed
    this.ws = null;
    this.apiKey = "organizations/91568a56-b074-4b35-8592-ac204af0b312/apiKeys/69443617-ece1-4e80-99e3-ba5ce03495da"; // Ensure this is loaded
    this.secretKey = "-----BEGIN EC PRIVATE KEY-----\nMHcCAQEEIG7wq2NilVxIx2+hKPMZUmAs5NcKyeiHgIhwYp0F4acdoAoGCCqGSM49\nAwEHoUQDQgAE7w4sPL4H0FLsfzIBYIBr7ZkgquXk5BAKYOHdbOWBsV5nzFf3uDl6\nO/QMFdgSG0PQkd9A5GTsJRlhTXTzxomFoA==\n-----END EC PRIVATE KEY-----\n"; // Ensure this is loaded
    this.passphrase = ""; // Ensure this is loaded
    this.connect();
  }

  async generateSignature() {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const message = `${timestamp}GET/users/self/verify`;
  const privateKey = this.secretKey;

  const signature = crypto.createSign('SHA256');
  signature.update(message);
  signature.end();

  const signingKey = crypto.createPrivateKey({
    key: privateKey,
    format: 'pem',
    type: 'pkcs8'
  });

  const signedMessage = signature.sign(signingKey, 'base64');

  return { signature: signedMessage, timestamp };
}

  connect() {
    this.ws = new WebSocket(this.wsUrl);

    this.ws.on("open", async () => {
      console.log("Connected to Coinbase WebSocket API");
      const { signature, timestamp } = await this.generateSignature();
      const subscribeMessage = JSON.stringify({
        type: "subscribe",
        channels: [{ name: "level2_batch", product_ids: ["BTC-USD", "ETH-USD", "XRP-USD", "LTC-USD"] }],
        signature,
        key: this.apiKey,
        passphrase: this.passphrase,
        timestamp,
      });
      this.ws.send(subscribeMessage);
      this.emit("open");
    });

    this.ws.on("message", (data) => {
      // console.log(JSON.parse(data));
      this.emit("message", data);
    });

    this.ws.on("close", () => {
      console.log("Disconnected from Coinbase WebSocket API");
      this.emit("close");
      // Attempt to reconnect after a delay
      setTimeout(() => this.connect(), 5000);
    });

    this.ws.on("error", (error) => {
      console.error("WebSocket Error:", error);
      this.emit("error", error);
    });
  }

  send(message) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.error("WebSocket is not open. Unable to send message.");
    }
  }
}

module.exports = WebSocketManager;
