import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import ZonesController from "@/controllers/zonesController";
import { setAllZones, setSelectedZones } from "@/store/slices/zoneSlice";
import toast from "react-hot-toast";

export const useZones = (Id?: string | number) => {
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(false);
  const [isLoadingZones, setLoadingZones] = useState(false);

  const handleGetAllZones = async () => {
    try {
      setLoading(true);
      const response: any = await ZonesController.getAllZones();
      if(response){
        dispatch(setAllZones(response))
      }
      return response;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetSelectedZones = async () => {
    try {
      setLoading(true);
      const response: any = await ZonesController.getSelectedZones(Id);
      if(response){
        dispatch(setSelectedZones(response))
      }
      return response;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(Id){
      handleGetSelectedZones();
    }
  }, [Id]);

  const handleAttachZone = async (deviceId: string | number, geofenceId: string | number) => {
    try {
      setLoadingZones(true);
      const response: any = await ZonesController.attachZone(deviceId, geofenceId);
      toast.success("Zone attached successfully");
      await handleGetSelectedZones();
      return response;
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingZones(false);
    }
  };

  const handleDeleteZone = async (deviceId: string | number, geofenceId: string | number) => {
    try {
      setLoadingZones(true);
      const response: any = await ZonesController.removeZone(deviceId, geofenceId);
      toast.success("Zone removed successfully");
      await handleGetSelectedZones();
      return response;
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingZones(false);
    }
  };

  const handleAddNewZone = async (username: string, password: string | number, name: string | any, description: string | any, area: string | any) => {
    try {
      setLoadingZones(true);
      const response: any = await ZonesController.addNewZone(username, password, name, description, area);
      toast.success("Geofence Added successfully");
      await handleGetAllZones();
      return response;
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingZones(false);
    }
  };

  const handleEditZone = async (id: number, username: string, password: string | number, name: string | any, description: string | any, area: string | any) => {
    try {
      setLoadingZones(true);
      const response: any = await ZonesController.editZone(id, username, password, name, description, area);
      toast.success("Geofence Updated successfully");
      await handleGetAllZones();
      return response;
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingZones(false);
    }
  };

  return {
    isLoading,
    isLoadingZones,
    handleEditZone,
    handleAddNewZone,
    handleAttachZone,
    handleDeleteZone,
    handleGetAllZones,
    handleGetSelectedZones,
  };
};
