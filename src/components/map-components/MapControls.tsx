import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MapControlsProps {
  controls: Array<{ id: string; icon: any; label: string }>;
  activeControl: string | null;
  onControlClick: (controlId: string) => void;
  position: "top-left" | "top-right";
  type?: "primary" | "tools";
}

export const MapControls: React.FC<MapControlsProps> = ({
  controls,
  activeControl,
  onControlClick,
  position,
  type = "primary",
}) => {
  const isLeft = position === "top-left";
  const isTools = type === "tools";

  return (
    <div
      className={`absolute top-2 sm:top-4 ${
        isLeft ? "left-2 sm:left-4" : "right-2 sm:right-4"
      } z-10 ${
        isLeft
          ? "flex flex-wrap gap-1 sm:gap-2"
          : "flex flex-col gap-0.5 sm:gap-1"
      }`}
    >
      {controls.map((control) => {
        const IconComponent = control.icon;

        return (
          <Button
            key={control.id}
            variant="secondary"
            size="sm"
            className={cn(
              isTools
                ? "w-7 h-7 sm:w-8 sm:h-8 p-0 bg-[#04003A] hover:bg-map-control-hover"
                : "gap-1 sm:gap-2 bg-map-control hover:bg-map-control-hover text-xs sm:text-sm px-2 sm:px-3 h-7 sm:h-8",
              activeControl === control.id && "bg-map-control-active text-white"
            )}
            onClick={() => onControlClick(control.id)}
          >
            {isTools ? (
              <div className="w-3 h-3 sm:w-4 sm:h-4 mx-auto">
                <img
                  src={control.icon}
                  alt={control.id}
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <>
                <IconComponent className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">{control.label}</span>
              </>
            )}
          </Button>
        );
      })}
    </div>
  );
};
