import { baseURL, adminURL, adminObjectURL } from "@/config/constants";
import { apiRequest } from "./apiController";

class ObjectsController {
  static getAllObjects(iduser: number) {
    return apiRequest("get", `${adminURL}/web1/webapp/newgpsck.php?iduser=${iduser}`);
  }

  static getSingleObject(deviceId: number) {
    return apiRequest("get", `${baseURL}/webapp/geofence/getgeofencesdevice.php?deviceId=${deviceId}`);
  }

  static deleteObject(id: number) {
    return apiRequest("get", `${adminObjectURL}/webapp/geofence/deldeviceid.php?id=${id}`);
  }

  static editObject(data: {
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
  }) {
    return apiRequest("get", `${adminObjectURL}/webapp/device/updatedeviceidnewgps.php?deviceId=${data?.deviceid}&name=${data?.name}&imei=${data?.imei}&phone=${data?.phone}&disabled=${data?.disabled}&category=${data?.category}&devicesofinsjs=${data?.devicesofinsjs}&devicesofexpjs=${data?.devicesofexpjs}&devicesofnamedjs=${data?.devicesofnamedjs}&devicesofcontactdjs=${data?.devicesofcontactdjs}&devicesofscodejs=${data?.devicesofscodejs}&devicesofenginejs=${data?.devicesofenginejs}&devicesofchasisjs=${data?.devicesofchasisjs}&devicesofextrajs=${data?.devicesofextrajs}&devicesofnoticejs=${data?.devicesofnoticejs}&speed=${data?.speed}&groupId=${data?.groupId}`);
  }

  static addObject(data: {
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
  }) {
    return apiRequest("get", `http://35.225.168.22:8081/webapp/geofence/addDevicespd.php?password=${data?.password}&email=${data?.email}&name=${data?.name}&imei=${data?.imei}&phone=${data?.phone}&disabled=${data?.disabled}&category=${data?.category}&devicesofinsjs=${data?.devicesofinsjs}&devicesofexpjs=${data?.devicesofexpjs}&devicesofnamedjs=${data?.devicesofnamedjs || ""}&devicesofcontactdjs=${data?.devicesofcontactdjs || ""}&devicesofscodejs=${data?.devicesofscodejs || ""}&devicesofenginejs=${data?.devicesofenginejs || ""}&devicesofchasisjs=${data?.devicesofchasisjs || ""}&devicesofextrajs=${data?.devicesofextrajs || ""}&devicesofnoticejs=${data?.devicesofnoticejs || ""}&speed=${data?.speed}`);
  }
}

export default ObjectsController;