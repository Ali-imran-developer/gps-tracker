import { useState } from "react";
import { 
  BarChart3, 
  FileText, 
  MapPin, 
  Info, 
  Plus, 
  Minus, 
  Locate, 
  Type,
  Layers,
  Navigation
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MapViewProps {
  onNavigate?: (page: string) => void;
}

const MapView = ({ onNavigate }: MapViewProps) => {
  const [activeControl, setActiveControl] = useState<string | null>(null);

  const topControls = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "reporting", label: "Reporting", icon: FileText },
    { id: "object-control", label: "Object Control", icon: MapPin },
    { id: "about", label: "About Us", icon: Info },
  ];

  const mapTools = [
    { id: "zoom-in", icon: Plus },
    { id: "zoom-out", icon: Minus },
    { id: "locate", icon: Locate },
    { id: "text", icon: Type },
    { id: "layers", icon: Layers },
    { id: "navigation", icon: Navigation },
  ];

  const handleControlClick = (controlId: string) => {
    if (controlId === "dashboard") {
      onNavigate?.("dashboard");
    } else {
      setActiveControl(activeControl === controlId ? null : controlId);
    }
  };

  return (
    <div className="flex-1 relative bg-accent">
      {/* Top Controls */}
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

      {/* Right Side Map Tools */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-1">
        {mapTools.map((tool) => {
          const IconComponent = tool.icon;
          return (
            <Button
              key={tool.id}
              variant="secondary"
              size="sm"
              className={cn(
                "w-10 h-10 p-0 bg-map-control hover:bg-map-control-hover",
                activeControl === tool.id && "bg-map-control-active text-white"
              )}
              onClick={() => setActiveControl(activeControl === tool.id ? null : tool.id)}
            >
              <IconComponent className="h-4 w-4" />
            </Button>
          );
        })}
      </div>

      {/* Map Content Placeholder */}
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Interactive Map View</h3>
          <p className="text-muted-foreground">
            Real-time GPS tracking visualization will be displayed here
          </p>
          {/* Sample Location Markers */}
          <div className="mt-8 grid grid-cols-2 gap-4 max-w-md mx-auto">
            <div className="bg-card p-3 rounded-lg border">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-success rounded-full"></div>
                <span className="text-sm font-medium">Chak 92/TL</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">Active Vehicle</div>
            </div>
            <div className="bg-card p-3 rounded-lg border">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-warning rounded-full"></div>
                <span className="text-sm font-medium">Chak 121/L</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">Idle Vehicle</div>
            </div>
            <div className="bg-card p-3 rounded-lg border">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-success rounded-full"></div>
                <span className="text-sm font-medium">Chak 45 P</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">Moving</div>
            </div>
            <div className="bg-card p-3 rounded-lg border">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-danger rounded-full"></div>
                <span className="text-sm font-medium">Chak 119/L</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">Maintenance</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;