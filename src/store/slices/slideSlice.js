import { createSlice } from "@reduxjs/toolkit";

const navSlideSlice = createSlice({
  name: "navSlide",
  initialState: true,
  reducers: {
    toggleNavSlide: (state) => !state,
    defineNavVisibelity: (state, action) => (state = action.payload),
  },
});

export const { toggleNavSlide, defineNavVisibelity } = navSlideSlice.actions;
export default navSlideSlice.reducer;
