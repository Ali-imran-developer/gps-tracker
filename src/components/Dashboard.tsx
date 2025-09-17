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
    <div className="bg-background min-h-screen overflow-y-auto">
      <div className="flex items-center justify-between bg-[#04003A] h-12 lg:h-14 px-2 lg:px-6">
        <h1 className="text-lg lg:text-2xl font-bold text-white">Dashboard</h1>
        <Button variant="outline" className="bg-transparent border-none rounded-none hover:bg-blue-950 p-1 lg:p-2" onClick={() => onNavigate?.("main")}>
          <img src="/assets/icons/cross.png" alt="cross" className="w-4 h-4 lg:w-6 lg:h-6" />
        </Button>
      </div>

      <div className="p-2 lg:p-6 space-y-3 lg:space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4">
          <Card className="rounded-none border-none shadow-md">
            <CardHeader className="flex flex-row items-center justify-between rounded-none space-y-0 bg-[#67CDFD] h-[15px] lg:h-[20px] px-2 lg:px-4">
              <div className="text-white flex items-center gap-1 lg:gap-2">
                <img src="/assets/dashboard-icons/send.png" alt="send" className="w-3 h-3 lg:w-4 lg:h-4" />
                <CardTitle className="text-xs lg:text-base font-medium">Objects</CardTitle>
              </div>
              <img src="/assets/dashboard-icons/setting.png" alt="setting" className="w-3 h-3 lg:w-4 lg:h-4" />
            </CardHeader>
            <CardContent className="p-2 lg:p-6">
              <div className="flex items-center justify-center">
                <div className="relative">
                  <RadialBarChart width={120} height={120} cx="50%" cy="50%" innerRadius="70%" outerRadius="90%"
                    barSize={15} data={[{ name: "Progress", value: 75, fill: "#22c55e" }]} startAngle={90} endAngle={-270}
                    className="lg:w-[200px] lg:h-[200px]">
                    <RadialBar dataKey="value" cornerRadius={10} />
                  </RadialBarChart>

                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm lg:text-xl font-bold text-gray-700">75%</span>
                  </div>
                </div>
              </div>
              <h2 className="text-[#595959] text-center text-sm lg:text-[24px] mt-2">Object control</h2>
            </CardContent>
          </Card>

          <Card className="rounded-none border-none shadow-md">
            <CardHeader className="flex flex-row items-center justify-between rounded-none space-y-0 bg-[#67CDFD] h-[15px] lg:h-[20px] px-2 lg:px-4">
              <div className="text-white flex items-center gap-1 lg:gap-2">
                <img src="/assets/dashboard-icons/calender.png" alt="send" className="w-3 h-3 lg:w-4 lg:h-4" />
                <CardTitle className="text-xs lg:text-base font-medium">Events (Today)</CardTitle>
              </div>
              <img src="/assets/dashboard-icons/setting.png" alt="setting" className="w-3 h-3 lg:w-4 lg:h-4" />
            </CardHeader>
            <CardContent className="p-2 lg:p-6">
              <div className="h-24 lg:h-40 w-full">
                <ResponsiveContainer width="100%" height="100%" className="bg-[#E6E7E8] rounded-md mt-2 lg:mt-6">
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
                    margin={{ top: 20, right: 20, left: -30, bottom: -30 }}
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
                      dot={{ r: 3, fill: "#2563eb" }}
                      activeDot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <h2 className="text-[#595959] text-center text-sm lg:text-[24px] mt-2">
                Events (Today)
              </h2>
            </CardContent>
          </Card>

          <Card className="rounded-none border-none shadow-md">
            <CardHeader className="flex flex-row items-center justify-between rounded-none space-y-0 bg-[#67CDFD] h-[15px] lg:h-[20px] px-2 lg:px-4">
              <div className="text-white flex items-center gap-1 lg:gap-2">
                <img src="/assets/dashboard-icons/wrench.png" alt="send" className="w-3 h-3 lg:w-4 lg:h-4" />
                <CardTitle className="text-xs lg:text-base font-medium">Maintenance</CardTitle>
              </div>
              <img src="/assets/dashboard-icons/setting.png" alt="setting" className="w-3 h-3 lg:w-4 lg:h-4" />
            </CardHeader>
            <CardContent className="p-2 lg:p-6">
              <div className="h-24 lg:h-40 w-full mt-4 lg:mt-10">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: "1", value: 20 },
                      { name: "2", value: 40 },
                      { name: "3", value: 60 },
                      { name: "4", value: 80 },
                    ]}
                    margin={{ top: 10, right: 15, left: 5, bottom: 0 }}
                  >
                    <XAxis
                      dataKey="name"
                      axisLine={true}
                      tickLine={false}
                      tick={{ fill: "#595959", fontSize: 10 }}
                    />

                    <YAxis
                      ticks={[0, 20, 40, 60, 80]}
                      axisLine={true}
                      tickLine={false}
                      tick={{ fill: "#595959", fontSize: 10 }}
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
              <h2 className="text-[#595959] text-center text-sm lg:text-[24px] mt-2">
                Maintenance
              </h2>
            </CardContent>
          </Card>

          <Card className="rounded-none border-none shadow-md">
            <CardHeader className="flex flex-row items-center justify-between rounded-none space-y-0 bg-[#67CDFD] h-[15px] lg:h-[20px] px-2 lg:px-4">
              <div className="text-white flex items-center gap-1 lg:gap-2">
                <img src="/assets/dashboard-icons/check.png" alt="send" className="w-3 h-3 lg:w-4 lg:h-4" />
                <CardTitle className="text-xs lg:text-base font-medium">Task (Today)</CardTitle>
              </div>
              <img src="/assets/dashboard-icons/setting.png" alt="setting" className="w-3 h-3 lg:w-4 lg:h-4" />
            </CardHeader>
            <CardContent className="p-2 lg:p-6">
              <div className="space-y-2 lg:space-y-5 mt-4 lg:mt-10">
                {dailyTasks.slice(0, 4).map((task, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="truncate text-xs lg:text-sm">{task.name}</span>
                      <span className="text-xs lg:text-sm">{task.progress}%</span>
                    </div>
                    <Progress value={task.progress} className="h-1 lg:h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-6">
          <Card className="rounded-none border-none shadow-md">
            <CardHeader className="bg-[#727270] text-white h-[15px] lg:h-[20px] mb-2 lg:mb-4 relative px-2 lg:px-4">
              <CardTitle className="text-sm lg:text-lg pb-2 absolute top-1 lg:top-2 left-2 lg:left-4">110 Odometer Top 10 (km)</CardTitle>
            </CardHeader>
            <CardContent className="p-2 lg:p-6">
              <div className="h-32 lg:h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={odometerData} margin={{ top: 20, right: 15, left: 0, bottom: 10 }}>
                    <CartesianGrid stroke="#000" strokeDasharray="0" vertical={false} />
                    <YAxis
                      ticks={[0, 100, 200, 300, 400, 500]}
                      domain={[0, 500]}
                      tick={{ fill: "#000", fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <XAxis dataKey="name" hide />
                    <Line
                      type="monotone"
                      dataKey="km"
                      stroke="#ef4444"
                      strokeWidth={2}
                      dot={{ r: 4, fill: "black" }}
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
                                x={x - 12}
                                y={y - 25}
                                width={24}
                                height={15}
                                fill={item?.labelColor}
                                rx={3}
                                ry={3}
                              />
                              <text
                                x={x}
                                y={y - 15}
                                textAnchor="middle"
                                fill="#fff"
                                fontSize={8}
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
          <Card className="rounded-none border-none shadow-md">
            <CardHeader className="bg-[#727270] text-white h-[15px] lg:h-[20px] relative px-2 lg:px-4">
              <CardTitle className="text-sm lg:text-lg pb-2 absolute top-1 lg:top-2 left-2 lg:left-4">Mileage (km)</CardTitle>
            </CardHeader>
            <CardContent className="p-0 m-0">
              <img src="/assets/banner/dashboard-map-banner.png" alt="Dashboard Map" className="w-full h-32 lg:h-[295px] object-cover" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;