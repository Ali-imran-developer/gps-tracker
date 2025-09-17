import { useState, useMemo } from "react";
import { BarChart3, FileText, MapPin, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GoogleMap, LoadScript } from "@react-google-maps/api";

interface MapViewProps {
  onNavigate?: (page: string) => void;
}

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const containerStyle = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: 37.7749,
  lng: -122.4194,
};

const MapView = ({ onNavigate }: MapViewProps) => {
  const [activeControl, setActiveControl] = useState<string | null>(null);

  const topControls = useMemo(() => [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "reporting", label: "Reporting", icon: FileText },
    { id: "object-control", label: "Object Control", icon: MapPin },
    { id: "about", label: "About Us", icon: Info },
  ], []);

  const mapTools = useMemo(() => [
    { id: "add", icon: "/assets/icons/add.png" },
    { id: "minus", icon: "/assets/icons/minus.png" },
    { id: "send", icon: "/assets/icons/send.png" },
    { id: "text", icon: "/assets/icons/text.png" },
    { id: "map", icon: "/assets/icons/map.png" },
    { id: "car", icon: "/assets/icons/car.png" },
    { id: "verified", icon: "/assets/icons/verified.png" },
    { id: "km", icon: "/assets/icons/km.png" },
    { id: "camera", icon: "/assets/icons/camera.png" },
    { id: "directions", icon: "/assets/icons/directions.png" },
    { id: "frame", icon: "/assets/icons/frame.png" },
    { id: "chart", icon: "/assets/icons/chart.png" },
    { id: "print", icon: "/assets/icons/print.png" },
  ], []);

  const handleControlClick = (controlId: string) => {
    if (controlId === "dashboard") {
      onNavigate?.("dashboard");
    } else {
      setActiveControl(activeControl === controlId ? null : controlId);
    }
  };

  return (
    <div className="flex-1 relative bg-accent min-h-screen overflow-hidden">
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        {topControls.map((control) => {
          const IconComponent = control.icon;
          return (
            <Button
              key={control.id}
              variant="secondary"
              size="sm"
              className={cn(
                "gap-2 bg-map-control hover:bg-map-control-hover",
                activeControl === control.id && "bg-map-control-active text-white"
              )}
              onClick={() => handleControlClick(control.id)}
            >
              <IconComponent className="h-4 w-4" />
              {control.label}
            </Button>
          );
        })}
      </div>

      <div className="absolute top-4 right-4 z-10 flex flex-col gap-1">
        {mapTools.map((tool) => (
          <Button
            key={tool.id}
            variant="secondary"
            size="sm"
            className={cn(
              "w-10 h-10 p-0 bg-map-control hover:bg-map-control-hover bg-[#04003A]",
              activeControl === tool.id && "bg-map-control-active text-white"
            )}
            onClick={() => setActiveControl(activeControl === tool.id ? null : tool.id)}
          >
            <div className="w-6 h-6 mx-auto">
              <img
                src={tool.icon}
                alt={tool.id}
                className="w-full h-full object-contain"
              />
            </div>
          </Button>
        ))}
      </div>

      <div className="w-full h-screen">
        <LoadScript googleMapsApiKey={API_KEY}>
          <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
};

export default MapView;