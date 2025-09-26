import React, { useEffect, useRef, useState } from "react";
import { Loader2, MoreVertical, X } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useZones } from "@/hooks/zones-hook";
import AppliedZone from "./applied-zone";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";

interface PlacesTableProps {
  setOpenEditDialog: (open: boolean) => void;
  setEditingZone: (zone: any) => void;
  isLoading: boolean;
  deviceId: number | null;
  allZones: any[];
  selectedZones: any[];
  onSelectionChange?: (selected: any[]) => void;
}

const PlacesTable = ({
  setOpenEditDialog,
  setEditingZone,
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
  const { isLoadingZones, handleAttachZone, handleDeleteZone, handleDeleteGeofence } = useZones(deviceId);
  const [open, setOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement | null>(null);

  const handleMoreVerticalClick = (e: React.MouseEvent<HTMLButtonElement>, zone: any) => {
    e.stopPropagation();
    setCurrentZone(zone);
    setSelectedZoneId(zone.id.toString());
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({ x: rect.right + 4, y: rect.top });
    setOpen(!open);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // const handleMoreVerticalClick = (e: any, zone: any) => {
  //   e.stopPropagation();
  //   setCurrentZone(zone);
  //   setSelectedZoneId(zone.id.toString());
  //   setIsDialogOpen(true);
  // };

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
        setIsDetachDialogOpen(false);
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

  const handleDeleteGeofenceConfirm = async () => {
    try {
      if (currentZone?.id) {
        await handleDeleteGeofence(currentZone.id);
        setIsDeleteDialogOpen(false);
      }
    } catch (error) {
      console.log(error);
    };
  };

  return (
    <div className="w-full max-w-md mx-auto rounded-md shadow-sm bg-white font-sans text-xs">
      <div className="flex w-52 max-w-full gap-2">
        <Button size="icon" variant="outline" onClick={() => setActiveTab("all")} className={`flex-1 w-6 h-8 text-xs font-semibold border-none rounded-none ${activeTab === "all" ? "bg-[#727270] text-white" : "text-[#727270] hover:text-gray-700"}`}>
          All Zones
        </Button>
        <Button size="icon" variant="outline" className={`flex-1 w-6 h-8 text-xs font-semibold border-none rounded-none ${
          activeTab === "applied" ? "bg-[#727270] text-white" : "text-[#727270] hover:text-gray-700"}`}
          onClick={() => setActiveTab("applied")}>
          Applied Zones
        </Button>
      </div>

      <div className="max-h-[calc(100vh-180px)] overflow-y-auto divide-y">
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
              <div className="w-full max-w-md mx-auto border border-gray-200 shadow-sm bg-white font-sans text-xs">
                <div className="grid grid-cols-2 w-full border-b bg-gray-100 text-gray-700 font-semibold text-xs">
                  <div className="ps-12 py-2 border-r">Name</div>
                  <div className="px-3 py-2">Description</div>
                </div>
                {allZones?.map((item: any, index: number) => {
                  const rowKey = getRowKey(item, index);
                  const isChecked = selectedItems.includes(rowKey);
                  return (
                    <div key={index} className="flex items-center gap-3 ps-2 py-1 border-b border-gray-200 hover:bg-gray-50">
                      <input
                        type="checkbox"
                        className="w-3 h-3 accent-blue-600"
                        checked={isChecked}
                        onChange={(e) => handleCheckboxChange(e, rowKey, item)}
                        onClick={(e) => e.stopPropagation()}
                      />

                      <div className="grid grid-cols-2 w-full gap-0 text-xs">
                        <div className="px-3 py-2 border-r w-full break-words">
                          <div className="font-medium text-gray-800">
                            {item?.name ?? ""}
                          </div>
                        </div>
                        <div className="px-3 py-2 w-full break-words">
                          <div className="text-gray-600">{item?.description ?? ""}</div>
                        </div>
                      </div>

                      <div className="shrink-0">
                        <button type="button" onClick={(e) => handleMoreVerticalClick(e, item)} className="p-1 rounded hover:bg-gray-200">
                          <MoreVertical className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <div className="shrink-0">
              {open && (
                <div ref={menuRef} className="absolute z-50 w-56 bg-white shadow-lg rounded-md py-1 border border-gray-200 text-sm" style={{ top: position.y, left: position.x }}>
                  <ul className="flex flex-col">
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer capitalize"
                      onClick={() => {
                        setCurrentZone(currentZone);
                        setSelectedZoneId(currentZone?.id?.toString() ?? null);
                        setIsDialogOpen(true);
                        setOpen(false);
                      }}>
                      Attach zone to device
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer capitalize"
                      onClick={() => {
                        setEditingZone(currentZone);
                        setOpenEditDialog(true);
                        setOpen(false);
                      }}>
                      edit zone
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer capitalize"
                      onClick={() => {
                      setOpen(false);
                      setIsDeleteDialogOpen(true);
                    }}>
                      delete zone
                    </li>
                  </ul>
                </div>
              )}
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

              <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you sure you want to delete this geofence?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently remove the {" "}
                      <span className="font-semibold text-black">"{currentZone?.name} geofence"</span>.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteGeofenceConfirm}>
                      {isLoadingZones ? (<Loader2 className="w-4 h-4 animate-spin" />) : ("Delete")}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </>
        )}
        {activeTab === "applied" && (
          <>
            <AppliedZone
              currentZone={currentZone}
              deviceId={deviceId}
              isLoading={isLoading}
              isLoadingZones={isLoadingZones}
              selectedZones={selectedZones}
              handleAppliedMoreClick={handleAppliedMoreClick}
              isDetachDialogOpen={isDetachDialogOpen}
              setIsDetachDialogOpen={setIsDetachDialogOpen}
              handleDelete={handleDelete}
              selectedZoneId={selectedZoneId}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default PlacesTable;