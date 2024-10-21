import React from "react";

function PriceView({ products, subscriptions, priceData }) {
  const getBestOrders = (orders, type) => {
    const ordersArray = Object.entries(orders).map(([price, size]) => [type === 'buy' ? 'buy' : 'sell', price, size]);
    return ordersArray
      .filter(([ , , size]) => size !== '0.00000000') // Exclude size 0.00
      .sort(([ , priceA], [ , priceB]) => type === 'buy' ? priceB - priceA : priceA - priceB) // Sort based on type
      .slice(0, 5); // Get top 5
  };

  return (
    <div className="price-view">
      <h2>Price View</h2>
      {products.map(
        (product) =>
          subscriptions[product] && (
            <div key={product}>
              <h3>{product}</h3>
              <div>
                <h4>Bids</h4>
                <ul>
                  {getBestOrders(priceData[product]?.bids || {}, 'buy').map(([side, price, size]) => (
                    <li key={price}>
                      {price}: {size}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4>Asks</h4>
                <ul>
                  {getBestOrders(priceData[product]?.asks || {}, 'sell').map(([side, price, size]) => (
                    <li key={price}>
                      {price}: {size}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )
      )}
    </div>
  );
}

export default PriceView;
