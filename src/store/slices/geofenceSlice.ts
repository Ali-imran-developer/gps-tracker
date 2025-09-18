import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  geoFenceData: [];
  trackLocations: [];
  eventsData: [];
}

const initialState: UserState = {
  geoFenceData: [],
  trackLocations: [],
  eventsData: [],
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
    setEventsData: (state, action: PayloadAction<any>) => {
      state.eventsData = action.payload;
    },
  },
});

export const { setGeoFenceData, setTrackLocations, setEventsData } = GeoFenceSlice.actions;
export default GeoFenceSlice.reducer;