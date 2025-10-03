import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  historyLists: [];
  ignitionHistory: [];
}

const initialState: UserState = {
  historyLists: [],
  ignitionHistory: [],
};

export const HistorySlice = createSlice({
  name: "HistorySlice",
  initialState,
  reducers: {
    setHistoryData: (state, action: PayloadAction<any>) => {
      state.historyLists = action.payload;
    },
    setIgnitionHistory: (state, action: PayloadAction<any>) => {
      state.ignitionHistory = action.payload;
    },
  },
});

export const { setHistoryData, setIgnitionHistory } = HistorySlice.actions;
export default HistorySlice.reducer;