import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changePassword,
  getCurrentUser,
  updateUserDetails,
  updatedUserAvatar,
  updatedUserCoverImage,
  userWatchHistory,
} from "../controllers/users.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);

// secured routes
router.route("/logout").post(verifyJwt, logoutUser);
router.route("/refresh-accessToken").post(refreshAccessToken);
router.route("/current-user").get(verifyJwt, getCurrentUser);
router.route("/change-password").patch(verifyJwt, changePassword);
router.route("/update-userdetails").patch(verifyJwt, updateUserDetails);
router
  .route("/updated-avatar")
  .patch(verifyJwt, upload.single("avatar"), updatedUserAvatar);
router
  .route("/updated-coverImage")
  .patch(verifyJwt, upload.single("coverImage"), updatedUserCoverImage);
router.route("/watch-history").get(verifyJwt, userWatchHistory);

export default router;
