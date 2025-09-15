import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  user: {};
  session?: any;
}

const initialState: UserState = {
  user: {},
  session: null,
};

export const AuthSlice = createSlice({
  name: "AuthSlice",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    },
    setSession: (state, action: PayloadAction<any>) => {
      state.session = action.payload;
    },
    clearAuthSlice: () => initialState,
  },
});

export const { setUser, setSession, clearAuthSlice } = AuthSlice.actions;
export default AuthSlice.reducer;