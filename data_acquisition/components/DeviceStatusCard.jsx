import { Activity, Battery, Wifi, Moon, Clock, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DeviceStatusCard({ deviceStatus, signalQuality }) {
  const getStatusVariant = (status) => {
    switch (status) {
      case "great":
        return "success";
      case "good":
        return "secondary";
      case "bad":
        return "destructive";
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
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold">Device Status</CardTitle>
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
            <Badge variant={deviceStatus.sleepMode ? "secondary" : "outline"}>
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
        </div>
      </CardContent>
    </Card>
  );
}
