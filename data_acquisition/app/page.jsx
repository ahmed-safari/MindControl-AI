"use client";
import { useState } from "react";
import useNeurosity from "../hooks/useNeurosity";
import useSession from "../hooks/useSession";
import DeviceStatus from "../components/DeviceStatus";
import LogMessages from "../components/LogMessages";
import TriangleDisplay from "../components/TriangleDisplay";
import QuoteDisplay from "../components/QuoteDisplay";
import InstructionMessage from "../components/InstructionMessage";
import { instructionMessage } from "../constants/constants";

export default function Home() {
  const [logMessages, setLogMessages] = useState([]);
  const { neurosity, deviceStatus, signalQuality } =
    useNeurosity(setLogMessages);

  const { started, currentStep, blink, startSession, triangles, quotes } =
    useSession(neurosity, setLogMessages);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200">
      {/* Device Status Box */}
      <DeviceStatus deviceStatus={deviceStatus} signalQuality={signalQuality} />

      {/* Start Training Button */}
      {!started && neurosity && (
        <button
          onClick={startSession}
          disabled={
            deviceStatus.sleepMode ||
            deviceStatus.state === "Disconnected" ||
            deviceStatus.state === "offline"
          }
          className={`px-8 py-4 text-xl font-semibold text-white rounded-full shadow-lg focus:outline-none ${
            deviceStatus.sleepMode
              ? "bg-gray-400"
              : deviceStatus.state === "Disconnected" ||
                deviceStatus.state === "offline"
              ? "bg-red-500"
              : "bg-indigo-500 hover:bg-indigo-700"
          }`}
        >
          {deviceStatus.sleepMode
            ? "Device is in sleep mode..."
            : deviceStatus.state === "Disconnected" ||
              deviceStatus.state === "offline"
            ? "Device is not connected"
            : "Start Training"}
        </button>
      )}

      {!neurosity && (
        <div className="mt-12 text-2xl font-medium text-gray-800 text-center px-4">
          Connecting to Neurosity device...
        </div>
      )}

      {/* Instruction Message */}
      {started && currentStep === -1 && (
        <InstructionMessage instructionMessage={instructionMessage} />
      )}

      {/* Triangle and Quote Display */}
      {started && currentStep >= 0 && currentStep < triangles.length * 2 && (
        <>
          {currentStep % 2 === 0 ? (
            // Triangle Step
            <TriangleDisplay
              triangle={triangles[Math.floor(currentStep / 2)]}
              blink={blink}
            />
          ) : (
            // Quote Step
            <QuoteDisplay
              quote={quotes[Math.floor(currentStep / 2) % quotes.length]}
            />
          )}
        </>
      )}

      {/* Session Complete Message */}
      {started && currentStep >= triangles.length * 2 && (
        <div className="mt-12 text-2xl font-medium text-gray-800 text-center px-4">
          Session complete. Thank you!
        </div>
      )}

      {/* Log Messages */}
      <LogMessages logMessages={logMessages} />
    </div>
  );
}
