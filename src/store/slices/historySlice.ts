import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  historyLists: [];
}

const initialState: UserState = {
  historyLists: [],
};

export const HistorySlice = createSlice({
  name: "HistorySlice",
  initialState,
  reducers: {
    setHistoryData: (state, action: PayloadAction<any>) => {
      state.historyLists = action.payload;
    },
  },
});

export const { setHistoryData } = HistorySlice.actions;
export default HistorySlice.reducer;