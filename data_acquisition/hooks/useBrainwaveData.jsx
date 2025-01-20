import { useState, useEffect, useRef } from "react";
import saveDataToCSV from "@/utils/saveDataToCSV";
import transpose from "@/utils/transpose";

/**
 * Custom hook for collecting and saving brainwave data from a Neurosity device.
 *
 * @param {object} neurosity - The Neurosity SDK instance.
 * @param {object} currentFrequencyRef - A React ref for the current frequency.
 * @param {function} setLogMessages - A function to update log messages (optional usage).
 *
 * @returns {object} An object with methods to start recording and save data to CSV.
 */
export default function useBrainwaveData(
  neurosity,
  currentFrequencyRef,
  setLogMessages
) {
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
  const startRecording = () => {
    if (!neurosity) {
      console.error("Neurosity device is not initialized.");
      return;
    }

    // 2) Power By Band subscription
    const powerByBandSubscription = neurosity
      .brainwaves("powerByBand")
      .subscribe((brainwaves) => {
        const sq = signalQualityRef.current;
        const { timestamp, data } = brainwaves;
        const { alpha, beta, gamma } = data;

        const nowMs = Date.now(); // e.g. 1737330030458
        const laptopTimestamp = nowMs;

        const powerByBandDataPoint = {
          type: "powerByBand",
          timestamp, // device timestamp
          laptop_timestamp: laptopTimestamp,
          alpha,
          beta,
          gamma,
          // Attach signal quality (status for each channel)
          signalQuality: sq.map((ch) => ch.status || ""),
          frequency: currentFrequencyRef.current,
        };

        console.log("powerByBandDataPoint:", powerByBandDataPoint);

        setBrainwaveData((prevData) => [...prevData, powerByBandDataPoint]);
      });

    // 3) Raw data subscription
    const rawSubscription = neurosity
      .brainwaves("raw")
      .subscribe((brainwaves) => {
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
          data: row,
          // Attach the current signalQuality array
          signalQuality: sq.map((ch) => ch.status || ""),
          frequency: currentFrequencyRef.current,
        }));

        console.log("rawDataTransposed:", rawDataPoints);

        setBrainwaveData((prevData) => [...prevData, ...rawDataPoints]);
      });

    // Return all active subscriptions so parent component can clean up if needed
    return [powerByBandSubscription, rawSubscription];
  };

  /**
   * Save data to CSV and reset the state.
   */
  const saveData = () => {
    saveDataToCSV(brainwaveData);
    setBrainwaveData([]); // Clear data after saving
  };

  return {
    startRecording,
    saveDataToCSV: saveData,
  };
}
