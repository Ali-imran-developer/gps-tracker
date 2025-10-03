import { historyApiurl } from "@/config/constants";
import { apiRequest } from "./apiController";

class HistoryController {
  static getAllHistory(data: { deviceId: number, from: string | number, to: string | number, user: string | number, pass: string | number }) {
    return apiRequest("get", `${historyApiurl}/web1/geofence/newappcusreport.php?deviceId=${data?.deviceId}&from=${data?.from}&to=${data?.to}&user=${data?.user}&pass=${data?.pass}`);
  }
  static getIgnitionHistory(data: { deviceId: number, from: string | number, to: string | number }) {
    return apiRequest("get", `${historyApiurl}/web1/geofence/newappeventhistory.php?deviceId=${data?.deviceId}&from=${data?.from}&to=${data?.to}`);
  }
}

export default HistoryController;