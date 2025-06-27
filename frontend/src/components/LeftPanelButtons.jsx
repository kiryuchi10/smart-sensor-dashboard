import React from "react";
import "./leftpanel.css";

export default function LeftPanelButtons() {
  return (
    <div className="left-panel">
      <button className="panel-btn">Dashboard</button>
      <button className="panel-btn">Logs</button>
      <button className="panel-btn">Settings</button>
      <button className="panel-btn">Diagnostics</button>
    </div>
  );
}
