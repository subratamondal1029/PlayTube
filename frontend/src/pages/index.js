import { lazy } from "react";

const Home = lazy(() => import("./Home"));
const Auth = lazy(() => import("./Auth"));
import Error from "./Error";
const Player = lazy(() => import("./Player"));

export { Home, Auth, Error, Player };
