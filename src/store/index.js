import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import navSlideSlice from "./slices/slideSlice";
import videoSlice from "./slices/videoSlice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    navSlide: navSlideSlice,
    video: videoSlice,
  },
});

export default store;
