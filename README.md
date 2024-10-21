# Coinbase Feed WebSocket Application


This project is a cryptocurrency tracker built using **ReactJS** and **Node.js** that interacts with the **Coinbase WebSocket API**. It allows users to subscribe and unsubscribe from real-time price updates for four major cryptocurrency pairs (BTC-USD, ETH-USD, XRP-USD, and LTC-USD). Users can view price updates, match events, and system status filtered by their active subscriptions.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Components Overview](#components-overview)
- [WebSocket API](#websocket-api)
- [Contributing](#contributing)

## Features

- **Real-time Price View**: Displays the top 5 bids and asks for the selected cryptocurrencies.
- **Match View**: Shows trade matches (buy/sell orders) for subscribed products.
- **System Status**: Displays system status updates for subscribed channels.
- **Subscribe/Unsubscribe**: Allows users to subscribe and unsubscribe to price feeds.

## Installation

### Prerequisites

- Node.js (v12.x or above)
- npm (v6.x or above)
- A running WebSocket server (The project assumes the WebSocket server is hosted locally on port `4000`)

### Steps

1. Clone the repository:

    ```bash
    git clone https://github.com/vikat9596/coinbase-tracker.git
    cd coinbase-tracker
    ```

2. Install dependencies:

    ```bash
    npm install
    ```
3. Rename .env.sample to .env    

4. Start the development server:

    ```bash
    npm start
    ```

5. The app will be accessible at `http://localhost:3000`.

### Backend WebSocket Server

This project requires a WebSocket server to be running. By default, it assumes the server is hosted at `http://localhost:4000`. If the server address differs, update the WebSocket URL in the code:

```javascript
const socket = io("http://localhost:4000");
```

## Usage

Once the app is running:

1. **Subscribe/Unsubscribe** to any of the available cryptocurrency pairs (BTC-USD, ETH-USD, XRP-USD, LTC-USD) using the provided buttons.
2. View **real-time price updates** for subscribed pairs in the Price View section.
3. Track **match events** (buy/sell orders) for subscribed products in the Match View section.
4. See **system status updates** only for subscribed channels.

## Components Overview

### 1. `App.js`

- Main entry point that handles subscription logic, WebSocket connections, and passes data to child components.
- Establishes WebSocket connection and listens to events: `level2Update`, `match`, and `systemStatus`.

### 2. `SubscribeUnsubscribe.js`

- Allows users to subscribe/unsubscribe to cryptocurrency products.
- Disabled buttons based on the current subscription status.

### 3. `PriceView.js`

- Displays the top 5 bids and asks for each subscribed product.
- Fetches and renders data from `level2Update` WebSocket events.

### 4. `MatchView.js`

- Displays the latest matches (buy/sell orders) for subscribed products.
- Filters data based on user subscriptions and displays up to the last 20 matches.

### 5. `SystemStatus.js`

- Shows the system status for each subscribed product.
- Filters the system status data based on active subscriptions.

## WebSocket API

The app communicates with a backend WebSocket server using the following events:

- **subscribe**: Sends a subscription request to the server for a specific product.
- **unsubscribe**: Sends an unsubscribe request to stop receiving data for the specified product.
- **level2Update**: Receives real-time price updates (bids/asks) for subscribed products.
- **match**: Receives trade match events for subscribed products.
- **systemStatus**: Receives updates on the system status for subscribed products.

### Example WebSocket Data

1. **level2Update**

    ```json
    {
      "product_id": "BTC-USD",
      "bids": { "10000.00": "0.5", "9999.00": "1.2" },
      "asks": { "10001.00": "0.3", "10002.00": "0.7" }
    }
    ```

2. **match**

    ```json
    {
      "product_id": "BTC-USD",
      "price": "10000.00",
      "size": "0.1",
      "side": "buy",
      "time": "2024-10-21T12:34:56.789Z"
    }
    ```

3. **systemStatus**

    ```json
    [
      { "name": "statusUpdate", "product_ids": ["BTC-USD", "ETH-USD"] }
    ]
    ```

## Contributing

Contributions are welcome! If you'd like to contribute, please follow these steps:

1. Fork the repository.
2. Create a new feature branch:

    ```bash
    git checkout -b feature-name
    ```

3. Make your changes and commit them:

    ```bash
    git commit -m "Add some feature"
    ```

4. Push to the branch:

    ```bash
    git push origin feature-name
    ```

5. Open a pull request.
