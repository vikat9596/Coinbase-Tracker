class SubscriptionManager {
  constructor(wsManager) {
    this.wsManager = wsManager;
    this.subscriptions = new Set(); // Store unique subscriptions
    this.channels = ["level2", "matches"]; // Channels to subscribe to
  }

  /**
   * Subscribes to a product.
   * @param {string} product - The product to subscribe to.
   */
  subscribe(product) {
    if (!this.subscriptions.has(product)) {
      this.subscriptions.add(product);
      this.updateSubscriptions(); // Update the WebSocket subscriptions
    }
  }

  /**
   * Unsubscribes from a product.
   * @param {string} product - The product to unsubscribe from.
   */
  unsubscribe(product) {
    if (this.subscriptions.has(product)) {
      this.subscriptions.delete(product);
      this.updateSubscriptions(); // Update the WebSocket subscriptions
    }
  }

  /**
   * Updates the WebSocket subscriptions based on current subscriptions.
   */
  updateSubscriptions() {
    const message = {
      type: "subscribe",
      product_ids: Array.from(this.subscriptions), // Convert Set to Array
      channels: this.channels,
    };
    this.wsManager.send(message); // Send the subscription update
  }
}

module.exports = SubscriptionManager;
