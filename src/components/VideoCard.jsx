import { Avatar } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import VideoThumbnail from "./VideoThumbnail";
import { timeSince } from "../utiles";

const VideoCard = ({ video }) => {
  const navigate = useNavigate();

  function navigateToUserProfile(e) {
    e.preventDefault();
    navigate(`/users/${video.owner.username}`);
  }

  return (
    <Link to={`/player/${video._id}`} className="card">
      <VideoThumbnail
        thumbnail={video.thumbnail}
        title={video.title}
        duration={video.duration}
      />
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
