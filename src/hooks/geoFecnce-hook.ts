import { useState } from "react";
import { useDispatch } from "react-redux";
import { Login } from "@/types";
import { setUser } from "@/store/slices/authSlice";
import GeoFenceController from "@/controllers/geofenceController";
import { setGeoFenceData, setTrackLocations } from "@/store/slices/geofenceSlice";
import AuthController from "@/controllers/authController";

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

  const handleGetCookie = async (data: any) => {
    try {
      setLoading(true);
      const response: any = await GeoFenceController.getUserCookie(data);
      if(response){
        AuthController.setSession({ cookie: response });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    isLoading,
    handleGetCookie,
    handleCheckalldevices,
    handleGetTrackLocations,
  };
};
