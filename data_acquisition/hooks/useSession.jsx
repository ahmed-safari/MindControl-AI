import { useState, useEffect, useRef } from "react";
import useBrainwaveData from "./useBrainwaveData";

export default function useSession(neurosity, setLogMessages) {
  // ---- State variables ----
  const [participantName, setParticipantName] = useState("");
  const [frequency, setFrequency] = useState("");
  const [recordTime, setRecordTime] = useState("5"); // Default 5s
  const [isRecording, setIsRecording] = useState(false);
  const isRecordingRef = useRef(false);

  // Subscriptions and timeout refs
  const subscriptionsRef = useRef([]);
  const recordTimerRef = useRef(null);

  const setRecordingState = (value) => {
    setIsRecording(value);
    isRecordingRef.current = value;
  };

  // Hook to collect data
  const { startRecording, saveDataToCSV } = useBrainwaveData(
    neurosity,
    setLogMessages
  );

  /**
   * Start recording handler
   *  - Takes participant name, frequency, recordTime from state
   *  - Calls the brainwave data subscriptions
   *  - Schedules auto-stop after recordTime (seconds)
   */
  const startRecordingHandler = () => {
    if (!neurosity) {
      setLogMessages((prev) => [...prev, "Neurosity not initialized."]);
      console.warn("Neurosity not initialized.");
      return;
    }

    if (isRecording) {
      setLogMessages((prev) => [...prev, "Already recording..."]);
      console.warn("Already recording...");
      return;
    }

    // Validate frequency
    if (!frequency || isNaN(parseFloat(frequency))) {
      setLogMessages((prev) => [
        ...prev,
        "Please enter a valid frequency (e.g. 10).",
      ]);
      console.warn("Invalid frequency input.");
      return;
    }

    // Convert recordTime to a number in ms
    let durationSec = parseInt(recordTime, 10);
    if (isNaN(durationSec) || durationSec <= 0) {
      // fallback if user typed something invalid
      durationSec = 5;
      setRecordTime("5");
      setLogMessages((prev) => [
        ...prev,
        "Invalid record time. Defaulting to 5s.",
      ]);
      console.warn("Invalid recordTime, defaulting to 5s.");
    }
    const durationMs = durationSec * 1000;

    // Start actual subscriptions
    console.log(
      `Starting recording: participant=${participantName}, frequency=${frequency} Hz, duration=${durationMs} ms`
    );
    const subs = startRecording({
      participantName,
      frequency: parseFloat(frequency),
    });
    subscriptionsRef.current = subs;

    // setIsRecording(true);
    setRecordingState(true);
    setLogMessages((prev) => [
      ...prev,
      `Started recording for participant "${participantName}" at ${frequency} Hz.`,
    ]);

    // Auto-stop after X seconds
    recordTimerRef.current = setTimeout(() => {
      // console.log("Auto-stop timeout reached. Stopping recording...");
      console.log(
        ">>> TIMER FIRED. isRecordingRef.current:",
        isRecordingRef.current
      );
      stopRecordingHandler();
    }, durationMs);
  };

  /**
   * Stop recording manually
   *  - Clears timer
   *  - Unsubscribes
   */
  const stopRecordingHandler = () => {
    if (!isRecordingRef.current) {
      console.log("stopRecordingHandler called, but we are not recording.");
      return;
    }

    console.log("Stopping recording now...");
    // Clear the auto-stop timer
    clearTimeout(recordTimerRef.current);

    // Unsubscribe from all streams
    const subs = subscriptionsRef.current;
    if (subs && subs.length > 0) {
      subs.forEach((s) => {
        console.log("Unsubscribing from a subscription...");
        s.unsubscribe();
      });
    }
    subscriptionsRef.current = [];

    // setIsRecording(false);
    setRecordingState(false);
    setLogMessages((prev) => [...prev, "Stopped recording."]);
  };

  /**
   * Manually save CSV
   */
  const saveData = () => {
    if (isRecording) {
      setLogMessages((prev) => [
        ...prev,
        "Cannot save CSV while still recording. Stop first.",
      ]);
      console.warn("Cannot save CSV while still recording.");
      return;
    }
    console.log("Saving CSV...");
    saveDataToCSV();
    setLogMessages((prev) => [...prev, "CSV saved."]);
  };

  // Cleanup on unmount or re-render
  useEffect(() => {
    return () => {
      console.log("useSession unmounted - clearing timer & unsubscribing...");
      clearTimeout(recordTimerRef.current);
      stopRecordingHandler();
    };
    // eslint-disable-next-line
  }, []);

  return {
    participantName,
    setParticipantName,
    frequency,
    setFrequency,
    recordTime,
    setRecordTime,
    isRecording,
    startRecording: startRecordingHandler,
    stopRecording: stopRecordingHandler,
    saveData,
  };
}
