import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import geoFenceReducer from "./geofenceSlice";

const rootReducer = combineReducers({
  Auth: authReducer,
  GeoFence: geoFenceReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;