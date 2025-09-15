import { useState } from "react";
import { useDispatch } from "react-redux";
import { Login } from "@/types";
import { setUser } from "@/store/slices/authSlice";
import GeoFenceController from "@/controllers/geofenceController";
import { setGeoFenceData, setTrackLocations } from "@/store/slices/geofenceSlice";

export const useGeoFence = () => {
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(false);

  const handleCheckalldevices = async (data: any) => {
    try {
      setLoading(true);
      const response: any = await GeoFenceController.checkalldevices(data);
      if(response){
        dispatch(setGeoFenceData(response))
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetTrackLocations = async (data: any) => {
    try {
      setLoading(true);
      const response: any = await GeoFenceController.trackLocation(data);
      if(response){
        dispatch(setTrackLocations(response))
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    isLoading,
    handleCheckalldevices,
    handleGetTrackLocations,
  };
};
