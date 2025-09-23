import React, { useEffect, useState } from "react";
import { Loader2, MoreVertical, X } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useZones } from "@/hooks/zones-hook";

interface PlacesTableProps {
  isLoading: boolean;
  deviceId: number | null;
  allZones: any[];
  selectedZones: any[];
  onSelectionChange?: (selected: any[]) => void;
}

const PlacesTable = ({
  isLoading,
  deviceId,
  allZones,
  selectedZones,
  onSelectionChange,
}: PlacesTableProps) => {
  const [activeTab, setActiveTab] = useState<"all" | "applied">("all");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const getRowKey = (item: any, index: number) => `${item.id}-${index}`;
  const [currentZone, setCurrentZone] = useState<any | null>(null);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetachDialogOpen, setIsDetachDialogOpen] = useState(false);
  const { isLoadingZones, handleAttachZone, handleDeleteZone } = useZones(deviceId);

  const handleMoreVerticalClick = (e: any, zone: any) => {
    e.stopPropagation();
    setCurrentZone(zone);
    setSelectedZoneId(zone.id.toString());
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    try{
      if (deviceId && selectedZoneId) {
        await handleAttachZone(deviceId, selectedZoneId);
      }
    }catch(error){
      console.log(error);
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, rowKey: string, item: any) => {
    e.stopPropagation();
    let updated: string[];
    if (e.target.checked) {
      updated = [rowKey];
    } else {
      updated = [];
    }
    setSelectedItems(updated);
    const selectedObjects = allZones?.filter((_, idx) =>
      updated.includes(getRowKey(_, idx))
    );
    onSelectionChange?.(selectedObjects ?? []);
  };

  const handleDelete = async () => {
    try {
      if (deviceId && selectedZoneId) {
        await handleDeleteZone(deviceId, Number(selectedZoneId));
        // setIsDetachDialogOpen(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAppliedMoreClick = (e: any, zone: any) => {
    e.stopPropagation();
    setCurrentZone(zone);
    setSelectedZoneId(zone.id.toString());
    setIsDetachDialogOpen(true);
  };

  return (
    <div className="w-full max-w-md mx-auto rounded-md shadow-sm bg-white font-sans text-xs">
      <div className="flex w-52 max-w-full gap-2">
        <Button
          size="icon"
          variant="outline"
          onClick={() => setActiveTab("all")}
          className={`flex-1 w-6 h-8 text-xs font-semibold border-none rounded-none
          ${
            activeTab === "all"
              ? "bg-[#727270] text-white"
              : "text-[#727270] hover:text-gray-700"
          }`}
        >
          All Zones
        </Button>
        <Button
          size="icon"
          variant="outline"
          className={`flex-1 w-6 h-8 text-xs font-semibold border-none rounded-none ${
            activeTab === "applied"
              ? "bg-[#727270] text-white"
              : "text-[#727270] hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("applied")}
        >
          Applied Zones
        </Button>
      </div>

      <div className="max-h-[calc(100vh-220px)] overflow-y-auto divide-y">
        {activeTab === "all" && (
          <>
            <div className="px-0 py-2 border-b border-gray-200 bg-[#D9D9D9] grid grid-cols-10 items-center text-center">
              <button className="col-span-1 border-r border-gray-400 flex items-center justify-center h-full hover:bg-gray-200">
                <img
                  src="/assets/icons/eye.png"
                  alt="eye Icon"
                  className="w-5 h-5 object-contain"
                />
              </button>

              {/* <button className="col-span-2 border-r border-gray-400 flex items-center justify-center h-full hover:bg-gray-200">
                <img
                    src="/assets/icons/plu"
                    alt="plus-user Icon"
                    className="w-4 h-4 object-cover"
                />
              </button> */}

              <div className="col-span-9 flex items-center justify-between px-2 h-full">
                <span className="text-sm font-medium text-gray-800 ps-8">
                  Objects
                </span>
              </div>
            </div>
            {isLoading ? (
              <div className="flex justify-center items-center p-4">
                <Loader2 className="w-5 h-5 text-gray-500 animate-spin" />
              </div>
            ) : (
              <div className="w-full max-w-md mx-auto border border-b border-gray-200 rounded-none shadow-sm bg-white font-sans text-xs">
                {allZones?.map((item: any, index: number) => {
                  const rowKey = getRowKey(item, index);
                  const isChecked = selectedItems.includes(rowKey);
                  return (
                    <div
                      key={index}
                      className="flex flex-col cursor-pointer border-b border-gray-200 hover:bg-gray-50"
                    >
                      <div className={`flex items-center gap-3 ps-2 py-1`}>
                        <input
                          type="checkbox"
                          className="w-3 h-3 accent-blue-600"
                          checked={isChecked}
                          onChange={(e) =>
                            handleCheckboxChange(e, rowKey, item)
                          }
                          onClick={(e) => e.stopPropagation()}
                        />

                        <div className="flex-1">
                          <div className="font-medium text-gray-800 truncate">
                            {item?.id ?? ""}
                          </div>
                          <div className="text-[10px] text-gray-600 truncate">
                            {item?.name ?? ""}
                          </div>
                        </div>

                        <div className="flex-1 text-right text-wrap shrink-0">
                          <div className="text-[11px] font-medium text-gray-800">
                            {item?.description ?? ""}
                          </div>
                        </div>

                        <div className="shrink-0">
                          <button type="button" onClick={(e) => handleMoreVerticalClick(e, item)} className="p-1 rounded hover:bg-gray-200">
                            <MoreVertical className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <div className="shrink-0">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader className="flex flex-row items-center justify-between pb-4 border-b">
                    <DialogTitle className="text-lg font-semibold">
                      Attach Zone
                    </DialogTitle>
                  </DialogHeader>
                  <div className="flex flex-col gap-4 py-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-700">
                        Device:
                      </label>
                      <Select disabled value={deviceId?.toString()}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select device" />
                        </SelectTrigger>
                        <SelectContent>
                          {deviceId && (
                            <SelectItem value={deviceId.toString()}>
                              Device ({deviceId})
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-700">Zone:</label>
                      <Select disabled value={selectedZoneId ?? ""}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select zone" />
                        </SelectTrigger>
                        <SelectContent>
                          {currentZone && (
                            <SelectItem value={currentZone.id.toString()}>
                              {currentZone?.name}
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <DialogFooter className="flex justify-end gap-2 border-t pt-4">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="button" onClick={handleSave}>
                      {isLoadingZones ? <Loader2 className="w-7 h-7 animate-spin" /> : "Save"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </>
        )}
        {activeTab === "applied" && (
          <>
            <div className="px-0 py-2 border-b border-gray-200 bg-[#D9D9D9] grid grid-cols-10 items-center text-center">
              <button className="col-span-1 border-r border-gray-400 flex items-center justify-center h-full hover:bg-gray-200">
                <img
                  src="/assets/icons/eye.png"
                  alt="eye Icon"
                  className="w-5 h-5 object-contain"
                />
              </button>
              <div className="col-span-9 flex items-center justify-between px-2 h-full">
                <span className="text-sm font-medium text-gray-800 ps-8">
                  Objects
                </span>
              </div>
            </div>
            {isLoading ? (
              <div className="flex justify-center items-center p-4">
                <Loader2 className="w-5 h-5 text-gray-500 animate-spin" />
              </div>
            ) : selectedZones?.length > 0 ? (
              <div className="w-full max-w-md mx-auto border rounded-none shadow-sm bg-white font-sans text-xs">
                {selectedZones?.map((item: any, index: number) => {
                  return (
                    <div
                      key={index}
                      className="flex flex-col cursor-pointer hover:bg-gray-50"
                    >
                      <div className={`flex items-center gap-3 ps-2 py-1`}>
                        <input
                          type="checkbox"
                          className="w-3 h-3 accent-blue-600"
                          // disabled={disabled}
                          // checked={isChecked}
                          onChange={() => {}}
                          onClick={(e) => e.stopPropagation()}
                        />

                        <div className="flex-1">
                          <div className="font-medium text-gray-800 truncate">
                            {item?.id ?? ""}
                          </div>
                          <div className="text-[10px] text-gray-600 truncate">
                            {item?.name ?? ""}
                          </div>
                        </div>

                        <div className="flex-1 text-right text-wrap shrink-0">
                          <div className="text-[11px] font-medium text-gray-800">
                            {item?.description ?? ""}
                          </div>
                        </div>

                        <div className="shrink-0">
                          <button type="button" onClick={(e) => handleAppliedMoreClick(e, item)} className="p-1 rounded hover:bg-gray-200">
                            <MoreVertical className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <Dialog open={isDetachDialogOpen} onOpenChange={setIsDetachDialogOpen}>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader className="flex flex-row items-center justify-between pb-4 border-b">
                      <DialogTitle className="text-lg font-semibold">Remove Zone</DialogTitle>
                    </DialogHeader>

                    <div className="flex flex-col gap-4 py-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">Device:</label>
                        <Select disabled value={deviceId?.toString()}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select device" />
                          </SelectTrigger>
                          <SelectContent>
                            {deviceId && (
                              <SelectItem value={deviceId.toString()}>
                                Device ({deviceId})
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">Zone:</label>
                        <Select disabled value={selectedZoneId ?? ""}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select zone" />
                          </SelectTrigger>
                          <SelectContent>
                            {currentZone && (
                              <SelectItem value={currentZone.id.toString()}>
                                {currentZone?.name}
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <DialogFooter className="flex justify-end gap-2 border-t pt-4">
                      <Button variant="outline" onClick={() => setIsDetachDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="button" onClick={handleDelete}>
                        {isLoadingZones ? (
                          <Loader2 className="w-7 h-7 animate-spin" />
                        ) : (
                          "Detach"
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500 text-sm">
                No selected zones exist.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PlacesTable;
