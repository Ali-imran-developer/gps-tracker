import { Login } from "../types";
import Cookies from "js-cookie";
import { decryptData, encryptData } from "../utils/auth";
import { clearAuthSlice, setSession } from "../store/slices/authSlice";
import { APP_KEY, COOKIE_SECRET } from "../config/constants";
import store from "../store";
import { apiRequest } from "./apiController";

class AuthController {
  static userLogin(data: Login) {
    const queryString = `checkuserloginlive.php?user=${data?.user}&pass=${data?.pass}`;
    return apiRequest("get", `/${queryString}`);
  }

  static getSession = () => {
    const session = Cookies.get(APP_KEY);
    let decrypted = null;
    if (session) {
      decrypted = decryptData(session, COOKIE_SECRET);
    }
    return decrypted;
  };

  static setSession(payload: any) {
    const session = this.getSession();
    const newSession = { ...session, ...payload };
    store.dispatch(setSession(newSession));
    const encryptedData = encryptData(newSession, COOKIE_SECRET);
    Cookies.set(APP_KEY, encryptedData, {
      expires: 7,
    });
  }

  static restoreSession() {
    const session = AuthController.getSession();
    if (session) {
      store.dispatch(setSession(session));
      this.setSession(session);
    }
  }

  static removeSession() {
    Cookies.remove(APP_KEY);
  }

  static logout() {
    const credentials = AuthController.getSession();
    store.dispatch(clearAuthSlice());
    AuthController.removeSession();
    localStorage.clear();
  }
}

export default AuthController;