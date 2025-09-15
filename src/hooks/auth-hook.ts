import { useState } from "react";
import AuthController from "../controllers/authController";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Login } from "@/types";
import { setUser } from "@/store/slices/authSlice";

export const useAuth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const session = AuthController.getSession();
  console.log("session", session);
  const [isLoading, setLoading] = useState(false);

  const handlePrimaryLogin = async (data: Login) => {
    try {
      setLoading(true);
      const response: any = await AuthController.userLogin(data);
      console.log("Login api response", response);
      if(response){
        AuthController.setSession({ user: response, credentials: data });
        dispatch(setUser(response))
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    isLoading,
    handlePrimaryLogin,
  };
};
