import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
  getAllVideos,
  getVideoById,
} from "../controllers/video.controllers.js";

const router = Router();
router.use(verifyJwt);

router.route("/").get(getAllVideos); // it will work with query
router.route("/:videoId").get(getVideoById);

export default router;
