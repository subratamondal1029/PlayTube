import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { defineNavVisibelity } from "../store/slices/slideSlice";
import "../styles/Player.css";
import { Avatar, CircularProgress } from "@mui/material";
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
  const [expendDescription, setExpendDescription] = useState(false);
  let currentCommentPage = 1;
  const [comments, setComments] = useState([]);
  const commentLoaderRef = useRef(null);

  const fetchVideoComments = async (page) => {
    try {
      const comments = await commentService.getVideoComments(id, page);
      setComments((prev) => [...prev, ...comments]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCommentPosition = async () => {
    const rect = commentLoaderRef.current?.getBoundingClientRect();
    const commentPosition = window.innerHeight - rect?.top;
    const maxPage = Math.ceil(videoDetails.commentCount / 10);

    if (commentPosition >= 10) {
      if (currentCommentPage <= maxPage) {
        window.removeEventListener("scroll", handleCommentPosition);
        await fetchVideoComments(currentCommentPage);
        currentCommentPage + 1;
        window.addEventListener("scroll", handleCommentPosition);
      } else {
        window.removeEventListener("scroll", handleCommentPosition);
      }
    }
  };

  async function fetchVideoDetails() {
    try {
      const videoDetails = await videoService.getVideo(id);
      setVideoDetails(videoDetails);
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    dispath(defineNavVisibelity(false));
    fetchVideoDetails();
  }, []);

  useEffect(() => {
    if (Object.keys(videoDetails).length !== 0) {
      window.addEventListener("scroll", handleCommentPosition);
    }
    return () => window.removeEventListener("scroll", handleCommentPosition);
  }, [videoDetails]);

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
              <div className="subscribers">
                {videoDetails?.owner?.subscriberCount} Subscribers
              </div>{" "}
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
          <div
            className={`videoDescription ${expendDescription ? "" : "hide"}`}
            onClick={() => setExpendDescription((prev) => !prev)}
          >
            {videoDetails?.description}
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
                {videoDetails?.owner?.subscriberCount} Subscribers
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
        {comments.length !== 0 && (
          <Comment
            videoId={id}
            comments={comments}
            setComments={setComments}
            totalComments={videoDetails?.commentCount}
          />
        )}
        {comments.length < videoDetails.commentCount && (
          <CircularProgress ref={commentLoaderRef} className="loader" />
        )}
      </div>
      <div className="relatedContainer">
        <RelatedVideoCard />
      </div>
    </div>
  );
};

export default Player;
