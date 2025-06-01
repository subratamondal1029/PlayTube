import { createSlice } from "@reduxjs/toolkit";

const videoSlice = createSlice({
  name: "video",
  initialState: [],
  reducers: {
    addVideos: (state, action) => {
      const isAvailable = state.some((video) => {
        return action.payload.some((v) => v._id === video._id);
      });
      if (!isAvailable) {
        state.push(...action.payload);
      }
    },
  },
});

export const { addVideos } = videoSlice.actions;
export default videoSlice.reducer;
