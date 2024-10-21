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

  useEffect(() => {
    socket.on("level2Update", (data) => {
      setPriceData(data);
      // console.log(data);
    });

    socket.on("match", (data) => {
      setMatches((prevMatches) => [data, ...prevMatches].slice(0, 100));
    });

    socket.on("systemStatus", (data) => {
      setSystemStatus(data);
    });

    return () => {
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
  };

  return (
    <div className="App">
      <h1>Coinbase Feed</h1>
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
      <MatchView matches={matches} />
      <SystemStatus status={systemStatus} />
    </div>
  );
}

export default App;
