import { useEffect, useState } from "react";
import {
  MoreVertical,
  ChevronDown,
  ChevronRight,
  BatteryCharging,
  Power,
  BatteryFullIcon,
  SatelliteDish,
  ParkingMeter,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useGeoFence } from "@/hooks/geoFecnce-hook";
import { useSelector } from "react-redux";
import AuthController from "@/controllers/authController";

const ObjectsTable = () => {
  const { isLoading, handleCheckalldevices, handleGetTrackLocations } =
    useGeoFence();
  const { geoFenceData, trackLocations } = useSelector(
    (state: any) => state.GeoFence
  );
  const [isGroupExpanded, setIsGroupExpanded] = useState(true);
  const [selectedItems, setSelectedItems] = useState(new Set<string>());
  const [visibleItems, setVisibleItems] = useState(
    new Set(["item-1", "item-2", "item-3"])
  );
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const session = AuthController.getSession();

  const toggleExpand = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const mergedData = geoFenceData?.map((device: any) => {
    const track = trackLocations?.find((t: any) => t?.deviceId === device?.id);
    return {
      ...device,
      ...track,
    };
  });
  console.log("mergedData", mergedData);

  const objectsData = [
    { id: "item-1", name: "862843047144761", type: "Online", status: "active" },
    { id: "item-2", name: "862843047144762", type: "Online", status: "active" },
    { id: "item-3", name: "862843047144763", type: "Offline", status: "idle" },
  ];

  const queryParams = {
    username: session?.credentials?.user ?? "",
    password: session?.credentials?.pass ?? "",
  };

  useEffect(() => {
    handleCheckalldevices(queryParams);
    handleGetTrackLocations(queryParams);
  }, []);

  const handleSelectAll = () => {
    if (selectedItems.size === objectsData.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(objectsData.map((item) => item.id)));
    }
  };

  const handleSelectItem = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const toggleVisibility = (id: string) => {
    const newVisible = new Set(visibleItems);
    if (newVisible.has(id)) {
      newVisible.delete(id);
    } else {
      newVisible.add(id);
    }
    setVisibleItems(newVisible);
  };

  const toggleAllVisibility = () => {
    if (visibleItems.size === objectsData.length) {
      setVisibleItems(new Set());
    } else {
      setVisibleItems(new Set(objectsData.map((item) => item.id)));
    }
  };

  return (
    <div className="w-full max-w-md mx-auto border border-gray-300 rounded-md shadow-sm bg-white font-sans">
      <div className="px-0 py-2 border-b border-gray-200 bg-[#D9D9D9] grid grid-cols-10 items-center text-center">
        <button
          onClick={toggleAllVisibility}
          className="col-span-1 border-r border-gray-400 flex items-center justify-center h-full hover:bg-gray-200"
        >
          <img
            src="/assets/icons/eye.png"
            alt="eye Icon"
            className="w-5 h-5 object-contain"
          />
        </button>

        <button className="col-span-1 border-r border-gray-400 flex items-center justify-center h-full hover:bg-gray-200">
          <img
            src="/assets/icons/plus-user.png"
            alt="plus-user Icon"
            className="w-4 h-4 object-cover"
          />
        </button>

        <div className="col-span-8 flex items-center justify-start px-2 h-full">
          <span className="text-sm font-medium text-gray-800 ps-4">
            Objects
          </span>
        </div>
      </div>

      <div className="px-2 py-2 border-b border-gray-200 bg-[#F5F5F5] flex justify-between items-center">
        <div className="w-full flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* <Input
              type="checkbox"
              checked={selectedItems.size === objectsData.length}
              onChange={handleSelectAll}
              className="w-4 h-4 accent-blue-600"
            /> */}
            <Input
              type="checkbox"
              checked={visibleItems.size === objectsData.length}
              onChange={toggleAllVisibility}
              className="w-4 h-4 accent-blue-600"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setIsGroupExpanded(!isGroupExpanded)}
            className="flex items-center gap-1 text-sm text-gray-700 bg-transparent border-none"
          >
            {isGroupExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
            <span>Regrouped({objectsData.length})</span>
          </Button>
        </div>
      </div>

      {isGroupExpanded && (
        <div className="max-h-[calc(100vh-320px)] overflow-y-auto overflow-x-hidden">
          <Table>
            <TableBody>
              {mergedData?.map((item: any) => (
                <>
                  <TableRow
                    key={item?.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => toggleExpand(item.id)}
                  >
                    <TableCell className="w-6 text-center px-2">
                      <Input
                        type="checkbox"
                        checked={false}
                        onChange={toggleAllVisibility}
                        className="w-4 h-4 accent-blue-600"
                      />
                    </TableCell>
                    <TableCell className="flex items-center gap-2 w-36">
                      <img src="/assets/dashboard-icons/car.png" alt="car" className="w-7 h-5" />
                      <div>
                        <div className="text-[12px] font-medium text-gray-900">
                          {item?.name ?? ""}
                        </div>
                        <div className={`text-xs text-gray-500 ${item?.status === "offline" 
                          ? "text-red-600" : "text-green-600"}`}>
                          {item?.status ?? ""}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-xs text-gray-500 w-20">
                      {item?.speed?.toFixed(1) ?? 0} kph
                    </TableCell>
                    <TableCell className="w-8 text-right">
                      <MoreVertical className="w-4 h-4 text-gray-600" />
                    </TableCell>
                  </TableRow>

                  {expandedRow === item.id && (
                    <TableRow className="bg-[#F5F5F5]">
                      <TableCell colSpan={4} className="px-1">
                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-800 space-y-2">
                          {/*  */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <BatteryCharging className="w-5 h-5 text-green-600" />
                              <span className="text-xs font-semibold">
                                Battery Level
                              </span>
                            </div>
                            <span className="text-xs font-semibold">
                              {item?.attribute?.batteryLevel}%
                            </span>
                          </div>
                          {/*  */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <span className="text-xs font-semibold">#</span>
                              <span className="text-xs font-semibold">
                                Motion
                              </span>
                            </div>
                            <span className="text-xs font-semibold">
                              {item?.attribute?.motion ? "true" : "false"}
                            </span>
                          </div>
                          {/*  */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <Power className="w-4 h-4 text-green-600" />
                              <span className="text-xs font-semibold">
                                Ignition
                              </span>
                            </div>
                            <span className="text-xs font-semibold">
                              {item?.attribute?.ignition ? "On" : "Off"}
                            </span>
                          </div>
                          {/*  */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <SatelliteDish className="w-4 h-4 text-green-600" />
                              <span className="text-xs font-semibold">
                                Satellites
                              </span>
                            </div>
                            <span className="text-xs font-semibold">
                              {item.attribute.sat}
                            </span>
                          </div>
                          {/*  */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <span className="text-xs font-semibold">#</span>
                              <span className="text-xs font-semibold">
                                Charge
                              </span>
                            </div>
                            <span className="text-xs font-semibold">
                              {item.attribute.charge ? "true" : "false"}
                            </span>
                          </div>
                          {/*  */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <span className="text-xs font-semibold">#</span>
                              <span className="text-xs font-semibold">
                                Distance
                              </span>
                            </div>
                            <span className="text-xs font-semibold">
                              {item.attribute.distance} Km
                            </span>
                          </div>
                          {/*  */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <ParkingMeter className="w-4 h-4 text-green-600" />
                              <span className="text-xs font-semibold">
                                Speed
                              </span>
                            </div>
                            <span className="text-xs font-semibold">
                              {item.speed?.toFixed(1) ?? 0}
                            </span>
                          </div>
                          {/*  */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <span className="text-xs font-semibold">⛰️</span>
                              <span className="text-xs font-semibold">
                                Altitude
                              </span>
                            </div>
                            <span className="text-xs font-semibold">
                              {item.altitude} m
                            </span>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))}
            </TableBody>
          </Table>
          {/* </div> */}
        </div>
      )}
    </div>
  );
};

export default ObjectsTable;
