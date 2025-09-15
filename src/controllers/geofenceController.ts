import { Login } from "../types";
import { apiRequest } from "./apiController";

class GeoFenceController {
  static checkalldevices(data: any) {
    const queryString = `geofence/checkalldevices.php?username=${data?.username}&password=${data?.password}`;
    return apiRequest("get", `/${queryString}`);
  }
  static trackLocation(data: any) {
    const queryString = `checkallpositionszahid.php?username=${data?.username}&password=${data?.password}`;
    return apiRequest("get", `/${queryString}`);
  }
}

export default GeoFenceController;