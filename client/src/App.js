import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import SubscribeUnsubscribe from "./components/SubscribeUnsubscribe";
import PriceView from "./components/PriceView";
import MatchView from "./components/MatchView";
import SystemStatus from "./components/SystemStatus";
import "./App.css";

// WebSocket connection
const socket = io("http://localhost:4000");

const products = ["BTC-USD", "ETH-USD", "XRP-USD", "LTC-USD"];

function App() {
  const [subscriptions, setSubscriptions] = useState({});
  const [priceData, setPriceData] = useState({});
  const [matches, setMatches] = useState([]);
  const [systemStatus, setSystemStatus] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [clientId, setClientId] = useState("");
  const [showErrorPopup, setShowErrorPopup] = useState(false); // State for error popup

  useEffect(() => {
    // When the WebSocket connects
    socket.on("connect", () => {
      setIsConnected(true);
      setClientId(socket.id);
      setShowErrorPopup(false); // Hide popup when connected
    });

    // When the WebSocket disconnects
    socket.on("disconnect", () => {
      setIsConnected(false);
      setClientId("");
      setShowErrorPopup(true); // Show error popup when disconnected
    });

    // Other event listeners
    socket.on("level2Update", (data) => {
      setPriceData(data);
    });

    socket.on("match", (data) => {
      setMatches((prevMatches) => [data, ...prevMatches].slice(0, 100));
    });

    socket.on("systemStatus", (data) => {
      setSystemStatus(data);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("level2Update");
      socket.off("match");
      socket.off("systemStatus");
    };
  }, []);

  // Handle subscription
  const handleSubscribe = (product) => {
    socket.emit("subscribe", { product });
    setSubscriptions((prev) => ({ ...prev, [product]: true }));
  };

  // Handle unsubscription
  const handleUnsubscribe = (product) => {
    socket.emit("unsubscribe", { product });
    setSubscriptions((prev) => ({ ...prev, [product]: false }));
  };

  // Reconnect function
  const handleReconnect = () => {
    socket.connect(); // Attempt to reconnect
  };

  return (
    <div className="App">
      <h1>Coinbase Feed</h1>

      {/* Display WebSocket connection status and client ID */}
      <div className="connection-status">
        {isConnected ? (
          <p>
            WebSocket is connected. Client ID: <strong>{clientId}</strong>
          </p>
        ) : (
          <p>WebSocket is disconnected.</p>
        )}
      </div>

      <SubscribeUnsubscribe
        products={products}
        subscriptions={subscriptions}
        onSubscribe={handleSubscribe}
        onUnsubscribe={handleUnsubscribe}
      />
      <PriceView
        products={products}
        subscriptions={subscriptions}
        priceData={priceData}
      />
      <MatchView matches={matches} subscriptions={subscriptions} />
      <SystemStatus status={systemStatus} subscriptions={subscriptions} />

      {/* Popup Notification for Server Disconnection */}
      {showErrorPopup && (
        <div className="error-popup">
          <p>Connection to the server has been lost. Please try again.</p>
          <button onClick={handleReconnect}>Retry</button>
        </div>
      )}
    </div>
  );
}

export default App;
