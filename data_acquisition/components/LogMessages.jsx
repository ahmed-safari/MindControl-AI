import React from "react";

export default function LogMessages({ logMessages }) {
  return (
    <div className="fixed bottom-0 w-full p-4 bg-white bg-opacity-75">
      <div className="text-sm text-gray-700">
        <h2 className="font-semibold">Log:</h2>
        {logMessages.map((msg, index) => (
          <div key={index}>- {msg}</div>
        ))}
      </div>
    </div>
  );
}
