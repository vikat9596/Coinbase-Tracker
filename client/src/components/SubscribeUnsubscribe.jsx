import React from "react";

function SubscribeUnsubscribe({
  products,
  subscriptions,
  onSubscribe,
  onUnsubscribe,
}) {
  return (
    <div className="subscribe-section">
      <h2>Subscribe/Unsubscribe</h2>
      {products.map((product) => (
        <div key={product}>
          <span>{product}: </span>
          <button
            onClick={() => onSubscribe(product)}
            disabled={subscriptions[product]}
          >
            Subscribe
          </button>
          <button
            onClick={() => onUnsubscribe(product)}
            disabled={!subscriptions[product]}
          >
            Unsubscribe
          </button>
          <span>{subscriptions[product] ? "Subscribed" : "Unsubscribed"}</span>
        </div>
      ))}
    </div>
  );
}

export default SubscribeUnsubscribe;
