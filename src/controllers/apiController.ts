import { apiClient } from "@/config/api.config";
import AuthController from "./authController";

// export const apiRequest = async (method: "get" | "post" | "put" | "delete" | "patch", url: string, data?: any, config: any = {}) => {
//   try {
//     let response;

//     if (method === "get") {
//       response = await apiClient.get(url, config);
//     } else if (method === "delete") {
//       response = await apiClient.delete(url, { ...config, data });
//     } else {
//       response = await apiClient[method](url, data, config);
//     }
//     if (
//       response?.status === 200 ||
//       response?.status === 201 ||
//       response?.status === 304
//     ) {
//       return response?.data;
//     }
//   } catch (error: any) {
//     console.log("@showerror", error?.status);
//     throw error?.response
//       ? {
//           status: error.response.status,
//           message:
//             error.response.data?.message ||
//             error.response.data?.detail ||
//             "Request failed",
//         }
//       : { status: 500, message: "Server Error" };
//   }
// };

export const apiRequest = async (
  method: "get" | "post" | "put" | "delete" | "patch",
  url: string,
  data?: any,
  config: any = {},
  authType: "bearer" | "basic" = "bearer"
) => {
  try {
    let finalConfig = { ...config };
    if (authType === "basic") {
      const session = AuthController.getSession();
      finalConfig.auth = {
        username: session?.credentials?.user,
        password: session?.credentials?.pass,
      };
    }
    let response;
    if (method === "get") {
      response = await apiClient.get(url, finalConfig);
    } else if (method === "delete") {
      response = await apiClient.delete(url, { ...finalConfig, data });
    } else {
      response = await apiClient[method](url, data, finalConfig);
    }

    if ([200, 201, 304].includes(response?.status)) {
      return response?.data;
    }
  } catch (error: any) {
    console.log("@showerror", error);
    throw error?.response
      ? {
          status: error.response.status,
          message:
            error.response.data?.message ||
            error.response.data?.detail ||
            "Request failed",
        }
      : { status: 500, message: "Server Error" };
  }
};
