import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
  getVideoComments,
  getTweetComments,
  addComment,
  updateComment,
  deleteComment,
} from "../controllers/comment.controllers.js";

const router = Router();

router.use(verifyJwt);

router.route("/v/:videoId").get(getVideoComments);
router.route("/t/:tweetId").get(getTweetComments);

router.route("/create").post(addComment);
router.route("/update/:commentId").patch(updateComment);
router.route("/delete/:commentId").delete(deleteComment);

export default router;
