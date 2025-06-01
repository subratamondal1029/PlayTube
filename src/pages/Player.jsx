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
  PlayArrow,
  VolumeUp,
  VolumeOff,
  Pause,
  Crop32Sharp,
  Settings,
  FullscreenExit,
  Crop169Sharp,
  PictureInPictureSharp,
  PictureInPictureAltSharp,
  CropFreeSharp,
  ReplaySharp,
} from "@mui/icons-material";
import { videoService, commentService } from "../backendServices";
import { Comment, RelatedVideoCard } from "../components";
import { timeSince, getDuration } from "../utiles";

const Player = () => {
  const { id } = useParams();
  const dispath = useDispatch();
  const [videoDetails, setVideoDetails] = useState({});
  const [expendDescription, setExpendDescription] = useState(false);
  let currentCommentPage = useRef(1);
  const [comments, setComments] = useState([]);
  const commentLoaderRef = useRef(null);
  const [isVideoControlOpen, setIsVideoControlOpen] = useState(true);
  const [videoTimeStamp, setVideoTimeStamp] = useState(0);
  const [videoControls, setVideoControls] = useState({
    isPause: true,
    isEnd: false,
    isMute: false,
    pictureInpicture: false,
    inFullScreen: false,
    inTheaterMode: false,
    isSettingOpen: false,
  });
  const videoRef = useRef(null);
  const controlShowIntervalId = useRef();

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
      if (currentCommentPage.current <= maxPage) {
        window.removeEventListener("scroll", handleCommentPosition);
        await fetchVideoComments(currentCommentPage.current);
        currentCommentPage.current += 1;
        window.addEventListener("scroll", handleCommentPosition);
      } else {
        window.removeEventListener("scroll", handleCommentPosition);
      }
    }
  };

  const fetchVideoDetails = async () => {
    try {
      const videoDetails = await videoService.getVideo(id);
      setVideoDetails(videoDetails);
    } catch (error) {
      console.error(error);
    }
  };

  const controlsHidingIntervalToggle = (isStart) => {
    if (isStart) {
      if (!controlShowIntervalId.current) {
        controlShowIntervalId.current = setInterval(() => {
          setIsVideoControlOpen(false);
        }, 5 * 1000);
      } else return;
    } else {
      clearInterval(controlShowIntervalId.current);
      controlShowIntervalId.current = null;
    }
  };

  const initRootEventListener = () => {
    document.addEventListener("fullscreenchange", (e) => {
      if (document.fullscreenElement) {
        setVideoControls((prev) => ({ ...prev, inFullScreen: true }));
      } else {
        setVideoControls((prev) => ({ ...prev, inFullScreen: false }));
      }
    });

    document.addEventListener("enterpictureinpicture", (e) => {
      setVideoControls((prev) => ({ ...prev, pictureInpicture: true }));
    });

    document.addEventListener("leavepictureinpicture", (e) => {
      setVideoControls((prev) => ({ ...prev, pictureInpicture: false }));
    });
  };

  const requestToFullScreenMode = (isOpen) => {
    const player = videoRef.current.parentElement;

    if (isOpen && !document.fullscreenElement) {
      if (player.requestFullscreen) {
        player.requestFullscreen();
      } else if (player.webkitRequestFullscreen) {
        /* Safari */
        player.webkitRequestFullscreen();
      } else if (player.msRequestFullscreen) {
        /* IE11 */
        player.msRequestFullscreen();
      }
    } else if (!isOpen && document.fullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        /* Safari */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        /* IE11 */
        document.msExitFullscreen();
      }
    }
  };

  const requestToPictureInPictureMode = (isOpen) => {
    const videoElm = videoRef.current;

    if (isOpen && !document.pictureInPictureElement) {
      if (videoElm.requestPictureInPicture) {
        videoElm.requestPictureInPicture();
      }
    } else if (!isOpen && document.pictureInPictureElement) {
      document.exitPictureInPicture();
    }
  };

  const handlePlayerKeyboardEvent = (e) => {
    let key = e.key;

    switch (key) {
      case " ":
        e.preventDefault();
        setVideoControls((prev) => ({ ...prev, isPause: !prev.isPause }));
        break;
      case "m":
        setVideoControls((prev) => ({ ...prev, isMute: !prev.isMute }));
        break;
      case "f":
        setVideoControls((prev) => ({
          ...prev,
          inFullScreen: !prev.inFullScreen,
        }));
        break;
      case "t":
        setVideoControls((prev) => ({
          ...prev,
          inTheaterMode: !prev.inTheaterMode,
        }));
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    dispath(defineNavVisibelity(false));
    fetchVideoDetails();
    videoRef.current.addEventListener("timeupdate", (e) =>
      setVideoTimeStamp(e.target.currentTime)
    );
    initRootEventListener();
  }, []);

  useEffect(() => {
    if (Object.keys(videoDetails).length !== 0) {
      window.addEventListener("scroll", handleCommentPosition);
    }

    if (videoRef.current) {
      document.addEventListener("keydown", handlePlayerKeyboardEvent);
    }

    return () => {
      window.removeEventListener("scroll", handleCommentPosition);
      document.removeEventListener("keydown", handlePlayerKeyboardEvent);
    };
  }, [videoDetails]);

  useEffect(() => {
    const videoElm = videoRef.current;
    if (videoElm) {
      if (videoControls.isPause) {
        videoElm.pause();
        controlsHidingIntervalToggle(false);
      } else {
        videoElm.play();
        controlsHidingIntervalToggle(true);
      }

      if (videoControls.isMute) {
        videoElm.muted = true;
      } else {
        videoElm.muted = false;
      }

      requestToFullScreenMode(videoControls.inFullScreen);
      requestToPictureInPictureMode(videoControls.pictureInpicture);
    }
  }, [videoControls]);

  return (
    <div className="container">
      <div className="playerContainer">
        <div
          className="player"
          onMouseMove={() => setIsVideoControlOpen(true)}
          onMouseLeave={() => {
            if (!videoControls.isPause) setIsVideoControlOpen(false);
          }}
        >
          {isVideoControlOpen && (
            <div className="videoControlsContainer">
              <div
                className="extraMouseControl"
                onClick={(e) => {
                  console.log("time Stamp: ", e.timeStamp);
                  // TODO: add player timestamp skiping
                  setVideoControls((prev) => ({
                    ...prev,
                    isPause: !prev.isPause,
                  }));
                }}
              ></div>
              <input
                type="range"
                className="progressBar"
                value={
                  Math.round(
                    videoTimeStamp * ((1 / videoDetails.duration) * 100)
                  ) || 0
                }
                onChange={(e) => {
                  const timeStamp =
                    (videoDetails.duration * e.target.value) / 100;
                  videoRef.current.currentTime = timeStamp;
                  if (timeStamp != videoDetails.duration)
                    setVideoControls((prev) => ({ ...prev, isEnd: false }));
                }}
              />
              <div className="controls">
                <div>
                  <div
                    className="playPauseBtn"
                    onClick={() =>
                      setVideoControls((prev) => ({
                        ...prev,
                        isPause: !prev.isPause,
                      }))
                    }
                  >
                    {videoControls.isPause ? (
                      videoControls.isEnd ? (
                        <ReplaySharp />
                      ) : (
                        <PlayArrow />
                      )
                    ) : (
                      <Pause />
                    )}
                  </div>
                  <div
                    className="volume"
                    onClick={() =>
                      setVideoControls((prev) => ({
                        ...prev,
                        isMute: !prev.isMute,
                      }))
                    }
                  >
                    {videoControls.isMute ? <VolumeOff /> : <VolumeUp />}
                  </div>
                  <div className="timeStamp">
                    <span>{getDuration(videoTimeStamp)}</span> :{" "}
                    <span>{getDuration(videoDetails.duration)}</span>
                  </div>
                </div>
                <div>
                  <div className="settings">
                    <Settings />
                  </div>
                  <div
                    className="pictureInPicture"
                    onClick={() =>
                      setVideoControls((prev) => ({
                        ...prev,
                        pictureInpicture: !prev.pictureInpicture,
                      }))
                    }
                  >
                    {videoControls.pictureInpicture ? (
                      <PictureInPictureSharp />
                    ) : (
                      <PictureInPictureAltSharp />
                    )}
                  </div>
                  <div
                    className="theater"
                    onClick={() =>
                      setVideoControls((prev) => ({
                        ...prev,
                        inTheaterMode: !prev.inTheaterMode,
                      }))
                    }
                  >
                    {videoControls.inTheaterMode ? (
                      <Crop169Sharp />
                    ) : (
                      <Crop32Sharp />
                    )}
                  </div>
                  <div
                    className="fullScreen"
                    onClick={() =>
                      setVideoControls((prev) => ({
                        ...prev,
                        inFullScreen: !prev.inFullScreen,
                      }))
                    }
                  >
                    {videoControls.inFullScreen ? (
                      <FullscreenExit />
                    ) : (
                      <CropFreeSharp />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <video
            className="mainVideo"
            src={videoDetails.video}
            preload="metadata"
            ref={videoRef}
            onPlaying={() =>
              setVideoControls((prev) => ({ ...prev, isPause: false }))
            }
            onPause={() =>
              setVideoControls((prev) => ({
                ...prev,
                isPause: true,
                isEnd: false,
              }))
            }
            onEnded={() =>
              setVideoControls((prev) => ({ ...prev, isEnd: !prev.isEnd }))
            }
          ></video>
        </div>
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
            <button
              className={`subscribeBtn ${
                videoDetails.owner?.isSubscribed ? "subscribed" : ""
              }`}
            >
              {videoDetails.owner?.isSubscribed ? "Subscribed" : "Subscribe"}
            </button>
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
      {videoControls.inTheaterMode || (
        <div className="relatedContainer">
          <RelatedVideoCard />
        </div>
      )}
    </div>
  );
};

export default Player;
