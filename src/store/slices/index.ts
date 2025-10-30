import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import geoFenceReducer from "./geofenceSlice";
import zoneReducer from "./zoneSlice";
import historyReducer from "./historySlice";
import adminReducer from "./adminSlice";
import adminObjectsReducer from "./objectSlice";

const rootReducer = combineReducers({
  Auth: authReducer,
  GeoFence: geoFenceReducer,
  Zones: zoneReducer,
  History: historyReducer,
  Admin: adminReducer,
  Objects: adminObjectsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;