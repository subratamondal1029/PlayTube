import { useState } from "react";
import { VideoCard } from "../components";
import "../styles/VideoList.css";

const VideoList = ({ cardNumbers = 3 }) => {
  const [videos, setVidoes] = useState([
    {
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
      owner: {
        username: "subrata",
        fullName: "Subrata Mondal",
        avatar:
          "http://res.cloudinary.com/dvwuableu/image/upload/v1730553042/mrvmg7i5gs6ku1bs6q1f.png",
      },
      createdAt: "2024-11-06T15:05:42.927Z",
      updatedAt: "2024-11-06T15:05:42.927Z",
      __v: 0,
    },
    {
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
      owner: {
        username: "subrata",
        fullName: "Subrata Mondal",
        avatar:
          "http://res.cloudinary.com/dvwuableu/image/upload/v1730553042/mrvmg7i5gs6ku1bs6q1f.png",
      },
      createdAt: "2024-11-06T15:05:42.927Z",
      updatedAt: "2024-11-06T15:05:42.927Z",
      __v: 0,
    },
    {
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
      owner: {
        username: "subrata",
        fullName: "Subrata Mondal",
        avatar:
          "http://res.cloudinary.com/dvwuableu/image/upload/v1730553042/mrvmg7i5gs6ku1bs6q1f.png",
      },
      createdAt: "2024-11-06T15:05:42.927Z",
      updatedAt: "2024-11-06T15:05:42.927Z",
      __v: 0,
    },
  ]);

  return (
    <div
      className="videoList"
      style={{ gridTemplateColumns: `repeat(${cardNumbers}, 1fr)` }}
    >
      {videos.map((video) => (
        <VideoCard video={video} key={video._id} />
      ))}
    </div>
  );
};

export default VideoList;
