import { useState } from "react";

export const useMapControls = (onNavigate?: (route: string) => void) => {
  const [activeControl, setActiveControl] = useState<string | null>(null);

  const handleControlClick = (controlId: string) => {
    if (controlId === "dashboard") {
      onNavigate?.("dashboard");
    } else {
      setActiveControl(activeControl === controlId ? null : controlId);
    }
  };

  return { activeControl, handleControlClick };
};
