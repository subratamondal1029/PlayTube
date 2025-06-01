import React from "react";
import { VideoThumbnail } from "../components";
import { Link } from "react-router-dom";
import { timeSince } from "../utiles";

const video = {
  _id: "672b85c6496fd960c870adb8",
  video:
    "http://res.cloudinary.com/dvwuableu/video/upload/v1730905539/n7lerrewpw7vd5m2khei.mp4",
  thumbnail:
    "http://res.cloudinary.com/dvwuableu/image/upload/v1730905542/coicyqii9ir4momlhvox.png",
  title: "Video no.1",
  description: "This is video 1",
  duration: 30.526667,
  views: 0,
  isPublished: true,
  createdAt: "2024-11-06T15:05:42.927Z",
  updatedAt: "2024-11-06T15:05:42.927Z",
  __v: 0,
};

const RelatedVideoCard = () => {
  return (
    <>
      <h3>Related Videos</h3>
      <Link to={`/player/${video._id}`} className="relatedVideoCard">
        <VideoThumbnail
          duration={video.duration}
          thumbnail={video.thumbnail}
          title={video.title}
        />
        <div className="videoInfo">
          <h3 className="videoTitle">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dicta
            doloremque maiores quia exercitationem et esse illum commodi
            aspernatur, cumque ipsum magnam, delectus labore incidunt veniam,
            nesciunt nihil voluptatem provident aliquam.
          </h3>
          <span className="channelName">Channel Name</span>
          <p className="videoUploadInfo">
            <span>{video.views} Views</span> <span className="dot"></span>{" "}
            <span>{timeSince(video.createdAt)}</span>
          </p>
        </div>
      </Link>
    </>
  );
};

export default RelatedVideoCard;
