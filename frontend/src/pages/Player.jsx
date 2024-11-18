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
} from "@mui/icons-material";
import { videoService } from "../backendServices/videoService";
import { RelatedVideoCard } from "../components";

const Player = () => {
  const { id } = useParams();
  const dispath = useDispatch();
  const [videoDetails, setVideoDetails] = useState({});

  useEffect(() => {
    dispath(defineNavVisibelity(false));
    async function fetchVideoDetails() {
      try {
        const videoDetails = await videoService.getVideo(id);
        console.log(videoDetails);

        setVideoDetails(videoDetails);
      } catch (error) {
        console.error(error);
      }
    }

    // fetchVideoDetails();
  }, []);
  return (
    <div className="container">
      <div className="playerContainer">
        <div className="player"></div>
        <div className="videoTitle">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Error quo
          voluptas repellat iste quae quas officia impedit reprehenderit
          praesentium iure quam eius quos, recusandae mollitia adipisci aliquam
          exercitationem sapiente quibusdam.
        </div>
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
                Channel Name
              </Link>
              <div className="subscribers">100k Subscribers</div>
            </div>
            <button className="subscribeBtn">Subscribe</button>
          </div>
          <div className="videoControllers">
            <div className="likeVideo videoControl">
              <ThumbUpAltOutlined fontSize="small" />
              {0}
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
      </div>
      <div className="relatedContainer">
        <RelatedVideoCard />
      </div>
    </div>
  );
};

export default Player;
