import { X } from "lucide-react";
import { ensureArray } from "@/helper-functions/use-formater";
import { formatDate } from "@/utils/format-date";

interface HistoryDrawerProps {
  historyOpen: boolean;
  historyData: any;
  onRowClick?: (lat: number, lng: number) => void;
  onClose: () => void;
}

export default function HistoryDrawer({ historyOpen, historyData, onRowClick, onClose }: HistoryDrawerProps) {
  if (!historyOpen || !historyData || historyData?.length === 0) return null;

  return (
    <div className="absolute bottom-0 right-0 left-0 bg-white z-50 flex flex-col transition-all duration-300 ease-in-out min-h-[250px] max-h-[300px] shadow-lg border-t border-gray-300">
      <div className="overflow-x-auto">
        <div className="sticky top-0 z-10 bg-[#04003A] pe-6 text-white text-xs font-bold grid grid-cols-12 gap-2 p-2 border-b min-w-[800px]">
          <span className="col-span-1">Device</span>
          <span className="col-span-2 ms-4">DateTime</span>
          <span className="col-span-1">Ignition</span>
          <span className="col-span-1">Latitude</span>
          <span className="col-span-1">Longitude</span>
          {historyData[0]?.speed && (<span className="col-span-1">Speed</span>)}
          <span className="col-span-4">Address</span>
          {historyData[0]?.speed && (<span className="col-span-1">Total Distance</span>)}

          <button className="absolute top-2 right-2 text-white hover:text-gray-300" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* <div className={`overflow-y-auto transition-opacity duration-300 ${minimized ? "opacity-0 pointer-events-none" : "opacity-100"}`}> */}
        <div className="overflow-y-auto"> 
          {ensureArray(historyData)?.map((row: any, idx: number) => {
            const lat = parseFloat(row?.latitude);
            const lng = parseFloat(row?.longitude);

            return (
              <div key={idx} onClick={() => isFinite(lat) && isFinite(lng) && onRowClick?.(lat, lng)} className="hover:bg-gray-50 border-b border-gray-200 p-2 text-xs min-w-[800px] cursor-pointer">
                <div className="grid grid-cols-12 gap-2">
                  <span className="col-span-1 text-[10px]">{row?.deviceName ?? ""}</span>
                  <span className="col-span-2 ms-4">{formatDate(row?.serverTime ?? row?.eventTime ?? row?.DateTime1) ?? ""}</span>
                  <span className="col-span-1">{row?.ignition ?? row?.type ?? ""}</span>
                  <span className="col-span-1">
                    {Number(row?.latitude) && !isNaN(Number(row?.latitude)) ? Number(row.latitude)?.toFixed(4) : row?.latitude ?? ""}
                  </span>
                  <span className="col-span-1">
                    {Number(row?.longitude) && !isNaN(Number(row?.longitude)) ? Number(row.longitude).toFixed(4) : row?.longitude ?? ""}
                  </span>
                  {row?.speed && (<span className="col-span-1">{row?.speed ?? ""} km/h</span>)}
                  <span className="col-span-4">{row?.address !== "" ? row?.address : "No Address"}</span>
                  {row?.totalDistance && (<span className="col-span-1">{row?.totalDistance ?? ""}</span>)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
