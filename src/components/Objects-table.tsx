import { useEffect, useRef, useState } from "react";
import {
  MoreVertical,
  ChevronDown,
  ChevronRight,
  Car,
  Truck,
  Bike,
  User,
  Key,
  LockKeyhole,
  Loader2,
} from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import formatDate from "@/utils/format-date";

interface ObjectTableProps {
  objectsLoader: boolean;
  geoFenceData: any;
  trackLocations: any;
  onSelectionChange?: (selected: any[]) => void;
  searchTerm: string;
}

const STORAGE_KEY = "selectedItems";
const ObjectsTable = ({
  objectsLoader,
  geoFenceData,
  trackLocations,
  onSelectionChange,
  searchTerm,
}: ObjectTableProps) => {
  const [isGroupExpanded, setIsGroupExpanded] = useState(true);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const getRowKey = (item: any, index: number) => `${item.id}-${index}`;
  const toggleExpand = (rowKey: string) => {
    setExpandedRows((prev) => prev.includes(rowKey) ? prev.filter((k) => k !== rowKey) : [...prev, rowKey]);
  };

  const mergedData = geoFenceData?.map((device: any) => {
    const track = trackLocations?.find((t: any) => t?.deviceId === device?.id);
    return { ...device, ...track };
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setSelectedItems(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedItems));

  }, [selectedItems]);

  const filteredData = mergedData?.filter((item: any) => {
    if (!searchTerm) return true;
    const lower = searchTerm.toLowerCase();
    return Object.values(item).some((val) =>
      String(val).toLowerCase().includes(lower)
    );
  });

  const icons = { car: Car, truck: Truck, motorcycle: Bike, person: User };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, rowKey: string, item: any) => {
    e.stopPropagation();
    let updated: string[];
    if (e.target.checked) {
      updated = [...selectedItems, rowKey];
    } else {
      updated = selectedItems.filter((k) => k !== rowKey);
    }
    setSelectedItems(updated);
    const selectedObjects = mergedData?.filter((item: any, idx: number) =>
      updated.includes(getRowKey(item, idx))
    );
    onSelectionChange?.(selectedObjects ?? []);
  };

  const allSelected = selectedItems.length === filteredData?.length;
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    let updated: string[];
    if (e.target.checked) {
      updated = mergedData.map((item: any, idx: number) =>
        getRowKey(item, idx)
      );
    } else {
      updated = [];
    }
    setSelectedItems(updated);
    const selectedObjects = mergedData?.filter((item: any, idx: number) =>
      updated.includes(getRowKey(item, idx))
    );
    onSelectionChange?.(selectedObjects ?? []);
  };

  useEffect(() => {
    if (!mergedData) return;
    const validKeys = mergedData.map((item: any, idx: number) => getRowKey(item, idx));
    const filteredSelections = selectedItems.filter((key) => validKeys.includes(key));
    if (filteredSelections.length !== selectedItems.length) {
      setSelectedItems(filteredSelections);
    }
  }, [mergedData]);

  return (
    <div className="w-full max-w-md mx-auto border border-gray-300 rounded-md shadow-sm bg-white font-sans">
      <div className="px-2 py-1 border-b border-gray-200 bg-[#F5F5F5] flex justify-between items-center">
        <div className="w-full flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Input
              type="checkbox"
              checked={allSelected}
              onChange={handleSelectAll}
              className="w-3 h-3 accent-blue-600"
            />
          </div>
          <Button variant="outline" onClick={() => setIsGroupExpanded(!isGroupExpanded)} className="flex items-center gap-1 text-xs text-gray-700 bg-transparent border-none h-auto p-0">
            {/* {isGroupExpanded ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronRight className="w-3 h-3" />
            )} */}
            <span>Regrouped({filteredData?.length})</span>
          </Button>
        </div>
      </div>

      {isGroupExpanded && (
        <div className="max-h-[calc(100vh-215px)] overflow-y-auto overflow-x-hidden">
          <div className="flex flex-col divide-y">
            {filteredData?.map((item: any, index: number) => {
              const Icon = icons[item?.category];
              const rowKey = getRowKey(item, index);
              const isChecked = selectedItems.includes(rowKey);
              const isExpanded = expandedRows.includes(rowKey);

              return (
                <div key={item?.id} className="flex flex-col">
                  <div className={`flex items-center justify-between py-1 ps-2 cursor-pointer  ${ item?.disabled === "True" ? "bg-gray-300 hover:bg-gray-300" : ""}`} onClick={() => toggleExpand(rowKey)}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => handleCheckboxChange(e, rowKey, item)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-3 h-3 accent-blue-600 mr-2"
                    />

                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {Icon && (
                        <Icon
                          className={`w-4 h-4 shrink-0 ${
                            item?.status === "offline"
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        />
                      )}
                      <div className="truncate">
                        <div className="text-xs font-medium text-gray-900 truncate">
                          {item?.name ?? ""}
                        </div>
                        <div className="text-[10px] text-gray-500 truncate">
                          {formatDate(item?.lastUpdate) ?? ""}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-0 min-w-0">
                      <span className="text-[10px] text-gray-500 w-16 text-right shrink-0">
                        {item?.speed?.toFixed(1) ?? 0} kmh
                      </span>
                      <Key
                        className={`w-3 h-3 ms-5 shrink-0 ${
                          item?.attribute?.ignition === true
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      />
                    </div>

                    <LockKeyhole
                      className={`w-3 h-3 ms-2 text-gray-600 shrink-0 ${
                        item?.attribute?.out1 === true
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    />

                    <Button
                      onClick={(e) => e.stopPropagation()}
                      variant="outline"
                      className={`w-5 h-5 shrink-0 border-none rounded-none ${
                        item?.disabled === "True"
                          ? "bg-gray-300 hover:bg-gray-300"
                          : ""
                      }`}
                    >
                      <MoreVertical className="w-4 h-4 text-gray-600 shrink-0" />
                    </Button>
                  </div>

                  {isExpanded && (
                    <div className="bg-[#F5F5F5] px-2 py-1 grid grid-cols-2 gap-2 text-xs text-gray-800 max-h-28 overflow-y-auto">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <span className="font-semibold">Battery</span>
                        </div>
                        <span>{item?.attribute?.batteryLevel}%</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="font-semibold">Ignition</span>
                        <span>{item?.attribute?.ignition ? "On" : "Off"}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="font-semibold">Satellites</span>
                        <span>{item?.attribute?.sat}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="font-semibold">Power</span>
                        <span>{item?.attribute?.power}</span>
                      </div>

                      {item?.attribute?.batteryLevel && (
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">Battery Level</span>
                          <span>{item?.attribute?.batteryLevel}%</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="font-semibold">Charge</span>
                        <span>
                          {item?.attribute?.charge ? "true" : "false"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="font-semibold">Protocol</span>
                        <span>{item?.protocol}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="font-semibold">Distance</span>
                        <span>{item?.attribute?.distance} Km</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="font-semibold">Speed</span>
                        <span>{item?.speed?.toFixed(1) ?? 0}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="font-semibold">Altitude</span>
                        <span>{item?.altitude} m</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="font-semibold">Expiry Date</span>
                        <span>{item?.expiryDT}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="font-semibold">TotalDistance</span>
                        <span>
                          {(item?.attribute?.totalDistance / 1000).toFixed(2)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="font-semibold">latitude</span>
                        <span>{(item?.latitude).toFixed(4)}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="font-semibold">longitude</span>
                        <span>{(item?.longitude).toFixed(4)}</span>
                      </div>

                      {item?.attribute?.distance && (
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">distance</span>
                          <span>{(item?.attribute?.distance).toFixed(2)}</span>
                        </div>
                      )}

                      {item?.attribute?.adc1 && (
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">ACD</span>
                          <span>{item?.attribute?.adc1}</span>
                        </div>
                      )}

                      {item?.attribute?.di1 && (
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">Di1</span>
                          <span>{item?.attribute?.di1}</span>
                        </div>
                      )}

                      {item?.valid && (
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">Valid</span>
                          <span>{item?.valid ? "true" : "false"}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="font-semibold">Server Time</span>
                        <span>{formatDate(item?.serverTime)}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="font-semibold">Device Time</span>
                        <span>{formatDate(item?.deviceTime)}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ObjectsTable;