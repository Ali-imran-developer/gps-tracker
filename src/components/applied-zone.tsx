import { Loader2, MoreVertical } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";

interface AppliedZoneProps {
  isLoading: boolean;
  selectedZones: any[];
  handleAppliedMoreClick: (e: React.MouseEvent, item: any) => void;
  isDetachDialogOpen: boolean;
  setIsDetachDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  deviceId: number | undefined;
  selectedZoneId: string;
  currentZone: any;
  handleDelete: () => void;
  isLoadingZones: boolean;
}

const AppliedZone = ({
  isLoading,
  selectedZones,
  handleAppliedMoreClick,
  isDetachDialogOpen,
  setIsDetachDialogOpen,
  deviceId,
  selectedZoneId,
  currentZone,
  handleDelete,
  isLoadingZones,
}: AppliedZoneProps) => {
  return (
    <div>
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
                    <button
                      type="button"
                      onClick={(e) => handleAppliedMoreClick(e, item)}
                      className="p-1 rounded hover:bg-gray-200"
                    >
                      <MoreVertical className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          <Dialog
            open={isDetachDialogOpen}
            onOpenChange={setIsDetachDialogOpen}
          >
            <DialogContent className="sm:max-w-md">
              <DialogHeader className="flex flex-row items-center justify-between pb-4 border-b">
                <DialogTitle className="text-lg font-semibold">
                  Remove Zone
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
                  <label className="text-sm font-medium text-gray-700">
                    Zone:
                  </label>
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
                <Button
                  variant="outline"
                  onClick={() => setIsDetachDialogOpen(false)}
                >
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
    </div>
  );
};

export default AppliedZone;
