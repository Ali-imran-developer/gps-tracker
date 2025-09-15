import { Settings, Wrench, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadialBarChart, RadialBar, ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line, BarChart, Bar, Cell, LabelList } from "recharts";

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

  const odometersData = [
    { name: "A", km: 150 },
    { name: "B", km: 200, label: 200, labelColor: "#fbbf24" }, // Yellow box
    { name: "C", km: 120, label: 100, labelColor: "#ef4444" }, // Red box
    { name: "D", km: 350, label: 300, labelColor: "#0ea5e9" }, // Blue box
    { name: "E", km: 320 },
  ];

  return (
    <div className="bg-background min-h-screen">
      <div className="flex items-center justify-between bg-[#04003A]">
        <h1 className="text-2xl font-bold text-white ms-6">Dashboard</h1>
        <Button  variant="outline" className="bg-transparent border-none rounded-none hover:bg-blue-950" onClick={() => onNavigate?.("main")}>
          <img src="/assets/icons/cross.png" alt="cross" />
        </Button>
      </div>

      <div className="p-6 space-y-6 ">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="rounded-none border-none shadow-md">
            <CardHeader className="flex flex-row items-center justify-between rounded-none space-y-0 bg-[#67CDFD] h-[20px]">
              <div className="text-white flex items-center gap-2">
                <img src="/assets/dashboard-icons/send.png" alt="send" />
                <CardTitle className="text-base font-medium">Objects</CardTitle>
              </div>
              <img src="/assets/dashboard-icons/setting.png" alt="setting" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <div className="relative">
                  <RadialBarChart width={200} height={200} cx="50%" cy="50%" innerRadius="80%" outerRadius="100%"
                    barSize={20} data={[{ name: "Progress", value: 75, fill: "#22c55e" }]} startAngle={90} endAngle={-270}>
                    <RadialBar dataKey="value" cornerRadius={10} />
                  </RadialBarChart>

                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-gray-700">75%</span>
                  </div>
                </div>
              </div>
              <h2 className="text-[#595959] text-center text-[24px]">Object control</h2>
            </CardContent>
          </Card>

          <Card className="rounded-none border-none shadow-md">
            <CardHeader className="flex flex-row items-center justify-between rounded-none space-y-0 bg-[#67CDFD] h-[20px]">
              <div className="text-white flex items-center gap-2">
                <img src="/assets/dashboard-icons/calender.png" alt="send" />
                <CardTitle className="text-base font-medium">Events (Today)</CardTitle>
              </div>
              <img src="/assets/dashboard-icons/setting.png" alt="setting" />
            </CardHeader>
            <CardContent>
              <div className="h-40 w-full">
                <ResponsiveContainer width="100%" height="100%" className="bg-[#E6E7E8] rounded-md mt-6">
                  <LineChart
                    data={[
                      { name: "Jan", value: 40 },
                      { name: "Feb", value: 55 },
                      { name: "Mar", value: 30 },
                      { name: "Apr", value: 80 },
                      { name: "May", value: 60 },
                      { name: "Jun", value: 90 },
                      { name: "Jul", value: 50 },
                      { name: "Aug", value: 75 },
                      { name: "Sep", value: 40 },
                      { name: "Oct", value: 95 },
                      { name: "Nov", value: 65 },
                      { name: "Dec", value: 70 },
                    ]}
                    margin={{ top: 35, right: 20, left: -30, bottom: -30 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} horizontal={false} />
                    <XAxis dataKey="name" tick={false} axisLine={false} tickLine={false} />
                    <YAxis tick={false} axisLine={false} tickLine={false} />
                    <Tooltip cursor={false} />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#2563eb"
                      strokeWidth={2}
                      dot={{ r: 4, fill: "#2563eb" }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <h2 className="text-[#595959] text-center text-[24px] mt-4">
                Events (Today)
              </h2>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between rounded-none space-y-0 bg-[#67CDFD] h-[20px]">
              <div className="text-white flex items-center gap-2">
                <img src="/assets/dashboard-icons/wrench.png" alt="send" />
                <CardTitle className="text-base font-medium">Maintenance</CardTitle>
              </div>
              <img src="/assets/dashboard-icons/setting.png" alt="setting" />
            </CardHeader>
            <CardContent>
              <div className="h-40 w-full mt-10">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: "1", value: 20 },
                      { name: "2", value: 40 },
                      { name: "3", value: 60 },
                      { name: "4", value: 80 },
                    ]}
                    margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
                  >
                    <XAxis
                      dataKey="name"
                      axisLine={true}
                      tickLine={false}
                      tick={{ fill: "#595959", fontSize: 12 }}
                    />

                    <YAxis
                      ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80]}
                      axisLine={true}
                      tickLine={false}
                      tick={{ fill: "#595959", fontSize: 12 }}
                    />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <Tooltip cursor={{ fill: "transparent" }} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {["#fbbf24", "#22c55e", "#2563eb", "#ef4444"].map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <h2 className="text-[#595959] text-center text-[24px]">
                Maintainance
              </h2>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between rounded-none space-y-0 bg-[#67CDFD] h-[20px]">
              <div className="text-white flex items-center gap-2">
                <img src="/assets/dashboard-icons/check.png" alt="send" />
                <CardTitle className="text-base font-medium">Task (Today)</CardTitle>
              </div>
              <img src="/assets/dashboard-icons/setting.png" alt="setting" />
            </CardHeader>
            <CardContent>
              <div className="space-y-5 mt-10">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="bg-[#727270] text-white h-[20px] mb-4 relative">
              <CardTitle className="text-lg pb-2 absolute top-2 left-4">110 Odometer Top 10 (km)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={odometerData} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
                    <CartesianGrid stroke="#000" strokeDasharray="0" vertical={false} />
                    <YAxis
                      ticks={[0, 10, 100, 200, 300, 400, 500]}
                      domain={[0, 500]}
                      tick={{ fill: "#000", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <XAxis dataKey="name" hide />
                    <Line
                      type="monotone"
                      dataKey="km"
                      stroke="#ef4444"
                      strokeWidth={2}
                      dot={{ r: 6, fill: "black" }}
                      isAnimationActive={false}
                    >
                      <LabelList
                        dataKey="label"
                        content={({ x, y, value, index }: any) => {
                          const item = odometersData[index];
                          if (!value) return null;
                          return (
                            <g>
                              <rect
                                x={x - 15}
                                y={y - 30}
                                width={30}
                                height={18}
                                fill={item?.labelColor}
                                rx={3}
                                ry={3}
                              />
                              <text
                                x={x}
                                y={y - 17}
                                textAnchor="middle"
                                fill="#fff"
                                fontSize={10}
                                fontWeight="bold"
                              >
                                {value}
                              </text>
                            </g>
                          );
                        }}
                      />
                    </Line>
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Mileage Map */}
          <Card>
            <CardHeader className="bg-[#727270] text-white h-[20px] relative">
              <CardTitle className="text-lg pb-2 absolute top-2 left-4">Mileage (km)</CardTitle>
            </CardHeader>
            <CardContent className="p-0 m-0">
              <img src="/assets/banner/dashboard-map-banner.png" alt="Dashboard Map" className="w-full h-[295px] object-cover" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;