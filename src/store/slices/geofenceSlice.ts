import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  geoFenceData: [];
  trackLocations: [];
}

const initialState: UserState = {
  geoFenceData: [],
  trackLocations: [],
};

export const GeoFenceSlice = createSlice({
  name: "GeoFenceSlice",
  initialState,
  reducers: {
    setGeoFenceData: (state, action: PayloadAction<any>) => {
      state.geoFenceData = action.payload;
    },
    setTrackLocations: (state, action: PayloadAction<any>) => {
      state.trackLocations = action.payload;
    },
  },
});

export const { setGeoFenceData, setTrackLocations } = GeoFenceSlice.actions;
export default GeoFenceSlice.reducer;