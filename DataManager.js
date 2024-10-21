class DataManager {
  constructor() {
    this.level2Data = {}; // Stores the level 2 data for each product
  }

  /**
   * Updates the level 2 order book with new data.
   * @param {Object} update - The update containing product_id and changes.
   */
  updateLevel2(update) {
    const { product_id, changes } = update;

    // Initialize data structure if it doesn't exist
    if (!this.level2Data[product_id]) {
      this.level2Data[product_id] = { bids: {}, asks: {} };
    }

    // Update order book based on the changes
    changes.forEach(([side, price, size]) => {
      const orderBook =
        side === "buy"
          ? this.level2Data[product_id].bids
          : this.level2Data[product_id].asks;
      if (size === "0") {
        delete orderBook[price]; // Remove the price if size is 0
      } else {
        orderBook[price] = size; // Update the size at the given price
      }
    });
  }

  /**
   * Retrieves the current level 2 data.
   * @returns {Object} - The current level 2 data.
   */
  getLevel2Data() {
    return this.level2Data; // Return the level 2 data
  }
}

module.exports = DataManager;
