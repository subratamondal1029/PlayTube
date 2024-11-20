import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { defineNavVisibelity } from "../store/slices/slideSlice";
import "../styles/Player.css";
import { Avatar } from "@mui/material";
import {
  ThumbUpAltOutlined,
  ReplyOutlined,
  TurnedInNotOutlined,
  SmartDisplayOutlined,
} from "@mui/icons-material";
import { videoService, commentService } from "../backendServices";
import { Comment, RelatedVideoCard } from "../components";
import { timeSince } from "../utiles";

const Player = () => {
  const { id } = useParams();
  const dispath = useDispatch();
  const [videoDetails, setVideoDetails] = useState({});
  const [commentPosition, setCommentPosition] = useState(window.innerHeight);
  const [comments, setComments] = useState([]);

  const handleCommentPosition = (e) => {
    console.log(e.target);
  };

  const fetchVideoComments = async () => {
    try {
      const comments = await commentService.getVideoComments(id);
      console.log(comments);

      setComments(comments);
    } catch (error) {
      console.error(error);
    }
  };

  async function fetchVideoDetails() {
    try {
      const videoDetails = await videoService.getVideo(id);
      console.log(videoDetails);

      setVideoDetails(videoDetails);
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    dispath(defineNavVisibelity(false));

    fetchVideoDetails();
    fetchVideoComments(); //TODO: Make this when comment scroll to bottom
  }, []);

  return (
    <div className="container">
      <div className="playerContainer">
        <div className="player"></div>
        <div className="videoTitle">{videoDetails?.title}</div>
        <div className="channelControllers">
          <div className="channelDetails">
            <Link to={`/users/${videoDetails?.owner?.username}`}>
              <Avatar
                sx={{ width: 45, height: 45 }}
                src={videoDetails?.owner?.avatar}
                sizes="large"
              />
            </Link>
            <div>
              <Link
                className="channelName"
                to={`/users/${videoDetails?.owner?.username}`}
              >
                {videoDetails?.owner?.fullName}
              </Link>
              <div className="subscribers">100k Subscribers</div>{" "}
              {/* TODO: add Subscribers data from backend */}
            </div>
            <button className="subscribeBtn">Subscribe</button>
          </div>
          <div className="videoControllers">
            <div className="likeVideo videoControl">
              <ThumbUpAltOutlined fontSize="small" />
              {videoDetails?.likeCount}
            </div>
            <div className="shareVideo videoControl">
              <ReplyOutlined fontSize="small" className="shareBtn" />
              Share
            </div>
            <div className="saveVideo videoControl">
              <TurnedInNotOutlined fontSize="small" />
              Save
            </div>
          </div>
        </div>
        <div className="descriptionContainer">
          <div className="uploadDetails">
            <div className="videoViews">{videoDetails?.views} Views</div>
            <div className="uploadTime">
              {timeSince(videoDetails?.createdAt)}
            </div>
          </div>
          <div className="videoDescription">
            {" "}
            {/* TODO: add video description height toggle */}
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Qui, vero.
            Totam, ducimus natus rem explicabo nesciunt non soluta
            necessitatibus quas tempore nulla provident veritatis eum aperiam
            dolor. Facere, aliquam quos.
          </div>

          <div className="channelDetails">
            <Link to={`/users/${videoDetails?.owner?.username}`}>
              <Avatar
                sx={{ width: 45, height: 45 }}
                src={videoDetails?.owner?.avatar}
                sizes="large"
              />
            </Link>
            <div>
              <Link
                className="channelName"
                to={`/users/${videoDetails?.owner?.username}`}
              >
                {videoDetails?.owner?.fullName}
              </Link>
              <div className="subscribers">
                {videoDetails?.owner?.subscriberCount || "null"} Subscribers
              </div>
            </div>
            <div></div>
            <Link
              to={`/users/${videoDetails?.owner?.username}/videos`}
              className="channelQuickLink"
            >
              <SmartDisplayOutlined /> Videos
            </Link>
          </div>
        </div>
        <Comment videoId={id} comments={comments} setComments={setComments} />
      </div>
      <div className="relatedContainer">
        <RelatedVideoCard />
      </div>
    </div>
  );
};

export default Player;
