import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

const SecureRoute = ({ children, authRequired = true }) => {
  const isLogedIn = useSelector((state) => state.auth.isLogedIn);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (!isLogedIn && !authRequired) {
      navigate("/login", { state: { from: pathname } });
    }

    return () => {};
  }, []);

  return children;
};

export default SecureRoute;
