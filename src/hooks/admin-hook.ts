import { useState } from "react";
import { useDispatch } from "react-redux";
import AdminController from "@/controllers/adminController";
import { setAdminUsers, setSelectedUser } from "@/store/slices/adminSlice";
import toast from "react-hot-toast";

export const useAdmin = () => {
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(false);
  const [isAdding, setAdding] = useState(false);

  const handleGetAllUsers = async (iduser: number) => {
    try {
      setLoading(true);
      const response = await AdminController.getAllUsersList(iduser);
      dispatch(setAdminUsers(response));
      return response;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNewUser = async (data: {
    name: string;
    email: string;
    password: string;
    emailuser: string;
    passworduser: string;
  }) => {
    try {
      setAdding(true);
      const response = await AdminController.addNewUser(data);
      toast.success(response?.message || "User Added Successfully!");
      return response;
    } catch (error) {
      console.log(error);
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteUser = async (id: number | string) => {
    try {
      setAdding(true);
      const response = await AdminController.deleteUser(id);
      toast.success(response?.message || "User Deleted Successfully!");
      return response;
    } catch (error) {
      console.log(error);
    } finally {
      setAdding(false);
    }
  };

  const handleEditUser = async (data: {
    name: string;
    email: string;
    password: string;
    id: number;
    expirationTime: string;
    disableduser: number;
  }) => {
    try {
      setAdding(true);
      const response = await AdminController.editUser(data);
      toast.success(response?.message || "User Edit Successfully!");
      return response;
    } catch (error) {
      console.log(error);
    } finally {
      setAdding(false);
    }
  };

  const handleAddNewDevice = async (data: {
    userId: number | string;
    deviceId: number | string;
  }) => {
    try {
      setAdding(true);
      const response = await AdminController.attachDeviceToUser(data);
      toast.success(response?.message || "Device added Successfully!");
      return response;
    } catch (error) {
      console.log(error);
    } finally {
      setAdding(false);
    }
  };

  const handlRemoveDevice = async (data: {
    userId: number | string;
    deviceId: number | string;
  }) => {
    try {
      setAdding(true);
      const response = await AdminController.deAttachDevice(data);
      toast.success(response?.message || "Device De-Attach Successfully!");
      return response;
    } catch (error) {
      console.log(error);
    } finally {
      setAdding(false);
    }
  };

  const handlSelectedDevice = async (data: { email: number | string; password: number | string; }) => {
    try {
      setAdding(true);
      const response = await AdminController.selectedDevice(data);
      dispatch(setSelectedUser(response));
      return response;
    } catch (error) {
      console.log(error);
    } finally {
      setAdding(false);
    }
  };

  return {
    isLoading,
    isAdding,
    handleGetAllUsers,
    handleAddNewUser,
    handleDeleteUser,
    handleEditUser,
    handleAddNewDevice,
    handlRemoveDevice,
    handlSelectedDevice,
  };
};
