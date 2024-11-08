import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLogedIn: false,
  userDate: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {},
    logout: (state) => {},
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
