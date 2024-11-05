import { Router } from "express";
import { channelProfileDetails } from "../controllers/users.controllers.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  subscribeChannel,
  unsubscribeChannel,
} from "../controllers/subscription.controllers.js";

import {
  publishAVideo,
  togglePublishStatus,
  addViews,
  updateVideo,
  deleteVideo,
} from "../controllers/video.controllers.js";
import { getChannelStats } from "../controllers/dashboard.controllers.js";

const router = Router();
router.use(verifyJwt);

router.route("/u/:username").get(channelProfileDetails);
router.route("/dashboard").get(getChannelStats);
router.route("/subscribe/:channelId").post(subscribeChannel);
router.route("/unsubscribe/:channelId").delete(unsubscribeChannel);
router.route("/upload").post(
  upload.fields([
    {
      name: "video",
      maxCount: 1,
    },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  publishAVideo
);

router.route("/toggle-publish/:videoId").patch(togglePublishStatus);
router.route("/update/:videoId").patch(updateVideo);
router.route("/delete/:videoId").delete(deleteVideo);
router.route("/views/:videoId").put(addViews);

export default router;
