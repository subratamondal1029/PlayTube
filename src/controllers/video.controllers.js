import fs from "fs";
import { isValidObjectId, Types } from "mongoose";
import { Video } from "../models/video.model.js";
import { Like } from "../models/like.model.js";
import { Comment } from "../models/comment.model.js";
import { User } from "../models/user.model.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  deleteCloudinaryFile,
  uploadFileOnCloudinary,
} from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  let { page, limit, query = "", sortBy, sortType, userId } = req.query;

  if (!page) page = 1;
  if (!limit) limit = 10;

  if (!sortBy?.trim()) sortBy = "createdAt";
  if (!sortType?.trim()) sortType = "desc";

  const skipPage = (parseInt(page) - 1) * parseInt(limit);

  let matchStatement = {
    isPublished: true,
  };

  if (userId?.trim()) {
    matchStatement.owner = new Types.ObjectId(userId);
  }
  if (query) {
    matchStatement.$or = [
      { title: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
    ];
  }

  const totalVideos = await Video.countDocuments(matchStatement);
  const totalPages = Math.ceil(totalVideos / parseInt(limit));

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

  res.json(
    new ApiResponse(200, "Videos fetched successfully", {
      videos,
      totalVideos,
      totalPages,
      currentPage: parseInt(page),
    })
  );
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description, isPublished } = req.body;
  if (!title || !description)
    throw new ApiError(400, "Title and description are required");

  const uploadedFiles = req.files;
  if (
    !uploadedFiles ||
    !uploadedFiles.video ||
    uploadedFiles.video.length === 0
  )
    throw new ApiError(400, "Video is required");

  const videoLocalFile = uploadedFiles.video[0].path;
  const thumbnailLocalFile = uploadedFiles?.thumbnail?.[0]?.path;

  if (!uploadedFiles?.video?.[0]?.mimetype?.includes("video/"))
    throw new ApiError(400, "Invalid video format");

  const video = await uploadFileOnCloudinary(videoLocalFile);
  if (!video) {
    if (thumbnailLocalFile) fs.unlinkSync(thumbnailLocalFile);
    throw new ApiError(500, "Failed to upload video");
  }

  if (
    thumbnailLocalFile &&
    !uploadedFiles?.thumbnail?.[0]?.mimetype?.includes("image/")
  )
    throw new ApiError(400, "Invalid thumbnail format");
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

  if (!newVideo) throw new ApiError(500, "Failed to create video");

  res
    .status(201)
    .json(new ApiResponse(201, "Video created successfully", newVideo));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId || !isValidObjectId(videoId))
    throw new ApiError(400, "Invalid Video Id");

  const [video] = await Video.aggregate([
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
            $lookup: {
              from: "subscriptions",
              localField: "_id",
              foreignField: "channel",
              as: "subscribers",
            },
          },
          {
            $addFields: {
              subscriberCount: {
                $size: "$subscribers",
              },
              isSubscribed: {
                $cond: {
                  if: {
                    $in: [req.user._id, "$subscribers.subscriber"],
                  },
                  then: true,
                  else: false,
                },
              },
            },
          },
          {
            $project: {
              _id: 0,
              fullName: 1,
              username: 1,
              avatar: 1,
              subscriberCount: 1,
              isSubscribed: 1,
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
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "video",
        as: "comments",
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
        commentCount: {
          $size: "$comments",
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
        comments: 0,
      },
    },
  ]);

  if (!video) throw new ApiError(404, "Video not found");

  res.json(new ApiResponse(200, "Video fetched successfully", video));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;

  if (!videoId || !isValidObjectId(videoId))
    throw new ApiError(400, "Invalid Video Id");

  const video = await Video.findById(videoId);
  if (!video) throw new ApiError(404, "Video not found");

  const thumbnailLocalFile = req.file?.path;

  if (!thumbnailLocalFile && !title && !description) {
    throw new ApiError(400, "At least one field is required");
  }

  if (thumbnailLocalFile) {
    const thumbnail = await uploadFileOnCloudinary(thumbnailLocalFile);
    if (thumbnail) {
      video.thumbnail = thumbnail.url;
      deleteCloudinaryFile(video.thumbnail);
    }
  }

  if (title) video.title = title;
  if (description) video.description = description;
  await video.save({ validateBeforeSave: false });

  res.json(new ApiResponse(200, "Video updated successfully", video));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
  if (!videoId || !isValidObjectId(videoId))
    throw new ApiError(400, "Invalid Video Id");

  const video = await Video.findById(videoId);
  if (!video) throw new ApiError(404, "Video not found");

  const deletedVideoFile = await deleteCloudinaryFile(video.video);
  if (!deletedVideoFile) throw new ApiError(500, "Failed to delete video");
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
  res.json(new ApiResponse(200, "Video deleted successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId || !isValidObjectId(videoId))
    throw new ApiError(400, "Invalid Video Id");

  const video = await Video.findById(videoId);
  if (!video) throw new ApiError(404, "Video not found");

  video.isPublished = !video.isPublished;
  await video.save({
    validateBeforeSave: false,
  });

  res.json(new ApiResponse(200, "Video status updated successfully", video));
});

const addViews = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId || !isValidObjectId(videoId))
    throw new ApiError(400, "Invalid Video Id");

  const video = await Video.findById(videoId);
  if (!video) throw new ApiError(404, "Video not found");

  const isHistoryAlreadyAdded = req.user.watchHistory.includes(videoId);
  if (isHistoryAlreadyAdded) throw new ApiError(409, "Video already added");

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
    new ApiResponse(200, "Video views updated successfully", {
      views: video.views + 1,
    })
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
