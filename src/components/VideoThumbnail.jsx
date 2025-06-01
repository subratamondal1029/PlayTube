import React, { useState } from "react";
import { getDuration } from "../utiles";
import "../styles/VideoThumbnail.css";

const VideoThumbnail = ({ thumbnail, title, duration, classname = "" }) => {
  const [isimageLoad, setIsImageLoad] = useState(false);
  return (
    <div className={`thumbnail ${classname}`}>
      <div className={`imageWraper ${isimageLoad ? "loaded" : ""}`}>
        <div className="placeholder"></div>
        <img src={thumbnail} alt={title} onLoad={() => setIsImageLoad(true)} />
      </div>
      <div className="duration">{getDuration(duration)}</div>
    </div>
  );
};

export default VideoThumbnail;
