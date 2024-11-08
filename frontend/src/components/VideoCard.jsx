import { Avatar } from "@mui/material";
import { Link } from "react-router-dom";

const VideoCard = ({ video }) => {
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

  return (
    <Link to={`/player/${video._id}`} className="card">
      <div className="thumbnail">
        <img src={video.thumbnail} alt={video.title} />
        <div className="duration">{getDuration(video.duration)}</div>
      </div>
      <div className="videoInfo">
        <Link to={`/users/${video.owner.username}`}>
          <Avatar alt={video.owner.username} src={video.owner.avatar} />
        </Link>
        <div>
          <h3 className="videoTitle">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem
            inventore ratione consequuntur amet nesciunt est, pariatur
            asperiores temporibus impedit recusandae.
          </h3>
          <Link to={`/users/${video.owner.username}`} className="channelName">
            {video.owner.fullName}
          </Link>
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
