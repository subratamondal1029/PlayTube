import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import App from "../App";
import { Home, Auth } from "../pages";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="" element={<Home />}></Route>
      <Route path="login" element={<Auth type="l" />}></Route>
      <Route path="register" element={<Auth type="r" />}></Route>
    </Route>
  )
);

export default router;
