import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import geoFenceReducer from "./geofenceSlice";
import zoneReducer from "./zoneSlice";

const rootReducer = combineReducers({
  Auth: authReducer,
  GeoFence: geoFenceReducer,
  Zones: zoneReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;