import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  geoFenceData: [];
  trackLocations: [];
  eventsData: [];
  address: any;
}

const initialState: UserState = {
  geoFenceData: [],
  trackLocations: [],
  eventsData: [],
  address: null,
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
    setAddress: (state, action: PayloadAction<any>) => {
      state.address = action.payload;
    },
  },
});

export const { setGeoFenceData, setTrackLocations, setEventsData, setAddress } = GeoFenceSlice.actions;
export default GeoFenceSlice.reducer;