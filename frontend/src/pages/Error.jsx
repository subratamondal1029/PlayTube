import React from "react";
import { useLocation, useRouteError } from "react-router-dom";

const Error = () => {
  const error = useRouteError();
  console.log(error);

  return <div>{error.data}</div>;
};

export default Error;
