import { useState, useEffect } from "react";

export default function useNeurosity(setLogMessages) {
  const [neurosity, setNeurosity] = useState(null);
  const [deviceStatus, setDeviceStatus] = useState({
    state: "Disconnected",
    sleepMode: false,
    charging: false,
    battery: 0,
    lastHeartbeat: "Never",
    ssid: "Not connected",
  });
  const [signalQuality, setSignalQuality] = useState(0);

  const initNeurosity = async () => {
    const { Neurosity } = await import("@neurosity/sdk");
    const deviceId = process.env.NEXT_PUBLIC_DEVICE_ID;
    console.log("Device ID:", deviceId);
    const neurosity = new Neurosity({
      deviceId,
    });
    return neurosity;
  };

  const monitorStatus = (neurosity) => {
    if (!neurosity) {
      console.error("Neurosity is not initialized");
      setLogMessages((prev) => [...prev, "Neurosity is not initialized"]);
      return;
    }
    console.log("Starting status monitor..");
    setLogMessages((prev) => [...prev, "Starting status monitor.."]);
    neurosity.status().subscribe((status) => {
      setDeviceStatus(status);
    });
    neurosity.signalQuality().subscribe((signalQuality) => {
      setSignalQuality(signalQuality);
    });
  };

  useEffect(() => {
    initNeurosity().then((neurosity) => {
      setNeurosity(neurosity);
    });
  }, []);

  useEffect(() => {
    if (!neurosity) {
      return;
    }

    neurosity
      .login({
        email: process.env.NEXT_PUBLIC_EMAIL,
        password: process.env.NEXT_PUBLIC_PASSWORD,
      })
      .then(() => {
        console.log("Logged in to Neurosity device");
        setLogMessages((prev) => [...prev, "Logged in to Neurosity device"]);
        monitorStatus(neurosity);
      })
      .catch((error) => {
        console.error("Failed to login to Neurosity device:", error);
        setLogMessages((prev) => [
          ...prev,
          `Failed to login to Neurosity device: ${error}`,
        ]);
      });
  }, [neurosity]);

  return { neurosity, deviceStatus, signalQuality };
}
