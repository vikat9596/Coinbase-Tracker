# Coinbase Tracker - Frontend


This project is the frontend component of the **Coinbase Tracker**, a real-time cryptocurrency tracking application built with **React**. It connects to the **Coinbase Pro WebSocket API** to display live data for popular cryptocurrency pairs, allowing users to subscribe and unsubscribe to different feeds.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Components Overview](#components-overview)
- [WebSocket Communication](#websocket-communication)
- [Contributing](#contributing)

## Features

- **Real-Time Price Updates**: View live bids and asks for various cryptocurrencies.
- **Trade Matches**: Monitor the latest trade matches in real-time.
- **System Status**: Check the operational status of subscribed channels.
- **Subscription Management**: Easily subscribe to or unsubscribe from different cryptocurrency pairs.

## Installation

### Prerequisites

- Node.js (v12.x or above)
- npm (v6.x or above)

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

3. Start the development server:

    ```bash
    npm start
    ```

4. The app will be accessible at `http://localhost:3000`.

### Backend WebSocket Server

This frontend application requires a WebSocket server to connect to. By default, it assumes the server is hosted at `http://localhost:4000`. Ensure the backend server is running before starting the frontend.

## Usage

Once the app is running, you can:

1. **Subscribe/Unsubscribe** to any of the available cryptocurrency pairs (BTC-USD, ETH-USD, XRP-USD, LTC-USD).
2. View **real-time price updates** for subscribed pairs in the Price View section.
3. Monitor **trade matches** in the Match View section.
4. Check **system status** updates for subscribed products.

## Components Overview

### 1. `App.js`

- **Description**: The main entry point of the application that manages WebSocket connections and state.
- **Key Functions**:
  - Handles subscription logic.
  - Connects to the WebSocket server.
  - Displays connection status and client ID.

### 2. `SubscribeUnsubscribe.js`

- **Description**: Component for subscribing and unsubscribing from cryptocurrency products.
- **Key Functions**:
  - Displays buttons for subscription management.
  - Updates subscription status.

### 3. `PriceView.js`

- **Description**: Displays the top bids and asks for each subscribed product.
- **Key Functions**:
  - Retrieves and renders bid and ask data.
  - Excludes orders with a size of `0.00000000`.

### 4. `MatchView.js`

- **Description**: Displays the latest trade matches for subscribed products.
- **Key Functions**:
  - Filters matches based on active subscriptions.
  - Displays the most recent 20 matches.

### 5. `SystemStatus.js`

- **Description**: Displays the system status for subscribed channels.
- **Key Functions**:
  - Filters system status updates based on active subscriptions.

## WebSocket Communication

The app communicates with a backend WebSocket server using the following events:

- **connect**: Triggered when the WebSocket connection is established.
- **disconnect**: Triggered when the WebSocket connection is lost.
- **level2Update**: Receives real-time price updates for subscribed products.
- **match**: Receives trade match events for subscribed products.
- **systemStatus**: Receives system status updates for subscribed products.

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

