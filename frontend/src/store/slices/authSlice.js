import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLogedIn: false,
  userData: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLogedIn = true;
      state.userData = action.payload;
    },
    logout: (state) => {
      state.isLogedIn = false;
      state.userData = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
