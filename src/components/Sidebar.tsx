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
}

const Sidebar = ({
  selectedItems,
  loader,
  geoFenceData,
  trackLocations,
  eventsData,
  activeTab = "Objects",
  onTabChange,
  onSelectionChange,
  page,
  totalPages,
  handleNext,
  handlePrevious,
  onMoreClick,
}: SidebarProps) => {
  const [selectedTab, setSelectedTab] = useState(activeTab);
  const tabs = ["Objects", "Events", "Places", "History"];
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const { allZones, selectedZones } = useSelector((state: any) => state.Zones);
  const deviceId = selectedItems[0]?.deviceId || selectedItems[0]?.id;
  const { isLoading, handleGetAllZones } = useZones(deviceId);

  const mergedEventsData = eventsData?.map((event: any) => {
    const device = geoFenceData?.find((d: any) => Number(d?.id) === Number(event?.deviceid));
    return {
      ...event,
      ...(device ?? {}),
    };
  }) || [];

  const allSelected = mergedEventsData?.length > 0 && selectedKeys.length === mergedEventsData.length;
  const isIndeterminate = selectedKeys.length > 0 && selectedKeys.length < mergedEventsData.length;

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedKeys([]);
      onSelectionChange?.([]);
    } else {
      const allRowKeys = mergedEventsData.map((e: any, idx: number) => `${e.id}-${idx}`);
      setSelectedKeys(allRowKeys);
      onSelectionChange?.(mergedEventsData);
    }
  };

  const handleTabClick = (tab: string) => {
    setSelectedTab(tab);
    onTabChange?.(tab);
  };

  useEffect(() => {
    if(selectedTab === "Places"){
      handleGetAllZones();
    }
  }, [selectedTab]);

  return (
    <div className="w-80 bg-card border-r border-border flex flex-col h-full">
      <div className="flex border-b border-border bg-[#D9D9D9]">
        {tabs?.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            className={cn(
              "flex-1 px-4 py-3 text-sm font-medium transition-colors",
              selectedTab === tab
                ? "text-[#444444] border-b-2 border-primary bg-white"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {selectedTab === "Objects" && (
        <div className="flex-1 flex flex-col">
          <div className="py-4 flex items-center gap-2 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search"
                  className="pl-9 bg-[#04003A] placeholder:text-gray-300 rounded-none"
                />
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                className="bg-[#04003A] rounded-none"
                size="sm"
              >
                <div className="max-w-28">
                  <img
                    src="/assets/icons/refresh.png"
                    alt="refresh Icon"
                    className="w-full h-full object-contain"
                  />
                </div>
              </Button>
              <Button
                variant="outline"
                className="bg-[#04003A] rounded-none"
                size="sm"
              >
                <div className="max-w-28">
                  <img
                    src="/assets/icons/sunlight.png"
                    alt="sunlight Icon"
                    className="w-full h-full object-contain"
                  />
                </div>
              </Button>
              <Button
                variant="outline"
                className="bg-[#04003A] rounded-none"
                size="sm"
              >
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
          />
        </div>
      )}

      {selectedTab === "Events" && (
        <div className="flex-1 flex flex-col">
          <div className="py-4 flex items-center gap-2 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search"
                  className="pl-9 bg-[#04003A] placeholder:text-gray-300 rounded-none"
                />
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                className="bg-[#04003A] rounded-none hover:bg-blue-950"
                size="sm"
              >
                <div className="max-w-28">
                  <img
                    src="/assets/icons/refresh.png"
                    alt="refresh Icon"
                    className="w-full h-full object-contain"
                  />
                </div>
              </Button>
              <Button
                variant="outline"
                className="bg-[#04003A] rounded-none hover:bg-blue-950"
                size="sm"
              >
                <div className="max-w-28">
                  <img
                    src="/assets/icons/sunlight.png"
                    alt="sunlight Icon"
                    className="w-full h-full object-contain"
                  />
                </div>
              </Button>
              <Button
                variant="outline"
                className="bg-[#04003A] rounded-none hover:bg-blue-950"
                size="sm"
              >
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
          <div className="py-4 flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search"
                  className="pl-9 bg-[#04003A] placeholder:text-gray-300 rounded-none"
                />
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                className="bg-[#04003A] rounded-none hover:bg-blue-950"
                size="sm"
              >
                <div className="max-w-28">
                  <img
                    src="/assets/icons/refresh.png"
                    alt="refresh Icon"
                    className="w-full h-full object-contain"
                  />
                </div>
              </Button>
              <Button
                variant="outline"
                className="bg-[#04003A] rounded-none hover:bg-blue-950"
                size="sm"
              >
                <div className="max-w-28">
                  <img
                    src="/assets/icons/sunlight.png"
                    alt="sunlight Icon"
                    className="w-full h-full object-contain"
                  />
                </div>
              </Button>
              <Button
                variant="outline"
                className="bg-[#04003A] rounded-none hover:bg-blue-950"
                size="sm"
              >
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
          {/* <div className="flex items-center justify-between ps-2">
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
          </div> */}

          <PlacesTable
            isLoading={isLoading}
            deviceId={deviceId}
            allZones={allZones}
            selectedZones={selectedZones}
            onSelectionChange={onSelectionChange}
          />
        </div>
      )}

      {selectedTab !== "Objects" && selectedTab !== "Events" && selectedTab !== "Places" && (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          {selectedTab} content coming soon...
        </div>
      )}
    </div>
  );
};

export default Sidebar;