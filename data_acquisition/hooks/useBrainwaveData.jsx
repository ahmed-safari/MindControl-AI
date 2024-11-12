import { useState } from "react";
import saveDataToCSV from "../utils/saveDataToCSV";

export default function useBrainwaveData(
  neurosity,
  currentStimulusRef,
  currentFrequencyRef,
  setLogMessages
) {
  const [brainwaveData, setBrainwaveData] = useState([]);

  const startRecording = () => {
    if (!neurosity) {
      console.error("Neurosity device is not initialized.");
      return;
    }

    const subscription = neurosity
      .brainwaves("powerByBand")
      .subscribe((brainwaves) => {
        const { timestamp, data } = brainwaves;
        const { alpha, beta, gamma } = data;

        const dataPoint = {
          timestamp,
          alpha,
          beta,
          gamma,
          stimulus: currentStimulusRef.current,
          frequency: currentFrequencyRef.current,
        };

        console.log(dataPoint);

        setBrainwaveData((prevData) => [...prevData, dataPoint]);
      });

    return subscription;
  };

  const saveData = () => {
    saveDataToCSV(brainwaveData);
    setBrainwaveData([]); // Clear data after saving
  };

  return {
    startRecording,
    saveDataToCSV: saveData,
  };
}
