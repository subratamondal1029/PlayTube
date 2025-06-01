import { Avatar } from "@mui/material";
import React from "react";

const VideoCardSimmer = () => {
  return (
    <div className="card cardSimmer">
      <div className="thumbnailSimmer simmerAnimation"></div>
      <div className="videoDetailsSimmer">
        <Avatar sx={{ bgcolor: "#272727" }} />
        <div className="other">
          <div className="simmerAnimation"></div>
          <div className="simmerAnimation"></div>
        </div>
      </div>
    </div>
  );
};

export default VideoCardSimmer;
