import { useEffect, useState } from "react";
import { VideoList } from "../components";
import { useSelector } from "react-redux";

const Home = () => {
  const [marginLeft, setMarginLeft] = useState("250px");
  const isSlideVisible = useSelector((state) => state.navSlide);
  const style = {
    marginLeft,
    transition: "margin-left .6s ease-in",
  };

  useEffect(() => {
    if (isSlideVisible) {
      setMarginLeft("250px");
    } else {
      setMarginLeft("0px");
    }
  }, [isSlideVisible]);

  return (
    <div style={style}>
      <VideoList cardNumbers={isSlideVisible ? 3 : 4} />
    </div>
  );
};

export default Home;
