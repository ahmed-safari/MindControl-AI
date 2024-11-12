import React from "react";

export default function TriangleDisplay({ triangle, blink }) {
  return (
    <div className="mt-12">
      {blink && (
        <svg width="200" height="200">
          <polygon points={triangle.points} fill={triangle.color} />
        </svg>
      )}
    </div>
  );
}
