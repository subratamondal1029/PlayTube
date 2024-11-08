import { NavLink } from "react-router-dom";
import "../styles/SlideNav.css";
import {
  History,
  Home,
  PlaylistPlayOutlined,
  SmartDisplayOutlined,
  ThumbUpAltOutlined,
} from "@mui/icons-material";
import { useSelector } from "react-redux";

const SlideNav = () => {
  const isVisible = useSelector((state) => state.navSlide);
  return (
    <div className={`slideContainer ${isVisible ? "visible" : ""}`}>
      <NavLink
        to={"/"}
        className={({ isActive }) => `flex-all ${isActive ? "active" : ""}`}
      >
        {" "}
        {<Home />} Home
      </NavLink>
      <NavLink
        to={"/history"}
        className={({ isActive }) => `flex-all ${isActive ? "active" : ""}`}
      >
        {" "}
        {<History />} History
      </NavLink>
      <NavLink
        to={"/playlists"}
        className={({ isActive }) => `flex-all ${isActive ? "active" : ""}`}
      >
        {" "}
        {<PlaylistPlayOutlined />} Playlists
      </NavLink>
      <NavLink
        to={"/liked-videos"}
        className={({ isActive }) => `flex-all ${isActive ? "active" : ""}`}
      >
        {" "}
        {<ThumbUpAltOutlined />} Liked videos
      </NavLink>
      <NavLink
        to={"/account/videos"}
        className={({ isActive }) => `flex-all ${isActive ? "active" : ""}`}
      >
        {" "}
        {<SmartDisplayOutlined />} Your videos
      </NavLink>
    </div>
  );
};

export default SlideNav;
