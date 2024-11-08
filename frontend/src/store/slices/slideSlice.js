import { createSlice } from "@reduxjs/toolkit";

const navSlideSlice = createSlice({
  name: "navSlide",
  initialState: true,
  reducers: {
    toggleNavSlide: (state) => !state,
  },
});

export const { toggleNavSlide } = navSlideSlice.actions;
export default navSlideSlice.reducer;
