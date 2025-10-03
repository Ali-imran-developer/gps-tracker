import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import ObjectsTable from "./Objects-table";
import EventsTable from "./Events-table";
import PlacesTable from "./Places-table";
import { useSelector } from "react-redux";
import { useZones } from "@/hooks/zones-hook";
import CreateGeofence from "./create-geofence";
import { ensureArray } from "@/helper-functions/use-formater";
import HistoryTable from "./history-table";
import { headerIcons, historyIcons } from "@/data/sidebar-icons-data";

interface SidebarProps {
  selectedItems: any[];
  loader: boolean;
  geoFenceData: any;
  trackLocations: any;
  eventsData: any;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onSelectionChange?: (selected: any[]) => void;
  page: number;
  totalPages: number;
  handleNext: () => void;
  handlePrevious: () => void;
  onMoreClick: (val: any) => void;
  setHistoryData: any;
  setHistoryOpen?: (val: boolean) => void;
  handleDownloadPDF: (fromTime: string, toTime: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

// const Sidebar = ({ selectedItems, loader, geoFenceData, trackLocations, eventsData, activeTab = "Objects", handleDownloadPDF,
//   onTabChange, onSelectionChange, page, totalPages, handleNext, handlePrevious, onMoreClick, setHistoryData, setHistoryOpen }: SidebarProps) => {
// }

const Sidebar = ({ selectedItems, loader, geoFenceData, trackLocations, eventsData, activeTab = "Objects", handleDownloadPDF,
  onTabChange, onSelectionChange, page, totalPages, handleNext, handlePrevious, onMoreClick, setHistoryData, setHistoryOpen, isOpen = false, onClose }: SidebarProps) => {
  const [selectedTab, setSelectedTab] = useState(activeTab);
  const tabs = ["Objects", "Events", "Places", "History"];
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const { allZones, selectedZones } = useSelector((state: any) => state.Zones);
  const firstItem = selectedItems?.[0];
  const deviceId = firstItem && !firstItem?.area ? firstItem?.deviceId ?? firstItem?.id : undefined;
  const { isLoading, handleGetAllZones } = useZones(deviceId);
  const [open, setOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const mergedEventsData = eventsData?.map((event: any) => {
    const device = ensureArray(geoFenceData)?.find((d: any) => Number(d?.id) === Number(event?.deviceid));
    return { ...event, ...(device ?? {})};
  }) || [];

  const allSelected = mergedEventsData?.length > 0 && selectedKeys?.length === mergedEventsData?.length;
  const isIndeterminate = selectedKeys?.length > 0 && selectedKeys?.length < mergedEventsData?.length;

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedKeys([]);
      onSelectionChange?.([]);
    } else {
      const allRowKeys = mergedEventsData.map(
        (e: any, idx: number) => `${e.id}-${idx}`
      );
      setSelectedKeys(allRowKeys);
      onSelectionChange?.(mergedEventsData);
    }
  };

  const handleTabClick = (tab: string) => {
    setSelectedTab(tab);
    onTabChange?.(tab);
  };

  useEffect(() => {
    if (selectedTab === "Places") {
      handleGetAllZones();
    }
  }, [selectedTab]);

  const mergedData = ensureArray(geoFenceData)?.map((device: any) => {
    const track = ensureArray(trackLocations)?.find((t: any) => t?.deviceId === device?.id);
    return { ...device, ...track };
  });

  const ignitionOff = ensureArray(mergedData)?.filter((item: any) => item?.attribute?.ignition === false);
  const idleDevices = ensureArray(mergedData)?.filter((item: any) => item?.attribute?.ignition === true && Number(item?.speed) === 0);
  const moveDevices = ensureArray(mergedData)?.filter((item: any) => item?.attribute?.ignition === true && Number(item?.speed) > 0);
  const offlineDevices = ensureArray(mergedData)?.filter((item: any) => item?.status === "offline");
  const disabledDevices = ensureArray(mergedData)?.filter((item: any) => item?.disabled === "True");

  const StatusTabs = [
    { label: "Move", count: moveDevices?.length, color: "bg-green-500" },
    { label: "Idle", count: idleDevices?.length, color: "bg-yellow-400" },
    { label: "Stop", count: ignitionOff?.length, color: "bg-red-500" },
    { label: "Offline", count: offlineDevices?.length, color: "bg-blue-700" },
    { label: "Disable", count: disabledDevices?.length, color: "bg-purple-400" },
    { label: "Total", count: mergedData?.length, color: "bg-sky-400" },
  ];

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
      )}
      
      <div className={cn("fixed lg:relative top-0 left-0 h-full bg-card border-r border-border flex flex-col z-50 transition-transform duration-300 ease-in-out", "w-80 sm:w-80 md:w-80", isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0")}>
        <div className="flex min-h-8 sm:min-h-10 text-white rounded-none font-semibold text-center overflow-hidden">
          {ensureArray(StatusTabs)?.map((tab, index) => (
            <button key={index} type="button" className={cn("flex-1 px-0.5 sm:px-1 rounded-none transition-colors", tab?.color)}>
              <div className="text-[10px] sm:text-xs">{tab?.count ?? 0}</div>
              <div className="text-[8px] sm:text-[10px]">{tab?.label ?? ""}</div>
            </button>
          ))}
        </div>
      <div className="flex border-b border-border bg-[#D9D9D9]">
        {tabs?.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            className={cn(
              "flex-1 px-4 py-1 text-sm transition-colors",
              selectedTab === tab
                ? "text-[#444444] bg-white"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {selectedTab === "Objects" && (
        <div className="flex-1 flex flex-col">
          <div className="py-2 flex items-center gap-2 border-b border-border">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input placeholder="Search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 bg-[#04003A] placeholder:text-gray-300 rounded-none h-8 text-sm text-white focus-visible:ring-1 focus-visible:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-1">
              <Button variant="outline" className="bg-[#04003A] rounded-none hover:bg-blue-950 px-1 py-0 h-7 w-7" size="sm">
                <div className="max-w-28">
                  <img
                    src="/assets/icons/refresh.png"
                    alt="refresh Icon"
                    className="w-full h-full object-contain"
                  />
                </div>
              </Button>
              <Button variant="outline" className="bg-[#04003A] rounded-none hover:bg-blue-950 px-1 py-0 h-7 w-7" size="sm">
                <div className="max-w-28">
                  <img
                    src="/assets/icons/sunlight.png"
                    alt="sunlight Icon"
                    className="w-full h-full object-contain"
                  />
                </div>
              </Button>
              <Button variant="outline" className="bg-[#04003A] rounded-none hover:bg-blue-950 px-1 py-0 h-7 w-7" size="sm">
                <div className="max-w-28">
                  <img
                    src="/assets/icons/plus.png"
                    alt="plus Icon"
                    className="w-full h-full object-contain"
                  />
                </div>
              </Button>
            </div>
          </div>

          <ObjectsTable
            objectsLoader={loader}
            geoFenceData={geoFenceData}
            trackLocations={trackLocations}
            onSelectionChange={onSelectionChange}
            searchTerm={searchTerm}
          />
        </div>
      )}

      {selectedTab === "Events" && (
        <div className="flex-1 flex flex-col">
          <div className="py-2 flex items-center gap-2 border-b border-border">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search"
                className="pl-8 bg-[#04003A] placeholder:text-gray-300 rounded-none h-8 text-sm"
              />
            </div>
            <div className="flex items-center gap-1">
              <Button variant="outline" className="bg-[#04003A] rounded-none hover:bg-blue-950 px-1 py-0 h-7 w-7" size="sm">
                <div className="max-w-28">
                  <img
                    src="/assets/icons/refresh.png"
                    alt="refresh Icon"
                    className="w-full h-full object-contain"
                  />
                </div>
              </Button>
              <Button variant="outline" className="bg-[#04003A] rounded-none hover:bg-blue-950 px-1 py-0 h-7 w-7" size="sm">
                <div className="max-w-28">
                  <img
                    src="/assets/icons/sunlight.png"
                    alt="sunlight Icon"
                    className="w-full h-full object-contain"
                  />
                </div>
              </Button>
              <Button variant="outline" className="bg-[#04003A] rounded-none hover:bg-blue-950 px-1 py-0 h-7 w-7" size="sm">
                <div className="max-w-28">
                  <img
                    src="/assets/icons/plus.png"
                    alt="plus Icon"
                    className="w-full h-full object-contain"
                  />
                </div>
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between ps-2">
            <div className="">
              <input
                type="checkbox"
                className="w-4 h-4 border-gray-600"
                checked={allSelected}
                ref={(el) => {
                  if (el) el.indeterminate = isIndeterminate;
                }}
                onChange={handleSelectAll}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="h-7 px-2 text-[10px] rounded-none"
                onClick={handlePrevious}
                disabled={page === 1}
              >
                <ChevronLeft className="w-3 h-3" />
                Previous
              </Button>

              <Button
                className="h-7 px-2 text-[10px] bg-[#04003A] hover:bg-blue-950 rounded-none"
                onClick={handleNext}
                disabled={page === totalPages}
              >
                Next
                <ChevronRight className="w-3 h-3" />
              </Button>
            </div>
          </div>
          <EventsTable
            eventsLoader={loader}
            eventsData={eventsData}
            geoFenceData={geoFenceData}
            onSelectionChange={onSelectionChange}
            onMoreClick={onMoreClick}
            selectedKeys={selectedKeys}
            setSelectedKeys={setSelectedKeys}
          />
        </div>
      )}

      {selectedTab === "Places" && (
        <div className="flex-1 flex flex-col">
          <div className="py-2 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search"
                className="pl-8 bg-[#04003A] placeholder:text-gray-300 rounded-none h-8 text-sm"
              />
            </div>
            <div className="flex items-center gap-1">
              {headerIcons?.map((src, idx) => {
                if (src?.includes("plus.png")) {
                  return (
                    <CreateGeofence key={idx} open={open} setOpen={setOpen} editingZone={editingZone}
                      trigger={
                        <Button variant="outline" onClick={() => { setOpen(true); setEditingZone(null); }} className="bg-[#04003A] rounded-none hover:bg-blue-950 px-1 py-0 h-7 w-7" size="sm">
                          <img src={src} alt="plus icon" className="w-4 h-4 object-contain" />
                        </Button>
                      }
                    />
                  );
                }else if(src?.includes("refresh.png")){
                  return (
                    <Button key={idx} variant="outline" onClick={handleGetAllZones} className="bg-[#04003A] rounded-none hover:bg-blue-950 px-1 py-0 h-7 w-7" size="sm">
                      <img src={src} alt="refresh icon" className="w-4 h-4 object-contain" />
                    </Button>
                  );
                }
                return (
                  <Button key={idx} variant="outline" className="bg-[#04003A] rounded-none hover:bg-blue-950 px-1 py-0 h-7 w-7" size="sm">
                    <img src={src} alt="icon" className="w-4 h-4 object-contain" />
                  </Button>
                );
              })}
            </div>
          </div>

          <PlacesTable
            setOpenEditDialog={setOpen}
            setEditingZone={setEditingZone}
            deviceId={deviceId}
            allZones={allZones}
            isLoading={isLoading}
            selectedZones={selectedZones}
            onSelectionChange={onSelectionChange}
          />
        </div>
      )}

      {selectedTab === "History" && (
        <div className="flex-1 flex flex-col">
          <div className="py-2 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search"
                className="pl-8 bg-[#04003A] placeholder:text-gray-300 rounded-none h-8 text-sm"
              />
            </div>
            <div className="flex items-center gap-1">
              {historyIcons?.map((src, idx) => {
                return (
                  <Button key={idx} variant="outline" className="bg-[#04003A] rounded-none hover:bg-blue-950 px-1 py-0 h-7 w-7" size="sm">
                    <img src={src} alt="icon" className="w-4 h-4 object-contain" />
                  </Button>
                );
              })}
            </div>
          </div>
          <HistoryTable 
            mergedData={mergedData}
            setHistoryData={setHistoryData}
            setHistoryOpen={setHistoryOpen}
            handleDownloadPDF={handleDownloadPDF}
          />
        </div>
      )}
      </div>
    </>
  );
};

export default Sidebar;