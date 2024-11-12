import React from "react";

export default function DeviceStatus({ deviceStatus, signalQuality }) {
  return (
    <div className="fixed top-4 left-4 p-4 bg-white rounded-lg shadow-lg">
      <h2 className="font-semibold text-gray-700">Device Status</h2>
      <div className="text-sm text-gray-600">
        <p>
          <strong>State:</strong> {deviceStatus.state}
        </p>
        <p>
          <strong>Sleep Mode:</strong>{" "}
          {deviceStatus.sleepMode ? "Enabled" : "Disabled"}
        </p>
        <p>
          <strong>Charging:</strong> {deviceStatus.charging ? "Yes" : "No"}
        </p>
        <p>
          <strong>Battery:</strong> {deviceStatus.battery}%
        </p>
        <p>
          <strong>Last Heartbeat:</strong>{" "}
          {new Date(deviceStatus.lastHeartbeat).toLocaleString()}
        </p>
        <p>
          <strong>SSID:</strong> {deviceStatus.ssid}
        </p>
        <p>
          <strong>Signal Quality:</strong>{" "}
          {signalQuality
            ? signalQuality.map((channel, index) => (
                <span key={index}>
                  {channel.status}
                  {index < signalQuality.length - 1 ? ", " : ""}
                </span>
              ))
            : "Not available"}
        </p>
      </div>
    </div>
  );
}
