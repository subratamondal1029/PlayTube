import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import navSlideSlice from "./slices/slideSlice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    navSlide: navSlideSlice,
  },
});

export default store;
