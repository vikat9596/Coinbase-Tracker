import React from "react";

function SystemStatus({ status }) {
  return (
    <div className="system-status">
      <h2>System Status</h2>
      <ul>
        {status.map((channel, index) => (
          <li key={index}>
            {channel.name}: {channel.product_ids.join(", ")}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SystemStatus;
