import { apiRequest } from "./apiController";
const zoneUrl = import.meta.env.VITE_ZONES_URL;
const geoFenceUrl = import.meta.env.VITE_GEOFENCE_CITY;

class ZonesController {
  static getAllZones() {
    return apiRequest("get", `${zoneUrl}/api/geofences`, undefined, {}, "basic");
  }
  static getSelectedZones(deviceId: string | number) {
    return apiRequest("get", `${zoneUrl}/api/geofences?deviceId=${deviceId}`, undefined, {}, "basic");
  }
  static attachZone(deviceId: string | number, geofenceId: string | number) {
    return apiRequest("get", `${geoFenceUrl}/geofence/assigngeofence2.php?deviceId=${deviceId}&geofenceId=${geofenceId}`);
  }
  static removeZone(deviceId: string | number, geofenceId: string | number) {
    return apiRequest("get", `${geoFenceUrl}/geofence/removegeofence2.php?deviceId=${deviceId}&geofenceId=${geofenceId}`);
  }
}

export default ZonesController;