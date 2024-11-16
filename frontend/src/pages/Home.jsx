import { useEffect, useState } from "react";
import { VideoList } from "../components";
import { useDispatch, useSelector } from "react-redux";
import "../styles/Home.css";
import { Link } from "react-router-dom";
import { AccountCircleOutlined } from "@mui/icons-material";
import { videoService } from "../backendServices/videoService";
import { addVideos } from "../store/slices/videoSlice";

const Home = () => {
  const [marginLeft, setMarginLeft] = useState("250px");
  const isSlideVisible = useSelector((state) => state.navSlide);
  const isLogedIn = useSelector((state) => state.auth.isLogedIn);
  const videos = useSelector((state) => state.video);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isSlideVisible) {
      setMarginLeft("250px");
    } else {
      setMarginLeft("0px");
    }
  }, [isSlideVisible]);

  useEffect(() => {
    async function fetchAllVideos() {
      setIsLoading(true);
      try {
        const videos = await videoService.getVideos({});
        dispatch(addVideos(videos));
      } catch (error) {
        console.error(error);
      }
      setIsLoading(false);
    }

    if (isLogedIn) {
      fetchAllVideos();
    }
  }, [isLogedIn]);

  return (
    <div style={{ marginLeft }} className="videoContainer">
      {isLogedIn ? (
        <VideoList
          cardNumbers={isSlideVisible ? 3 : 4}
          videos={videos}
          simmer={isLoading}
        />
      ) : (
        <div className="videoTextContainer">
          <h1>Login to Unlock Exclusive Videos</h1>
          <p>
            To access our exclusive video content, please log in to your
            account. If you don't have an account, sign up now to unlock a world
            of engaging videos.
          </p>
          <Link
            to={"/login"}
            className="flex-all signinBtn"
            style={{ marginTop: "20px" }}
          >
            {<AccountCircleOutlined fontSize="small" />} <span>Sign in</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;
