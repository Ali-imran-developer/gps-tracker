import { apiRequest } from "./apiController";
const geofenceCity = import.meta.env.VITE_GEOFENCE_CITY;

class GeoFenceController {
  static checkalldevices(data: any) {
    const queryString = `geofence/checkalldevices.php?username=${data?.username}&password=${data?.password}`;
    return apiRequest("get", `/${queryString}`);
  }
  static trackLocation(data: any) {
    const queryString = `checkallpositionszahid.php?username=${data?.username}&password=${data?.password}`;
    return apiRequest("get", `/${queryString}`);
  }
  static getUserCookie(data: any) {
    const queryString = `geofence/mohsinget.php?username=${data?.username}&password=${data?.password}`;
    return apiRequest("get", `/${queryString}`);
  }
  static getEventsData(data: { page: number; userid: number; }) {
    const queryString = `webapp/checkalert3pagenew.php?page=${data?.page}&userid=${data?.userid}`;
    return apiRequest("get", `/${queryString}`);
  }
  static getGeofenceCity(Id: string) {
    return apiRequest("get", `${geofenceCity}/geofence/fectchgeofence.php?ID=${Id}`);
  }
  static postMessage(data: any) {
    return apiRequest("get", `/webapp/cleargeoalertweb.php?ID=${data?.ID}&agent=${data?.agent}&imei=${data?.imei}&alerttype=${data?.alerttype}&process=${data?.process}&vehicle=${data?.vehicle}&comments=${data?.comments}`);
  }
  static getAllMessages(data: any) {
    return apiRequest("get", `/webapp/checkalertcallsvehiclepage.php?veh=${data?.veh}&page=${data?.page}`);
  }
  static getAddress(data: any) {
    return apiRequest("get", `/locapplication1.php?lati=${data?.lati}&longi=${data?.longi}&deviceid=${data?.deviceid}`);
  }
}

export default GeoFenceController;