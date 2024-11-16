import fs from "fs";
import { isValidObjectId, Types } from "mongoose";
import { Video } from "../models/video.model.js";
import { Like } from "../models/like.model.js";
import { Comment } from "../models/comment.model.js";
import { User } from "../models/user.model.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  deleteCloudinaryFile,
  uploadFileOnCloudinary,
} from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    query = "",
    sortBy = "createdAt",
    sortType = "desc",
    userId,
  } = req.query;

  const skipPage = (parseInt(page) - 1) * parseInt(limit);

  let matchStatement = {
    isPublished: true,
  };

  if (userId !== "undefined" && userId !== "null") {
    matchStatement.owner = new Types.ObjectId(userId);
  }
  if (query)
    matchStatement.$or = [
      { title: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
    ];

  const videos = await Video.aggregate([
    {
      $match: matchStatement,
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
      $skip: skipPage,
    },
    {
      $limit: parseInt(limit),
    },
    {
      $sort: {
        [sortBy]: sortType === "asc" ? 1 : -1,
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

  if (!videos || videos?.length === 0)
    throw new apiError(404, "No videos found");
  res.json(new apiResponse(200, videos, "Videos fetched successfully"));
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description, isPublished } = req.body;
  // TODO: get video, upload to cloudinary, create video
  if (!title || !description)
    throw new apiError(400, "All Fields are required");

  const uploadedFiles = req.files;
  if (
    !uploadedFiles ||
    !uploadedFiles.video ||
    uploadedFiles.video.length === 0
  )
    throw new apiError(400, "Video is required");

  const videoLocalFile = uploadedFiles.video[0].path;
  const thumbnailLocalFile = uploadedFiles?.thumbnail?.[0]?.path;
  const video = await uploadFileOnCloudinary(videoLocalFile);
  if (!video) {
    if (thumbnailLocalFile) fs.unlinkSync(thumbnailLocalFile);
    throw new apiError(500, "Failed to upload video");
  }

  const thumbnail = await uploadFileOnCloudinary(thumbnailLocalFile);

  const newVideo = await Video.create({
    title,
    description,
    video: video.url,
    thumbnail: thumbnail?.url,
    isPublished: isPublished ? Boolean(isPublished) : true,
    duration: video.duration,
    owner: req.user._id,
  });

  if (!newVideo) throw new apiError(500, "Failed to create video");

  res
    .status(201)
    .json(new apiResponse(201, newVideo, "Video created successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId || !isValidObjectId(videoId))
    throw new apiError(400, "Invalid Video Id");

  const video = await Video.aggregate([
    {
      $match: {
        _id: new Types.ObjectId(videoId),
        isPublished: true,
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
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "likes",
        pipeline: [
          {
            $project: {
              likedBy: 1,
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
        likeCount: {
          $size: "$likes",
        },
        isLiked: {
          $cond: {
            if: {
              $in: [req.user._id, "$likes.likedBy"],
            },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        likes: 0,
      },
    },
  ]);

  if (!video || video.length === 0) throw new apiError(404, "Video not found");

  res.json(new apiResponse(200, video[0], "Video fetched successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;

  //TODO: update video details like title, description, thumbnail
  if (!videoId || !isValidObjectId(videoId))
    throw new apiError(400, "Invalid Video Id");

  const video = await Video.findById(videoId);
  if (!video) throw new apiError(404, "Video not found");

  const thumbnailLocalFile = req.file?.thumbnail?.path;

  if (!thumbnailLocalFile && !title && !description) {
    throw new apiError(400, "At least one field is required");
  }

  if (thumbnailLocalFile) {
    const thumbnail = await uploadFileOnCloudinary(thumbnailLocalFile);
    if (thumbnail) {
      await deleteCloudinaryFile(video.thumbnail);
      video.thumbnail = thumbnail.url;
    }
  }

  if (title) video.title = title;
  if (description) video.description = description;
  await video.save({ validateBeforeSave: false });

  res.json(new apiResponse(200, video, "Video updated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
  if (!videoId || !isValidObjectId(videoId))
    throw new apiError(400, "Invalid Video Id");

  const video = await Video.findById(videoId);
  if (!video) throw new apiError(404, "Video not found");

  const deletedVideoFile = await deleteCloudinaryFile(video.video);
  if (!deletedVideoFile) throw new apiError(500, "Failed to delete video");
  if (deletedVideoFile && video.thumbnail) {
    await deleteCloudinaryFile(video.thumbnail);
  }
  await Like.deleteMany({ video: videoId });
  await Comment.deleteMany({ video: videoId });
  await User.updateMany(
    {
      watchHistory: {
        $in: [videoId],
      },
    },
    {
      $pull: {
        watchHistory: videoId,
      },
    }
  );
  await video.deleteOne();
  res.json(new apiResponse(200, {}, "Video deleted successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId || !isValidObjectId(videoId))
    throw new apiError(400, "Invalid Video Id");

  const video = await Video.findById(videoId);
  if (!video) throw new apiError(404, "Video not found");

  video.isPublished = !video.isPublished;
  await video.save({
    validateBeforeSave: false,
  });

  res.json(new apiResponse(200, video, "Video updated successfully"));
});

const addViews = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId || !isValidObjectId(videoId))
    throw new apiError(400, "Invalid Video Id");

  const video = await Video.findById(videoId);
  if (!video) throw new apiError(404, "Video not found");

  const isHistoryAlreadyAdded = req.user.watchHistory.includes(videoId);
  if (isHistoryAlreadyAdded) throw new apiError(409, "Video already added");

  await Video.updateOne(
    { _id: videoId },
    {
      $inc: { views: 1 },
    }
  );

  await User.updateOne(
    { _id: req.user._id },
    {
      $push: { watchHistory: videoId },
    }
  );

  res.json(
    new apiResponse(
      200,
      { views: video.views + 1 },
      "Video views updated successfully"
    )
  );
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
  addViews,
};
