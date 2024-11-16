import { Avatar } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import VideoThumbnail from "./VideoThumbnail";

const VideoCard = ({ video }) => {
  const navigate = useNavigate();
  function timeSince(uploadDate) {
    const seconds = Math.floor((new Date() - new Date(uploadDate)) / 1000);

    const intervals = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "minute", seconds: 60 },
      { label: "second", seconds: 1 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count >= 1) {
        return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
      }
    }

    return "just now";
  }

  function getDuration(videoDuration) {
    const hours = Math.floor(videoDuration / 3600);
    const minutes = Math.floor((videoDuration % 3600) / 60);
    const seconds = Math.round(videoDuration % 60);

    if (hours > 0) {
      return `${hours}:${minutes < 10 ? "0" : ""}${minutes}:${
        seconds < 10 ? "0" : ""
      }${seconds}`;
    } else {
      return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    }
  }

  function navigateToUserProfile(e) {
    e.preventDefault();
    navigate(`/users/${video.owner.username}`);
  }

  return (
    <Link to={`/player/${video._id}`} className="card">
      <div className="thumbnail">
        <VideoThumbnail thumbnail={video.thumbnail} title={video.title} />
        <div className="duration">{getDuration(video.duration)}</div>
      </div>
      <div className="videoInfo">
        <span onClick={navigateToUserProfile}>
          <Avatar alt={video.owner.username} src={video.owner.avatar} />
        </span>
        <div>
          <h3 className="videoTitle">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem
            inventore ratione consequuntur amet nesciunt est, pariatur
            asperiores temporibus impedit recusandae.
          </h3>
          <span onClick={navigateToUserProfile} className="channelName">
            {video.owner.fullName}
          </span>
          <p className="videoUploadInfo">
            <span>{video.views} Views</span> <span className="dot"></span>{" "}
            <span>{timeSince(video.createdAt)}</span>
          </p>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
