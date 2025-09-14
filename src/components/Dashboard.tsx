import { Settings, Wrench, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface DashboardProps {
  onNavigate?: (page: string) => void;
}

const Dashboard = ({ onNavigate }: DashboardProps) => {
  const dailyTasks = [
    { name: "Vehicle Inspection", progress: 75 },
    { name: "Route Planning", progress: 90 },
    { name: "Fuel Monitoring", progress: 60 },
    { name: "Driver Assignment", progress: 45 },
    { name: "Maintenance Check", progress: 85 },
  ];

  const odometerData = [
    { vehicle: "V-001", km: 200, color: "bg-warning" },
    { vehicle: "V-002", km: 100, color: "bg-danger" },
    { vehicle: "V-003", km: 300, color: "bg-primary" },
  ];

  const mileageLocations = [
    { city: "Karachi", mileage: 1250 },
    { city: "Lahore", mileage: 980 },
    { city: "Islamabad", mileage: 750 },
    { city: "Faisalabad", mileage: 640 },
  ];

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button 
          variant="outline" 
          onClick={() => onNavigate?.("main")}
        >
          Back to Map
        </Button>
      </div>

      {/* Top Row - 4 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Objects Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Objects</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-32">
              <div className="relative w-24 h-24">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-muted"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 40 * 0.75} ${2 * Math.PI * 40}`}
                    className="text-success"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold">75%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Events Today Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Events (Today)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-32 flex items-end space-x-1">
              {Array.from({ length: 12 }, (_, i) => (
                <div
                  key={i}
                  className="bg-primary flex-1 rounded-sm"
                  style={{ height: `${Math.random() * 80 + 20}%` }}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Events (Today)</p>
          </CardContent>
        </Card>

        {/* Maintenance Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
            <div className="flex items-center gap-2">
              <Wrench className="h-4 w-4 text-muted-foreground" />
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-32 flex items-end justify-between space-x-2">
              <div className="flex flex-col items-center">
                <div className="bg-warning h-16 w-6 rounded-sm mb-1"></div>
                <span className="text-xs">20</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-success h-20 w-6 rounded-sm mb-1"></div>
                <span className="text-xs">40</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-primary h-24 w-6 rounded-sm mb-1"></div>
                <span className="text-xs">60</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-danger h-28 w-6 rounded-sm mb-1"></div>
                <span className="text-xs">80</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Daily Tasks Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Daily Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dailyTasks.slice(0, 4).map((task, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="truncate">{task.name}</span>
                    <span>{task.progress}%</span>
                  </div>
                  <Progress value={task.progress} className="h-1" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row - 2 Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Odometer Data */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">110 Odometer Top 10 (km)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 relative">
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-muted-foreground">
                <span>400</span>
                <span>300</span>
                <span>200</span>
                <span>100</span>
                <span>0</span>
              </div>
              
              {/* Chart area */}
              <div className="ml-8 h-full border-l border-b border-border relative">
                {odometerData.map((item, index) => (
                  <div
                    key={index}
                    className="absolute w-3 h-3 rounded-full bg-foreground"
                    style={{
                      left: `${(index + 1) * 20}%`,
                      bottom: `${(item.km / 400) * 100}%`,
                    }}
                  />
                ))}
              </div>
              
              {/* Value boxes */}
              <div className="flex gap-2 mt-4">
                {odometerData.map((item, index) => (
                  <div
                    key={index}
                    className={`px-2 py-1 rounded text-white text-xs font-medium ${item.color}`}
                  >
                    {item.km}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mileage Map */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Mileage (km)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-accent rounded-lg relative overflow-hidden">
              {/* Simplified map representation */}
              <div className="absolute inset-4">
                {mileageLocations.map((location, index) => (
                  <div
                    key={index}
                    className="absolute"
                    style={{
                      left: `${Math.random() * 70 + 10}%`,
                      top: `${Math.random() * 60 + 10}%`,
                    }}
                  >
                    <div className="w-4 h-4 bg-danger rounded-full"></div>
                    <div className="absolute top-5 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                      <div className="text-xs font-medium">{location.city}</div>
                      <div className="text-xs text-muted-foreground">{location.mileage}km</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;