import { useState } from "react";
import { useDispatch } from "react-redux";
import HistoryController from "@/controllers/historyController";
import { setHistoryData, setIdleHistory, setIgnitionHistory } from "@/store/slices/historySlice";

export const useHistory = () => {
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(false);

  const handleGetAllHistory = async (data: { deviceId: number, from: string | number, to: string | number, user: string | number, pass: string | number }) => {
    try {
      setLoading(true);
      const response: any = await HistoryController.getAllHistory(data);
      if(response){
        dispatch(setHistoryData(response))
      }
      return response;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetIgnitionHistory = async (data: { deviceId: number, from: string | number, to: string | number }) => {
    try {
      setLoading(true);
      const response: any = await HistoryController.getIgnitionHistory(data);
      if(response){
        dispatch(setIgnitionHistory(response))
      }
      return response;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetIdleHistory = async (data: { deviceId: number, from: string | number, to: string | number }) => {
    try {
      setLoading(true);
      const response: any = await HistoryController.getIdleReport(data);
      if(response){
        dispatch(setIdleHistory(response))
      }
      return response;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    isLoading,
    handleGetAllHistory,
    handleGetIdleHistory,
    handleGetIgnitionHistory,
  };
};
