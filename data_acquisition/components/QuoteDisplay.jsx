import React from "react";

export default function QuoteDisplay({ quote }) {
  return (
    <div className="mt-12 text-2xl font-medium text-gray-800 text-center px-4">
      {quote}
    </div>
  );
}
