import { useState } from "react";
import { useDispatch } from "react-redux";
import HistoryController from "@/controllers/historyController";
import { setHistoryData } from "@/store/slices/historySlice";

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

  return {
    isLoading,
    handleGetAllHistory,
  };
};
