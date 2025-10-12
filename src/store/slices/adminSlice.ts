import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  adminUsers: [],
  selectedUsers: [],
};

export const AdminSlice = createSlice({
  name: "AdminSlice",
  initialState,
  reducers: {
    setAdminUsers: (state, action: PayloadAction<any>) => {
      state.adminUsers = action.payload;
    },
    setSelectedUser: (state, action: PayloadAction<any>) => {
      state.selectedUsers = action.payload;
    },
  },
});

export const { setAdminUsers, setSelectedUser } = AdminSlice.actions;
export default AdminSlice.reducer;