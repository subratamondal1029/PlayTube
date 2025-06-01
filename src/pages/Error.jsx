import React from "react";
import { useNavigate, useRouteError } from "react-router-dom";
import "../styles/Error.css";

const ErrorComponent = () => {
  const error = useRouteError();

  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="error-container">
      <h1 className="error-code">{error?.status || 500}</h1>
      <p className="error-message">
        {error?.statusText || "Internal Server Error"}
      </p>
      <button className="back-button" onClick={handleBack}>
        Go Back
      </button>
    </div>
  );
};

export default ErrorComponent;
