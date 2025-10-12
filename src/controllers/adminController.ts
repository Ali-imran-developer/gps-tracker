import { adminURL, baseURL } from "@/config/constants";
import { apiRequest } from "./apiController";

class AdminController {
  static getAllUsersList(iduser: number) {
    return apiRequest("get", `${baseURL}/webapp/getallusers.php?iduser=${iduser}`);
  }
  static addNewUser(data: { name: string; email: string; password: string; emailuser: string; passworduser: string; }) {
    return apiRequest("get", `${adminURL}/webapp/users/newuser/adduser.php?name=${data.name}&email=${data.email}&password=${data.password}&emailuser=${data.emailuser}&passworduser=${data.passworduser}`);
  }
  static deleteUser(id: number | string) {
    return apiRequest("get", `${adminURL}/webapp/users/newuser/deluser.php?id=${id}`);
  }
  static editUser(data: { name: string; email: string; password: string; id: number; expirationTime: string; disableduser: number }) {
    return apiRequest("get", `${adminURL}/webapp/users/updatesimpleuser.php?name=${data?.name}&email=${data?.email}&password=${data?.password}&id=${data?.id}&expirationTime=${data?.expirationTime}&disableduser=${data?.disableduser}`);
  }
  static attachDeviceToUser(data: { userId: number | string; deviceId: number | string; }) {
    return apiRequest("get", `${adminURL}/web/users/assigndevicetouser.php?userId=${data?.userId}&deviceId=${data?.deviceId}`);
  }
  static deAttachDevice(data: { userId: number | string; deviceId: number | string; }) {
    return apiRequest("get", `${adminURL}/web/users/deassigndevicetouser.php?userId=${data?.userId}&deviceId=${data?.deviceId}`);
  }
  static selectedDevice(data: { email: number | string; password: number | string; }) {
    return apiRequest("get", `${adminURL}/web/users/getdevicessimpleuser.php?email=${data?.email}&password=${data?.password}`);
  }
}

export default AdminController;