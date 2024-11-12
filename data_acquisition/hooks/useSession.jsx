import { useState, useEffect, useRef } from "react";
import {
  triangles,
  loadingMessages,
  triangleTimer,
  noiseTimer,
} from "../constants/constants";
import useBrainwaveData from "./useBrainwaveData";

export default function useSession(neurosity, setLogMessages) {
  const [started, setStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [blink, setBlink] = useState(true);
  const [currentStimulus, setCurrentStimulus] = useState("noise");
  const [currentFrequency, setCurrentFrequency] = useState(0);

  const currentStimulusRef = useRef(currentStimulus);
  const currentFrequencyRef = useRef(currentFrequency);

  const { startRecording, saveDataToCSV } = useBrainwaveData(
    neurosity,
    currentStimulusRef,
    currentFrequencyRef,
    setLogMessages
  );

  useEffect(() => {
    currentStimulusRef.current = currentStimulus;
  }, [currentStimulus]);

  useEffect(() => {
    currentFrequencyRef.current = currentFrequency;
  }, [currentFrequency]);

  useEffect(() => {
    let blinkTimer;
    let stepTimer;
    let subscription;

    if (started) {
      if (currentStep === -1) {
        subscription = startRecording();
        setCurrentStimulus("noise");
        setCurrentFrequency(0);

        setLogMessages((prev) => [
          ...prev,
          "Session started. Showing instruction message.",
        ]);
        stepTimer = setTimeout(() => {
          setCurrentStep(0);
        }, noiseTimer);
      } else if (currentStep < triangles.length * 2) {
        const isTriangleStep = currentStep % 2 === 0;

        if (isTriangleStep) {
          const triangleIndex = Math.floor(currentStep / 2);
          const triangle = triangles[triangleIndex];
          const frequency = triangle.frequency;
          setCurrentStimulus("triangle");
          setCurrentFrequency(frequency);
          const interval = (1 / (2 * frequency)) * 1000;

          setLogMessages((prev) => [
            ...prev,
            `Showing triangle with frequency ${frequency} Hz.`,
          ]);

          blinkTimer = setInterval(() => {
            setBlink((prev) => !prev);
          }, interval);

          stepTimer = setTimeout(() => {
            clearInterval(blinkTimer);
            setBlink(true);
            setCurrentStep((prev) => prev + 1);
          }, triangleTimer);
        } else {
          setCurrentStimulus("noise");
          setCurrentFrequency(0);
          const loadingMessageIndex =
            Math.floor(currentStep / 2) % loadingMessages.length;
          const loadingMessage = loadingMessages[loadingMessageIndex];
          setLogMessages((prev) => [
            ...prev,
            `Showing loading message: "${loadingMessage}"`,
          ]);

          stepTimer = setTimeout(() => {
            setCurrentStep((prev) => prev + 1);
          }, noiseTimer);
        }
      } else {
        if (subscription) {
          subscription.unsubscribe();
        }
        saveDataToCSV();
        setLogMessages((prev) => [...prev, "Session ended."]);
        setStarted(false);
        setCurrentStep(-1);
      }
    }

    return () => {
      clearInterval(blinkTimer);
      clearTimeout(stepTimer);
    };
  }, [started, currentStep]);

  const startSession = () => {
    setStarted(true);
    setCurrentStep(-1);
    setLogMessages([]);
  };

  return {
    started,
    currentStep,
    blink,
    startSession,
    triangles,
    loadingMessages,
  };
}
