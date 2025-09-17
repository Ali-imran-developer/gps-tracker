import { useState, useMemo } from "react";
import { BarChart3, FileText, MapPin, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MapViewProps {
  onNavigate?: (page: string) => void;
}

const MapView = ({ onNavigate }: MapViewProps) => {
  const [activeControl, setActiveControl] = useState<string | null>(null);

  const topControls = useMemo(() => [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "reporting", label: "Reporting", icon: FileText },
    { id: "object-control", label: "Object Control", icon: MapPin },
    { id: "about", label: "About Us", icon: Info },
  ], []);

  const mapTools = useMemo(() => [
    { id: "add", label: "Add", icon: "/assets/icons/add.png" },
    { id: "minus", label: "Remove", icon: "/assets/icons/minus.png" },
    { id: "send", label: "Send", icon: "/assets/icons/send.png" },
    { id: "text", label: "Text", icon: "/assets/icons/text.png" },
    { id: "map", label: "Map", icon: "/assets/icons/map.png" },
    { id: "car", label: "Vehicle", icon: "/assets/icons/car.png" },
    { id: "verified", label: "Verify", icon: "/assets/icons/verified.png" },
    { id: "km", label: "Distance", icon: "/assets/icons/km.png" },
    { id: "camera", label: "Camera", icon: "/assets/icons/camera.png" },
    { id: "directions", label: "Directions", icon: "/assets/icons/directions.png" },
    { id: "frame", label: "Frame", icon: "/assets/icons/frame.png" },
    { id: "chart", label: "Chart", icon: "/assets/icons/chart.png" },
    { id: "print", label: "Print", icon: "/assets/icons/print.png" },
  ], []);

  const handleControlClick = (controlId: string) => {
    if (controlId === "dashboard") {
      onNavigate?.("dashboard");
    } else {
      setActiveControl(activeControl === controlId ? null : controlId);
    }
  };

  return (
    <div className="flex-1 relative bg-gradient-to-br from-accent via-muted to-accent/50 min-h-screen overflow-hidden">
      {/* Top Controls - Responsive */}
      <div className="absolute top-2 lg:top-4 left-2 lg:left-4 z-10 flex flex-wrap gap-1 lg:gap-2 max-w-[calc(100%-1rem)] lg:max-w-none">
        {topControls.map((control) => {
          const IconComponent = control.icon;
          return (
            <Button
              key={control.id}
              variant="secondary"
              size="sm"
              className={cn(
                "gap-1 lg:gap-2 bg-map-control hover:bg-map-control-hover text-xs lg:text-sm px-2 lg:px-3 py-1 lg:py-2 h-8 lg:h-auto",
                activeControl === control.id && "bg-map-control-active text-white"
              )}
              onClick={() => handleControlClick(control.id)}
            >
              <IconComponent className="h-3 w-3 lg:h-4 lg:w-4" />
              <span className="hidden sm:inline">{control.label}</span>
            </Button>
          );
        })}
      </div>

      {/* Side Tools - Responsive Grid */}
      <div className="absolute top-16 lg:top-4 right-2 lg:right-4 z-10 grid grid-cols-3 sm:grid-cols-4 lg:flex lg:flex-col gap-1 lg:gap-1">
        {mapTools.map((tool) => (
          <Button
            key={tool.id}
            variant="secondary"
            size="sm"
            title={tool.label}
            className={cn(
              "w-8 h-8 lg:w-10 lg:h-10 p-0 bg-map-control hover:bg-map-control-hover bg-[#04003A] transition-all duration-200",
              activeControl === tool.id && "bg-map-control-active text-white scale-105"
            )}
            onClick={() => setActiveControl(activeControl === tool.id ? null : tool.id)}
          >
            <div className="w-4 h-4 lg:w-6 lg:h-6 mx-auto">
              <img
                src={tool.icon}
                alt={tool.label}
                className="w-full h-full object-contain filter brightness-0 invert"
              />
            </div>
          </Button>
        ))}
      </div>

      {/* Main Content Area - Beautiful Background */}
      <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat'
          }}></div>
        </div>
        
        {/* Central Content */}
        <div className="text-center z-10 px-4">
          <div className="mb-6 lg:mb-8">
            <div className="w-16 h-16 lg:w-24 lg:h-24 mx-auto mb-4 bg-primary rounded-full flex items-center justify-center">
              <MapPin className="w-8 h-8 lg:w-12 lg:h-12 text-primary-foreground" />
            </div>
            <h2 className="text-xl lg:text-3xl font-bold text-foreground mb-2">GPS Tracking System</h2>
            <p className="text-sm lg:text-base text-muted-foreground max-w-md mx-auto">
              Monitor and track your vehicles in real-time with our advanced GPS tracking solution
            </p>
          </div>
          
          {/* Feature Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 max-w-2xl mx-auto">
            {[
              { icon: BarChart3, title: "Analytics", desc: "Real-time data" },
              { icon: MapPin, title: "Tracking", desc: "Live location" },
              { icon: FileText, title: "Reports", desc: "Detailed insights" },
              { icon: Info, title: "Support", desc: "24/7 assistance" },
            ].map((feature, index) => (
              <div key={index} className="bg-card/50 backdrop-blur-sm rounded-lg p-3 lg:p-4 border border-border/20 hover:bg-card/70 transition-all duration-200">
                <feature.icon className="w-6 h-6 lg:w-8 lg:h-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold text-xs lg:text-sm mb-1">{feature.title}</h3>
                <p className="text-xs text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;