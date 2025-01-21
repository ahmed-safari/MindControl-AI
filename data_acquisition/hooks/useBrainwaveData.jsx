import { useState, useRef, useEffect } from "react";
import saveDataToCSV from "@/utils/saveDataToCSV";
import transpose from "@/utils/transpose";

/**
 * Custom hook for collecting and saving brainwave data from a Neurosity device.
 *
 * @param {object} neurosity - The Neurosity SDK instance.
 * @param {function} setLogMessages - A function to update log messages (optional usage).
 * @returns {object} An object with methods to start recording and save data to CSV.
 */ export default function useBrainwaveData(neurosity, setLogMessages) {
  const [brainwaveData, setBrainwaveData] = useState([]);
  const signalQualityRef = useRef([]);
  // 1) Subscribe to signal quality once
  useEffect(() => {
    if (!neurosity) return;
    const sqSubscription = neurosity.signalQuality().subscribe((quality) => {
      // Store the latest array in a ref
      signalQualityRef.current = quality;
    });

    return () => {
      sqSubscription.unsubscribe();
    };
  }, [neurosity]);

  /**
   * startRecording: Subscribes to both powerByBand and raw data.
   * Returns an array of subscriptions for potential cleanup.
   */

  /**
   * startRecording
   *  - Accepts an object with participantName, frequency, etc.
   *  - Subscribes to raw + powerByBand.
   *  - Returns an array of the 2 subscriptions.
   */
  const startRecording = ({ participantName, frequency }) => {
    if (!neurosity) {
      setLogMessages((prev) => [
        ...prev,
        "Neurosity device is not initialized.",
      ]);
      return [];
    }

    // 1) Sub for powerByBand
    const powerByBandSub = neurosity
      .brainwaves("powerByBand")
      .subscribe((brainwaves) => {
        const sq = signalQualityRef.current;
        const { timestamp, data } = brainwaves;
        const { alpha, beta, gamma } = data;

        // Create a local laptop timestamp in float format
        const nowMs = Date.now();
        const laptopTimestamp = nowMs;

        const powerByBandDataPoint = {
          type: "powerByBand",
          timestamp, // device timestamp
          laptop_timestamp: laptopTimestamp,
          participantName,
          alpha,
          beta,
          gamma,
          signalQuality: sq.map((ch) => ch.status || ""),
          frequency,
        };

        console.log("powerByBandDataPoint:", powerByBandDataPoint);

        setBrainwaveData((prevData) => [...prevData, powerByBandDataPoint]);
      });

    // 2) Sub for raw
    const rawSub = neurosity.brainwaves("raw").subscribe((brainwaves) => {
      const sq = signalQualityRef.current;
      const { data, info } = brainwaves;
      const { startTime } = info;

      // Local laptop timestamp with fractional ms
      const nowMs = Date.now();
      const frac = performance.now() % 1;
      const laptopTimestamp = nowMs + frac;

      // Transpose raw data: channels x samples => samples x channels
      let dataTransposed = transpose(data);

      // Map each row to an object for easier handling
      const rawDataPoints = dataTransposed.map((row) => ({
        type: "raw",
        timestamp: startTime,
        laptop_timestamp: laptopTimestamp,
        participantName,
        data: row,
        // Attach the current signalQuality array
        signalQuality: sq.map((ch) => ch.status || ""),
        frequency
      }));

      console.log("rawDataTransposed:", rawDataPoints);

      setBrainwaveData((prevData) => [...prevData, ...rawDataPoints]);
    });
    return [powerByBandSub, rawSub];
  };

  /**
   * Save everything to CSV, then clear local buffer
   */
  const saveData = () => {
    saveDataToCSV(brainwaveData);
    setBrainwaveData([]);
  };

  return {
    startRecording,
    saveDataToCSV: saveData,
  };
}
