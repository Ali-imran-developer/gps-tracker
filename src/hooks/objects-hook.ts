import { useState } from "react";
import { useDispatch } from "react-redux";
import ObjectsController from "@/controllers/objectsController";
import {
  setAdminObjects,
  setAdminSingleObject,
  addAdminObject,
  updateAdminObject,
  deleteAdminObject,
} from "@/store/slices/objectSlice";
import toast from "react-hot-toast";

export const useObjects = () => {
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(false);

  const handleGetAllObjects = async (iduser: number) => {
    try {
      setLoading(true);
      const response = await ObjectsController.getAllObjects(iduser);
      dispatch(setAdminObjects(response));
      return response;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetSingleObject = async (deviceId: number) => {
    try {
      setLoading(true);
      const response = await ObjectsController.getSingleObject(deviceId);
      dispatch(setAdminSingleObject(response));
      return response;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteObject = async (id: number, userId?: number) => {
    try {
      setLoading(true);
      const response = await ObjectsController.deleteObject(id);
      dispatch(deleteAdminObject(id));
      toast.success(response?.message || "Object deleted successfully");
      return response;
    } catch (error) {
      console.log(error);
      toast.error(error?.message || "Failed to delete object");
    } finally {
      setLoading(false);
    }
  };

  const handleEditObject = async (data: {
    deviceid: number | string;
    name: string | number;
    imei: string | number;
    phone: string | number;
    disabled: number | string;
    category: string | number;
    devicesofinsjs: string | number;
    devicesofexpjs: string | number;
    devicesofnamedjs: string | number;
    devicesofcontactdjs: string | number;
    devicesofscodejs: string | number;
    devicesofenginejs: string | number;
    devicesofchasisjs: string | number;
    devicesofextrajs: string | number;
    devicesofnoticejs: string | number;
    speed: string | number;
    groupId: string | number;
  }, userId?: number) => {
    try {
      setLoading(true);
      const response = await ObjectsController.editObject(data);
      if (userId) {
        await handleGetAllObjects(userId);
      }
      toast.success(response?.message || "Edit object successfully");
      return response;
    } catch (error) {
      console.log(error);
      toast.error(error?.message || "Failed to edit object");
    } finally {
      setLoading(false);
    }
  };

  const handleAddObject = async (data: {
    password: string | number;
    email: string | number;
    name: string | number;
    imei: string | number;
    phone: string | number;
    disabled: number | string;
    category: string | number;
    devicesofinsjs: string | number;
    devicesofexpjs: string | number;
    devicesofnamedjs?: string | number;
    devicesofcontactdjs?: string | number;
    devicesofscodejs?: string | number;
    devicesofenginejs?: string | number;
    devicesofchasisjs?: string | number;
    devicesofextrajs?: string | number;
    devicesofnoticejs?: string | number;
    speed: string | number;
  }, userId?: number) => {
    try {
      setLoading(true);
      const response = await ObjectsController.addObject(data);
      if (userId) {
        await handleGetAllObjects(userId);
      }
      toast.success(response?.message || "Object added successfully");
      return response;
    } catch (error) {
      console.log(error);
      toast.error(error?.message || "Failed to add object");
    } finally {
      setLoading(false);
    }
  };

  return {
    isLoading,
    handleAddObject,
    handleEditObject,
    handleDeleteObject,
    handleGetAllObjects,
    handleGetSingleObject,
  };
};
