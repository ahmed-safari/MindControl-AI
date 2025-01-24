"use client";
import { useState } from "react";
import useNeurosity from "@/hooks/useNeurosity";
import useSession from "@/hooks/useSession";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Play, Square, Save } from "lucide-react";
import DeviceStatusCard from "@/components/DeviceStatusCard";
import ActivityLogCard from "@/components/ActivityLogCard";

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Status Card */}
        <DeviceStatusCard
          deviceStatus={deviceStatus}
          signalQuality={signalQuality}
        />

        {/* Recording Settings */}

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
        <ActivityLogCard logMessages={logMessages} />
      </div>
    </div>
  );
}
