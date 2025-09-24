import { apiRequest } from "./apiController";
const zoneUrl = import.meta.env.VITE_ZONES_URL;
const geoFenceUrl = import.meta.env.VITE_GEOFENCE_CITY;

class ZonesController {
  static getAllZones() {
    return apiRequest("get", `/api/geofences`, undefined, {}, "basic");
  }
  static getSelectedZones(deviceId: string | number) {
    return apiRequest("get", `/api/geofences?deviceId=${deviceId}`, undefined, {}, "basic");
  }
  static attachZone(deviceId: string | number, geofenceId: string | number) {
    return apiRequest("get", `${geoFenceUrl}/geofence/assigngeofence2.php?deviceId=${deviceId}&geofenceId=${geofenceId}`);
  }
  static removeZone(deviceId: string | number, geofenceId: string | number) {
    return apiRequest("get", `${geoFenceUrl}/geofence/removegeofence2.php?deviceId=${deviceId}&geofenceId=${geofenceId}`);
  }
  static addNewZone(username: string, password: string | number, name: string | any, description: string | any, area: string | any) {
    return apiRequest("get", `${geoFenceUrl}/geofence/checkgeoaddfaisalabad.php?username=${username}&password=${password}&name=${name}&description=${description}&area=${area}`);
  }
  static editZone(id: number, username: string, password: string | number, name: string | any, description: string | any, area: string | any) {
    return apiRequest("get", `${geoFenceUrl}/geofence/geofenceUpdatefsd.php?id=${id}&username=${username}&password=${password}&name=${name}&description=${description}&area=${area}`);
  }
}

export default ZonesController;