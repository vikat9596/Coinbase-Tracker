class DataManager {
  constructor() {
    this.level2Data = {};
  }

  updateLevel2(update) {
    const { product_id, changes } = update;
    if (!this.level2Data[product_id]) {
      this.level2Data[product_id] = { bids: {}, asks: {} };
    }

    changes.forEach(([side, price, size]) => {
      const orderBook =
        side === "buy"
          ? this.level2Data[product_id].bids
          : this.level2Data[product_id].asks;
      if (size === "0") {
        delete orderBook[price];
      } else {
        orderBook[price] = size;
      }
    });
  }

  getLevel2Data() {
    return this.level2Data;
  }
}

module.exports = DataManager;
