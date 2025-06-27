// frontend/src/components/TimestampBar.jsx
import React from 'react';

const TimestampBar = ({ timestamp }) => {
  if (!timestamp) return null;

  const formattedTime = new Date(timestamp).toLocaleTimeString();

  return (
    <div className="timestamp-bar">
      <span>Last Updated: {formattedTime}</span>
    </div>
  );
};

export default TimestampBar;
