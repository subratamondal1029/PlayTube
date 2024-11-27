import { VideoCard } from "../components";
import "../styles/VideoList.css";
import VideoCardSimmer from "./simmerEffects/VideoCardSimmer";

const VideoList = ({ cardNumbers = 3, videos = [], simmer = true }) => {
  return (
    <div
      className="videoList"
      style={{ gridTemplateColumns: `repeat(${cardNumbers}, 1fr)` }}
    >
      {simmer ? (
        Array.from({ length: 10 }).map((_, i) => <VideoCardSimmer key={i} />)
      ) : videos.length > 0 ? (
        videos.map((video) => <VideoCard video={video} key={video._id} />)
      ) : (
        <div
          className="no-videos"
          style={{ gridColumn: `span ${cardNumbers}` }}
        >
          No Videos
        </div>
      )}
    </div>
  );
};

export default VideoList;
