import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
  createTweet,
  getUserTweets,
  updateTweet,
  deleteTweet,
} from "../controllers/tweet.controllers.js";
const router = Router();

router.use(verifyJwt);

router.route("/:userId").get(getUserTweets);
router.route("/create").post(createTweet);
router.route("/update/:tweetId").patch(updateTweet);
router.route("/delete/:tweetId").delete(deleteTweet);

export default router;
