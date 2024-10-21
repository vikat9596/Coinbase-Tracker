const WebSocket = require("ws");
const EventEmitter = require("events");
const crypto = require("crypto");
const dotenv = require("dotenv");

dotenv.config();

class WebSocketManager extends EventEmitter {
  constructor() {
    super();
    this.wsUrl = "wss://ws-feed.exchange.coinbase.com"; // WebSocket URL
    this.ws = null; // WebSocket instance
    this.apiKey = process.env.COINBASE_API_KEY; // Load API Key from environment variables
    this.secretKey = process.env.COINBASE_SECRET_KEY; // Load Secret Key from environment variables
    this.passphrase = process.env.COINBASE_PASSPHRASE; // Load Passphrase from environment variables
    this.connect(); // Establish WebSocket connection
  }

  /**
   * Generates a signature for the WebSocket connection.
   * @returns {Object} - The signature and timestamp.
   */
  async generateSignature() {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const message = `${timestamp}GET/users/self/verify`;
    const privateKey = this.secretKey;

    const signature = crypto.createSign("SHA256");
    signature.update(message);
    signature.end();

    const signingKey = crypto.createPrivateKey({
      key: privateKey,
      format: "pem",
      type: "pkcs8",
    });

    const signedMessage = signature.sign(signingKey, "base64");

    return { signature: signedMessage, timestamp };
  }

  /**
   * Connects to the Coinbase WebSocket API.
   */
  connect() {
    this.ws = new WebSocket(this.wsUrl);

    this.ws.on("open", async () => {
      console.log("Connected to Coinbase WebSocket API");
      try {
        const { signature, timestamp } = await this.generateSignature();
        const subscribeMessage = JSON.stringify({
          type: "subscribe",
          channels: [
            { name: "level2_batch", product_ids: ["BTC-USD", "ETH-USD", "XRP-USD", "LTC-USD"] },
          ],
          signature,
          key: this.apiKey,
          passphrase: this.passphrase,
          timestamp,
        });
        this.ws.send(subscribeMessage); // Subscribe to channels
        this.emit("open");
      } catch (error) {
        console.error("Error during WebSocket open:", error);
      }
    });

    this.ws.on("message", (data) => {
      this.emit("message", data); // Emit received messages
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

  /**
   * Sends a message to the WebSocket.
   * @param {Object} message - The message to send.
   */
  send(message) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message)); // Send message as JSON
    } else {
      console.error("WebSocket is not open. Unable to send message.");
    }
  }
}

module.exports = WebSocketManager;
