import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
} from "../controllers/playlist.controllers.js";

const router = Router();
router.use(verifyJwt);

router.route("/create").post(createPlaylist);
router.route("/update/:playlistId").patch(updatePlaylist);
router.route("/delete/:playlistId").delete(deletePlaylist);
router.route("/u/:userId").get(getUserPlaylists);
router.route("/:playlistId").get(getPlaylistById);
router.route("/add/:playlistId/v/:videoId").put(addVideoToPlaylist);
router.route("/delete/:playlistId/v/:videoId").delete(removeVideoFromPlaylist);

export default router;
