import CryptoJS from "crypto-js";
import AuthController from "@/controllers/authController";
import store from "@/store";
import { clearAuthSlice } from "@/store/slices/authSlice";

export function encryptData(data: any, secretKey: string) {
  const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
  return encryptedData;
}

export function decryptData(data: any, secretKey: string) {
  const decryptedData = CryptoJS?.AES?.decrypt(data, secretKey)?.toString(CryptoJS?.enc?.Utf8);
  return JSON?.parse(decryptedData);
}

export const logout = async () => {
  await AuthController.removeSession();
  store.dispatch(clearAuthSlice());
  sessionStorage.clear();
  localStorage.clear();
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
};
