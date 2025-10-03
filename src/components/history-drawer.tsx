import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ensureArray } from "@/helper-functions/use-formater";

interface HistoryDrawerProps {
  historyOpen: boolean;
  historyData: any;
  onRowClick?: (lat: number, lng: number) => void;
}

export default function HistoryDrawer({ historyOpen, historyData, onRowClick }: HistoryDrawerProps) {
  const [minimized, setMinimized] = useState(false);

  useEffect(() => {
    if (historyOpen && historyData && historyData?.length > 0) {
      setMinimized(false);
    }
  }, [historyOpen, historyData]);

  if (!historyOpen || !historyData || historyData?.length === 0) return null;

  return (
    <div className={`absolute bottom-0 right-0 left-0 bg-white z-50 flex flex-col transition-all duration-300 ease-in-out ${minimized ? "h-[88px]" : "min-h-[250px] max-h-[300px]"}`}>
      <div className="overflow-x-auto">
        <div className="sticky top-0 z-10 bg-[#04003A] pe-6 text-white text-xs font-bold grid grid-cols-11 gap-2 p-2 border-b min-w-[800px]">
          <span className="col-span-2">DateTime</span>
          <span className="col-span-1">Ignition</span>
          <span className="col-span-1">Latitude</span>
          <span className="col-span-1">Longitude</span>
          <span className="col-span-1">Speed</span>
          <span className="col-span-4">Address</span>
          <span className="col-span-1">Total Distance</span>

          {minimized ? (
            <button className="absolute top-1 right-1 z-10" onClick={() => setMinimized(false)}>
              <ChevronUp className="text-white" />
            </button>
          ) : (
            <button className="absolute top-1 right-1 z-10" onClick={() => setMinimized(true)}>
              <ChevronDown className="text-white" />
            </button>
          )}
        </div>

        <div className={`overflow-y-auto transition-opacity duration-300 ${minimized ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
          {ensureArray(historyData)?.map((row: any, idx: number) => {
            const lat = parseFloat(row?.latitude);
            const lng = parseFloat(row?.longitude);

            return (
              <div key={idx} onClick={() => isFinite(lat) && isFinite(lng) && onRowClick?.(lat, lng)} className="hover:bg-gray-50 border-b border-gray-200 p-2 text-xs min-w-[800px] cursor-pointer">
                <div className="grid grid-cols-11 gap-2">
                  <span className="col-span-2">{row?.serverTime ?? ""}</span>
                  <span className="col-span-1">{row?.ignition ?? ""}</span>
                  <span className="col-span-1">{row?.latitude ?? ""}</span>
                  <span className="col-span-1">{row?.longitude ?? ""}</span>
                  <span className="col-span-1">{row?.speed ?? ""} km/h</span>
                  <span className="col-span-4">{row?.address ?? ""}</span>
                  <span className="col-span-1">{row?.totalDistance ?? ""}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
