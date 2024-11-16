import React, { useState } from "react";

const VideoThumbnail = ({ thumbnail, title }) => {
  const [isimageLoad, setIsImageLoad] = useState(false);
  return (
    <div className={`imageWraper ${isimageLoad ? "loaded" : ""}`}>
      <div className="placeholder"></div>
      <img src={thumbnail} alt={title} onLoad={() => setIsImageLoad(true)} />
    </div>
  );
};

export default VideoThumbnail;
