import { Outlet, useLocation } from "react-router-dom";
import { Header, SlideNav } from "./components";
import "./styles/utiles.css";
import { useEffect, useState } from "react";
import { authService } from "./backendServices";
import { useDispatch } from "react-redux";
import { login } from "./store/slices/authSlice";
import axios from "axios";

function App() {
  const [isAuthPage, setIsAuthPage] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const { pathname } = useLocation();
  const dispath = useDispatch();

  useEffect(() => {
    if (pathname.includes("login") || pathname.includes("register")) {
      setIsAuthPage(false);
    } else {
      setIsAuthPage(true);
    }
  }, [pathname]);

  useEffect(() => {
    async function fetchUserDetails() {
      setIsLoading(true);
      try {
        await axios.get("/api/v1");
        const userData = await authService.getCurrentUser();
        dispath(login(userData));
      } catch (error) {
        console.error(error);
      }

      setIsLoading(false);
    }

    fetchUserDetails();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {isAuthPage && (
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
