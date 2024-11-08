import { Outlet, useLocation } from "react-router-dom";
import { Header, SlideNav } from "./components";
import "./styles/utiles.css";
import { useEffect, useState } from "react";

function App() {
  const [isAuth, setIsAuth] = useState(true);
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname.includes("login") || pathname.includes("register")) {
      setIsAuth(false);
    } else {
      setIsAuth(true);
    }
  }, [pathname]);
  return (
    <>
      {isAuth && (
        <>
          <Header />
          <SlideNav />
        </>
      )}
      <Outlet />
    </>
  );
}

export default App;
