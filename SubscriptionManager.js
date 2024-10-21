class SubscriptionManager {
  constructor(wsManager) {
    this.wsManager = wsManager;
    this.subscriptions = new Set();
    this.channels = ["level2","matches"];
  }

  subscribe(product) {
    if (!this.subscriptions.has(product)) {
      this.subscriptions.add(product);
      this.updateSubscriptions();
    }
  }

  unsubscribe(product) {
    if (this.subscriptions.has(product)) {
      this.subscriptions.delete(product);
      this.updateSubscriptions();
    }
  }

  updateSubscriptions() {
    const message = {
      type: "subscribe",
      product_ids: Array.from(this.subscriptions),
      channels: this.channels,
    };
    this.wsManager.send(message);
  }
}

module.exports = SubscriptionManager;
