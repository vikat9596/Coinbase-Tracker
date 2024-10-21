import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import SubscribeUnsubscribe from "./components/SubscribeUnsubscribe";
import PriceView from "./components/PriceView";
import MatchView from "./components/MatchView";
import SystemStatus from "./components/SystemStatus";
import "./App.css";

const socket = io("http://localhost:4000");

const products = ["BTC-USD", "ETH-USD", "XRP-USD", "LTC-USD"];

function App() {
  const [subscriptions, setSubscriptions] = useState({});
  const [priceData, setPriceData] = useState({});
  const [matches, setMatches] = useState([]);
  const [systemStatus, setSystemStatus] = useState([]);
  const [isConnected, setIsConnected] = useState(false); // New state for connection status
  const [clientId, setClientId] = useState(""); // New state for client ID

  useEffect(() => {
    // When the WebSocket connects, update the state
    socket.on("connect", () => {
      setIsConnected(true);
      setClientId(socket.id); // Set client ID from socket
    });

    // When the WebSocket disconnects, update the state
    socket.on("disconnect", () => {
      setIsConnected(false);
      setClientId(""); // Clear client ID when disconnected
    });

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

  const handleSubscribe = (product) => {
    socket.emit("subscribe", { product });
    setSubscriptions((prev) => ({ ...prev, [product]: true }));
  };

  const handleUnsubscribe = (product) => {
    socket.emit("unsubscribe", { product });
    setSubscriptions((prev) => ({ ...prev, [product]: false }));
    setClientId(""); // Clear client ID when disconnected
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
    </div>
  );
}

export default App;
