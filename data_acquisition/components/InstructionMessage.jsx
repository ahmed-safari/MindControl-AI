import React from "react";

export default function InstructionMessage({ instructionMessage }) {
  return (
    <div className="mt-12 text-2xl font-medium text-gray-800 text-center px-4">
      {instructionMessage}
    </div>
  );
}
