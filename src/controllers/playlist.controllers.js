import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { Video } from "../models/video.model.js";
import { Playlist } from "../models/playlist.model.js";
import { isValidObjectId, Types } from "mongoose";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description, videoId } = req.body;

  //TODO: create playlist
  if (!name?.trim() || !description?.trim())
    throw new ApiError(400, "name or description is required");

  if (videoId) {
    if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid Video Id");
    const video = await Video.findById(videoId);
    if (!video) throw new ApiError(404, "Video not found");
  }

  const playlist = await Playlist.create({
    name,
    description,
    owner: req.user._id,
    videos: videoId ? [videoId] : [],
  });

  if (!playlist) throw new ApiError(500, "Error while creating playlist");

  res
    .status(201)
    .json(new ApiResponse(201, playlist, "Playlist created successfully"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  //TODO: get user playlists
  if (!userId || !isValidObjectId(userId))
    throw new ApiError(400, "user id is invalid");

  const playlist = await Playlist.aggregate([
    {
      $match: {
        owner: new Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              fullName: 1,
              username: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "videos",
        foreignField: "_id",
        as: "videos",
        pipeline: [
          {
            $project: {
              _id: 1,
              title: 1,
              description: 1,
              thumbnail: 1,
              owner: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        owner: {
          $first: "$owner",
        },
        videos: {
          $first: "$videos",
        },
      },
    },
  ]);

  if (!playlist || playlist.length === 0)
    throw new ApiError(404, "Playlist not found");

  res.json(new ApiResponse(200, playlist, "Playlist found"));
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  //TODO: get playlist by id
  if (!playlistId || !isValidObjectId(playlistId))
    throw new ApiError(400, "Invalid Playlist Id");

  const [playlist] = await Playlist.aggregate([
    {
      $match: {
        _id: new Types.ObjectId(playlistId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              _id: 0,
              fullName: 1,
              username: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "videos",
        foreignField: "_id",
        as: "videos",
        pipeline: [
          {
            $project: {
              _id: 1,
              title: 1,
              description: 1,
              thumbnail: 1,
              owner: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        owner: {
          $first: "$owner",
        },
      },
    },
  ]);

  if (!playlist) throw new ApiError(404, "Playlist not found");

  res.json(new ApiResponse(200, playlist, "Playlist found"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  // TODO: add video to playlist
  if (!playlistId || !isValidObjectId(playlistId))
    throw new ApiError(400, "Invalid Playlist Id");

  if (!videoId || !isValidObjectId(videoId))
    throw new ApiError(400, "Invalid Video Id");

  const video = await Video.findById(videoId);
  if (!video) throw new ApiError(404, "Video not found");

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) throw new ApiError(404, "Playlist not found");
  if (playlist.owner.toString() !== req.user._id.toString())
    throw new ApiError(403, "Unauthorized");

  if (playlist.videos.includes(videoId))
    throw new ApiError(404, "Video already in playlist");

  playlist.videos.push(videoId);
  await playlist.save();

  res.json(new ApiResponse(200, playlist, "Video added successfully"));
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  // TODO: remove video from playlist
  if (!playlistId || !isValidObjectId(playlistId))
    throw new ApiError(400, "Invalid Playlist Id");

  if (!videoId || !isValidObjectId(videoId))
    throw new ApiError(400, "Invalid Video Id");

  const video = await Video.findById(videoId);
  if (!video) throw new ApiError(404, "Video not found");

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) throw new ApiError(404, "Playlist not found");
  if (playlist.owner.toString() !== req.user._id.toString())
    throw new ApiError(403, "Unauthorized");

  if (!playlist.videos.includes(videoId))
    throw new ApiError(404, "Video not found in playlist");

  playlist.videos.pull(videoId);
  await playlist.save();

  res.json(new ApiResponse(200, playlist, "Video removed successfully"));
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  // TODO: delete playlist
  if (!playlistId || !isValidObjectId(playlistId))
    throw new ApiError(400, "Invalid Playlist Id");

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) throw new ApiError(404, "Playlist not found");
  if (playlist.owner.toString() !== req.user._id.toString())
    throw new ApiError(403, "Unauthorized");

  await Playlist.findByIdAndDelete(playlistId);

  res.json(new ApiResponse(200, {}, "Playlist deleted successfully"));
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  //TODO: update playlist
  if (!playlistId || !isValidObjectId(playlistId))
    throw new ApiError(400, "Invalid Playlist Id");

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) throw new ApiError(404, "Playlist not found");
  if (playlist.owner._id.toString() !== req.user._id.toString())
    throw new ApiError(403, "Unauthorized");

  if (name) playlist.name = name;
  if (description) playlist.description = description;
  await playlist.save({ validateBeforeSave: false });

  res.json(new ApiResponse(200, playlist, "Playlist updated successfully"));
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
