import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ActivityLogCard({ logMessages }) {
  return (
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
  );
}
