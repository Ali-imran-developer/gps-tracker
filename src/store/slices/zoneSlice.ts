import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  allZones: [];
  selectedZones: [];
}

const initialState: UserState = {
  allZones: [],
  selectedZones: [],
};

export const ZoneSlice = createSlice({
  name: "ZoneSlice",
  initialState,
  reducers: {
    setAllZones: (state, action: PayloadAction<any>) => {
      state.allZones = action.payload;
    },
    setSelectedZones: (state, action: PayloadAction<any>) => {
      state.selectedZones = action.payload;
    },
  },
});

export const { setAllZones, setSelectedZones } = ZoneSlice.actions;
export default ZoneSlice.reducer;