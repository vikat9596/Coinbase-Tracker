function SystemStatus({ status, subscriptions }) {
  const filteredStatus = status.filter(channel =>
    channel.product_ids.some(productId => subscriptions[productId])
  );

  return (
    <div className="system-status">
      <h2>System Status</h2>
      <ul>
        {filteredStatus.map((channel, index) => (
          <li key={index}>
            {channel.name}: {channel.product_ids.join(", ")}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SystemStatus;
