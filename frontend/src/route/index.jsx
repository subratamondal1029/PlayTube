import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import App from "../App";
import { Home, Auth, Error } from "../pages";
import { SecureRoute } from "../components";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />} errorElement={<Error />}>
      <Route
        path=""
        element={
          <SecureRoute authRequired>
            <Home />
          </SecureRoute>
        }
      ></Route>
      <Route path="login" element={<Auth type="l" />}></Route>
      <Route path="register" element={<Auth type="r" />}></Route>
    </Route>
  )
);

export default router;
