import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  historyLists: [];
  ignitionHistory: [];
  idleHistory: [];
}

const initialState: UserState = {
  historyLists: [],
  ignitionHistory: [],
  idleHistory: [],
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
    setIdleHistory: (state, action: PayloadAction<any>) => {
      state.idleHistory = action.payload;
    },
  },
});

export const { setHistoryData, setIgnitionHistory, setIdleHistory } = HistorySlice.actions;
export default HistorySlice.reducer;