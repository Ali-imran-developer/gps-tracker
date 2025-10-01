import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import geoFenceReducer from "./geofenceSlice";
import zoneReducer from "./zoneSlice";
import historyReducer from "./historySlice";

const rootReducer = combineReducers({
  Auth: authReducer,
  GeoFence: geoFenceReducer,
  Zones: zoneReducer,
  History: historyReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;