// import Home from "./Home";
// import Auth from "./Auth";
// import Error from "./Error";
// import Player from "./Player";
import { lazy } from "react";

const Home = lazy(() => import("./Home"));
const Auth = lazy(() => import("./Auth"));
const Error = lazy(() => import("./Error"));
const Player = lazy(() => import("./Player"));

export { Home, Auth, Error, Player };
