import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  objectsData: [],
  singleObjectData: null,
};

export const AdminObjectSlice = createSlice({
  name: "AdminObjectSlice",
  initialState,
  reducers: {
    setAdminObjects: (state, action: PayloadAction<any>) => {
      state.objectsData = action.payload;
    },
    setAdminSingleObject: (state, action: PayloadAction<any>) => {
      state.singleObjectData = action.payload;
    },
    addAdminObject: (state, action: PayloadAction<any>) => {
      state.objectsData = [...state.objectsData, action.payload];
    },
    updateAdminObject: (state, action: PayloadAction<any>) => {
      const index = state.objectsData.findIndex((obj: any) => obj.id === action.payload.id);
      if (index !== -1) {
        state.objectsData[index] = { ...state.objectsData[index], ...action.payload };
      }
    },
    deleteAdminObject: (state, action: PayloadAction<number>) => {
      state.objectsData = state.objectsData.filter((obj: any) => obj.id !== action.payload);
    }
  },
});

export const {
  setAdminObjects,
  setAdminSingleObject,
  addAdminObject,
  updateAdminObject,
  deleteAdminObject
} = AdminObjectSlice.actions;
export default AdminObjectSlice.reducer;