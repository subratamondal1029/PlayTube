import { Link } from "react-router-dom";
import {
  Mic,
  Search,
  VideoCallOutlined,
  AccountCircleOutlined,
  MenuOutlined,
} from "@mui/icons-material";
import "../styles/Header.css";
import { useSelector, useDispatch } from "react-redux";
import { toggleNavSlide } from "../store/slices/slideSlice";

const Header = () => {
  const dispath = useDispatch();
  const { isLogedIn, userData } = useSelector((state) => state.auth);
  return (
    <>
      <header className="flex-all">
        <nav>
          <div
            className="flex-all menuBar"
            onClick={() => dispath(toggleNavSlide())}
          >
            {<MenuOutlined />}
          </div>
          <Link to={"/"} className="logo flex-all">
            <img src="/logo.png" alt="PlayTube" />
            <span>PlayTube</span>
          </Link>
          <form id="searchContainer" className="flex-all">
            <input
              type="text"
              name="query"
              placeholder="Search"
              title="Type query"
            />
            <button type="submit" title="Search">
              {<Search />}
            </button>
            <button
              type="button"
              className="flex-all"
              title="Search With Voice"
            >
              {<Mic />}
            </button>
          </form>
          <div id="accountNavigation">
            {isLogedIn ? (
              <>
                <Link to={"/upload"} className="flex-all circle">
                  {<VideoCallOutlined fontSize="large" />}
                </Link>
                <Link
                  to={`/users/${userData.username}`}
                  className="accountBtn flex-all circle"
                >
                  {<AccountCircleOutlined fontSize="large" />}
                </Link>
              </>
            ) : (
              <Link to={"/login"} className="flex-all signinBtn">
                {<AccountCircleOutlined fontSize="small" />}{" "}
                <span>Sign in</span>
              </Link>
            )}
          </div>
        </nav>
      </header>
    </>
  );
};

export default Header;
