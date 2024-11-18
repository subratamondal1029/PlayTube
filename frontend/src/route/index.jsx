import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import App from "../App";
import { Home, Auth, Error, Player } from "../pages/index";
import { SecureRoute } from "../components";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />} errorElement={<Error />}>
      <Route path="login" element={<Auth type="l" />}></Route>
      <Route path="register" element={<Auth type="r" />}></Route>
      <Route path="" element={<Home />}></Route>
      <Route
        path="player/:id"
        element={
          <SecureRoute authRequired>
            <Player />
          </SecureRoute>
        }
      ></Route>
    </Route>
  )
);

export default router;
