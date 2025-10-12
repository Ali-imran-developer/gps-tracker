import React, { useEffect, useMemo, useState } from "react";
import { X, Loader2 } from "lucide-react";
import { useGeoFence } from "@/hooks/geoFecnce-hook";
import { useSelector } from "react-redux";
import AuthController from "@/controllers/authController";
import { ensureArray } from "@/helper-functions/use-formater";
import { useAdmin } from "@/hooks/admin-hook";
import { Button } from "@/components/ui/button";

interface Vehicle {
  id: string;
  name: string;
}

interface AttachDeattachModalProps {
  open: boolean;
  onClose: () => void;
  user: any;
  onAttach: (vehicle: Vehicle) => void;
  onDeattach: (vehicle: Vehicle) => void;
}

const AttachDeattachModal: React.FC<AttachDeattachModalProps> = ({
  open,
  onClose,
  user,
  onAttach,
  onDeattach,
}) => {
  if (!open) return null;

  const session = AuthController.getSession();
  const { isLoading, handleCheckalldevices, handleGetTrackLocations } = useGeoFence();
  const { geoFenceData, trackLocations } = useSelector((state: any) => state.GeoFence);
  const { selectedUsers } = useSelector((state: any) => state.Admin);
  const { handleAddNewDevice, handlRemoveDevice, handlSelectedDevice } = useAdmin();
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: 'attaching' | 'detaching' | null }>({});

  useEffect(() => {
    const params = { email: user?.email, password: user?.phone };
    const queryParams = { username: session?.credentials?.user ?? "", password: session?.credentials?.pass ?? "" };
    handlSelectedDevice(params);
    handleCheckalldevices(queryParams);
    handleGetTrackLocations(queryParams);
  }, []);

  const mergedData = useMemo(() => {
    return ensureArray(geoFenceData)?.map((device: any) => {
      const track = ensureArray(trackLocations)?.find(
        (t: any) => t?.deviceId === device?.id
      );
      return { ...device, ...track };
    });
  }, [geoFenceData, trackLocations]);

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return ensureArray(mergedData);
    return ensureArray(mergedData)?.filter((vehicle: any) =>
      vehicle?.name?.toLowerCase()?.includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, mergedData]);

  const handleAddDevice = async (vehicle: any) => {
    try{
      setLoadingStates(prev => ({ ...prev, [vehicle.id]: 'attaching' }));
      const queryParams = { 
        userId: user?.ID ?? "",
        deviceId: vehicle?.id ?? "",
      };
      await handleAddNewDevice(queryParams);
      onAttach(vehicle);
      onClose();
    }catch(error){
      console.log(error);
    }finally{
      setLoadingStates(prev => ({ ...prev, [vehicle.id]: null }));
    }
  };

  const handleDeAttachDevice = async (vehicle: any) => {
    try{
      setLoadingStates(prev => ({ ...prev, [vehicle.id]: 'detaching' }));
      const queryParams = { 
        userId: user?.ID ?? "",
        deviceId: vehicle?.id ?? "",
      };
      await handlRemoveDevice(queryParams);
      onAttach(vehicle);
      onClose();
    }catch(error){
      console.log(error);
    }finally{
      setLoadingStates(prev => ({ ...prev, [vehicle.id]: null }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center bg-[#04003A] text-white px-5 py-3">
          <h2 className="text-lg font-semibold">
            Assign / Deassign{" "}
            <span className="text-blue-300">
              &lt;{user?.email || user?.name}&gt;
            </span>
          </h2>
          <button onClick={onClose} className="hover:bg-white/10 p-1 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-5 py-3 border-b">
          <input
            type="text"
            placeholder="Search vehicle..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm "
          />
        </div>

        {/* Main Content */}
        <div className="max-h-80 overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-600">
              <Loader2 className="w-6 h-6 animate-spin mb-2" />
              <span>Loading data...</span>
            </div>
          ) : ensureArray(filteredData)?.length === 0 ? (
            <div className="text-center py-6 text-gray-500 text-sm">
              No data exists
            </div>
          ) : (
            ensureArray(filteredData)?.map((vehicle: any) => {
              const isLoadingAttach = loadingStates[vehicle.id] === 'attaching';
              const isLoadingDetach = loadingStates[vehicle.id] === 'detaching';
              const isSelected = ensureArray(selectedUsers)?.some((item: any) => item?.name === vehicle?.name);

              return (
              <div key={vehicle?.id} className={`flex justify-between items-center px-5 py-2 border-b transition ${isSelected ? 'bg-green-300' : ''}`}>
                <span className="font-medium text-gray-800">
                  {vehicle?.name || "Unnamed Vehicle"}
                </span>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleAddDevice(vehicle)} disabled={isLoadingAttach || isLoadingDetach} className="bg-[#04003A] text-white px-3 py-1 rounded text-sm min-w-36">
                    {isLoadingAttach ? <Loader2 className="w-8 h-8 animate-spin" /> : "Attach"}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDeAttachDevice(vehicle)} disabled={isLoadingAttach || isLoadingDetach} className="text-gray-600 px-3 py-1 rounded text-sm min-w-36">
                    {isLoadingDetach ? <Loader2 className="w-8 h-8 animate-spin" /> : "De-Attach"}
                  </Button>
                </div>
              </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default AttachDeattachModal;