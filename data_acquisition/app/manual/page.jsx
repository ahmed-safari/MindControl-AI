"use client";
import { useState } from "react";
import useNeurosity from "@/hooks/useNeurosity";
import useSession from "@/hooks/useSession";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  Battery,
  Play,
  Square,
  Save,
  Wifi,
  Moon,
  Clock,
  Zap,
} from "lucide-react";

export default function Home() {
  const [logMessages, setLogMessages] = useState([]);

  const { neurosity, deviceStatus, signalQuality } =
    useNeurosity(setLogMessages);

  const {
    participantName,
    setParticipantName,
    frequency,
    setFrequency,
    recordTime,
    setRecordTime,
    isRecording,
    startRecording,
    stopRecording,
    saveData,
  } = useSession(neurosity, setLogMessages);

  //   // Helper function to get badge variant based on status
  //   const getStatusVariant = (status) => {
  //     switch (status) {
  //       case "great":
  //         return "success";
  //       case "good":
  //         return "secondary";
  //       case "bad":
  //         return "warning";
  //       case "noContact":
  //         return "destructive";
  //       default:
  //         return "outline";
  //     }
  //   };
  const getStatusVariant = (status) => {
    switch (status) {
      case "great":
        return "success"; // We'll use the new success variant
      case "good":
        return "secondary";
      case "bad":
        return "destructive"; // We'll use the new warning variant
      case "noContact":
        return "destructive";
      default:
        return "outline";
    }
  };

  // Helper function to split channels into two rows
  const renderSignalQuality = (signalQuality) => {
    if (!signalQuality) return <Badge variant="outline">Not available</Badge>;

    // Define channel names in the correct order
    const channelNames = ["CP3", "C3", "F5", "PO3", "PO4", "F6", "C4", "CP4"];
    const firstRow = channelNames.slice(0, 4);
    const secondRow = channelNames.slice(4);

    return (
      <div className="flex flex-col gap-1.5">
        <div className="flex gap-1.5">
          {firstRow.map((channel, index) => (
            <Badge
              key={channel}
              variant={getStatusVariant(signalQuality[index]?.status)}
              className="text-xs min-w-[48px] justify-center"
            >
              {channel}
            </Badge>
          ))}
        </div>
        <div className="flex gap-1.5">
          {secondRow.map((channel, index) => (
            <Badge
              key={channel}
              variant={getStatusVariant(signalQuality[index + 4]?.status)}
              className="text-xs min-w-[48px] justify-center"
            >
              {channel}
            </Badge>
          ))}
        </div>
      </div>
    );
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Status Card */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold">
                Device Status
              </CardTitle>
              <Badge
                variant={
                  deviceStatus.state === "online" ? "success" : "destructive"
                }
                className="text-sm"
              >
                {deviceStatus.state}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Moon className="h-5 w-5 text-slate-500" />
                <span className="text-sm text-slate-600">Sleep Mode:</span>
                <Badge
                  variant={deviceStatus.sleepMode ? "secondary" : "outline"}
                >
                  {deviceStatus.sleepMode ? "Enabled" : "Disabled"}
                </Badge>
              </div>

              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-slate-500" />
                <span className="text-sm text-slate-600">Charging:</span>
                <Badge variant={deviceStatus.charging ? "success" : "outline"}>
                  {deviceStatus.charging ? "Yes" : "No"}
                </Badge>
              </div>

              <div className="flex items-center space-x-2">
                <Battery className="h-5 w-5 text-slate-500" />
                <span className="text-sm text-slate-600">Battery:</span>
                <Badge
                  variant="outline"
                  className={deviceStatus.battery < 20 ? "text-red-500" : ""}
                >
                  {deviceStatus.battery}%
                </Badge>
              </div>

              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-slate-500" />
                <span className="text-sm text-slate-600">Last Heartbeat:</span>
                <span className="text-sm font-medium">
                  {new Date(deviceStatus.lastHeartbeat).toLocaleString()}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Wifi className="h-5 w-5 text-slate-500" />
                <span className="text-sm text-slate-600">SSID:</span>
                <Badge variant="outline">{deviceStatus.ssid}</Badge>
              </div>

              <div className="flex items-start space-x-2">
                <Activity className="h-5 w-5 text-slate-500 mt-1" />
                <div className="flex flex-col">
                  <span className="text-sm text-slate-600 mb-1">
                    Signal Quality:
                  </span>
                  {renderSignalQuality(signalQuality)}
                </div>
              </div>
              {/* <div className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-slate-500" />
                <span className="text-sm text-slate-600">Signal Quality:</span>
                <div className="flex gap-1">
                  {signalQuality ? (
                    signalQuality.map((channel, index) => (
                      <Badge
                        key={index}
                        variant={
                          channel.status === "good" ? "success" : "warning"
                        }
                        className="text-xs"
                      >
                        CH{index + 1}
                      </Badge>
                    ))
                  ) : (
                    <Badge variant="outline">Not available</Badge>
                  )}
                </div>
              </div> */}
            </div>
          </CardContent>
        </Card>

        {!neurosity ? (
          <Card>
            <CardContent className="py-8">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                <p className="text-lg text-slate-600">
                  Connecting to Neurosity device...
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Recording Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-600">
                    Participant ID
                  </label>
                  <Input
                    value={participantName}
                    onChange={(e) => setParticipantName(e.target.value)}
                    placeholder="60xxxxxx"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-600">
                    Frequency (Hz)
                  </label>
                  <Input
                    type="number"
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    placeholder="e.g. 10"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-600">
                    Duration (s)
                  </label>
                  <Input
                    type="number"
                    value={recordTime}
                    onChange={(e) => setRecordTime(e.target.value)}
                    placeholder="e.g. 5"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-4 justify-center pt-4">
                <Button
                  onClick={startRecording}
                  disabled={
                    isRecording ||
                    deviceStatus.sleepMode ||
                    deviceStatus.state === "Disconnected" ||
                    deviceStatus.state === "offline"
                  }
                  className="min-w-[120px]"
                  variant={isRecording ? "secondary" : "default"}
                >
                  <Play className="mr-2 h-4 w-4" />
                  {isRecording ? "Recording..." : "Start"}
                </Button>

                <Button
                  onClick={stopRecording}
                  disabled={!isRecording}
                  variant="destructive"
                  className="min-w-[120px]"
                >
                  <Square className="mr-2 h-4 w-4" />
                  Stop
                </Button>

                <Button
                  onClick={saveData}
                  disabled={isRecording}
                  variant="outline"
                  className="min-w-[120px]"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save CSV
                </Button>
              </div>

              {isRecording && (
                <div className="mt-4 p-4 bg-indigo-50 rounded-lg">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-pulse h-3 w-3 rounded-full bg-indigo-500"></div>
                    <p className="text-indigo-700 font-medium">
                      Recording at {frequency} Hz for {recordTime} seconds...
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Log Messages */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Activity Log</CardTitle>
              <Badge variant="outline" className="text-xs">
                {logMessages.length} entries
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
              {logMessages.map((msg, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 text-sm p-2 rounded-lg bg-slate-50 border border-slate-100"
                >
                  <div className="w-1 h-1 rounded-full bg-slate-400"></div>
                  <span className="text-slate-600">{msg}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
