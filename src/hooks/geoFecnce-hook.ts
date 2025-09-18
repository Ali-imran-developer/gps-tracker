import { useState } from "react";
import { useDispatch } from "react-redux";
import GeoFenceController from "@/controllers/geofenceController";
import { setEventsData, setGeoFenceData, setTrackLocations } from "@/store/slices/geofenceSlice";
import AuthController from "@/controllers/authController";
import toast from "react-hot-toast";

export const useGeoFence = () => {
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(false);
  const [cities, setCities] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  const handleCheckalldevices = async (data: any) => {
    try {
      setLoading(true);
      const response: any = await GeoFenceController.checkalldevices(data);
      if(response){
        dispatch(setGeoFenceData(response))
      }
      return response;
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
      return response;
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
      return response;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetEventsData = async (data: { page: number; userid: number; }) => {
    try {
      setLoading(true);
      const response: any = await GeoFenceController.getEventsData(data);
      if(response){
        dispatch(setEventsData(response));
      }
      return response;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGeofenceCities = async (Id: string) => {
    try {
      const response: any = await GeoFenceController.getGeofenceCity(Id);
      if(response){
        setCities(response);
      }
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const handlePostMessage = async (data: any) => {
    try {
      setIsAdding(true);
      const response: any = await GeoFenceController.postMessage(data);
      if(response){
        toast.success(response);
      }
      return response;
    } catch (error) {
      console.log(error);
    }finally{
      setIsAdding(false);
    }
  };

  return {
    cities,
    isAdding,
    isLoading,
    handleGetCookie,
    handlePostMessage,
    handleGetEventsData,
    handleGeofenceCities,
    handleCheckalldevices,
    handleGetTrackLocations,
  };
};
