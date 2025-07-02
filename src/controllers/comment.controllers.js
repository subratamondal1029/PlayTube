import { isValidObjectId, Types } from "mongoose";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Comment } from "../models/comment.model.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  let { page, limit } = req.query;

  if (!page) page = 1;
  if (!limit) limit = 10;

  const skipPage = (Number(page) - 1) * Number(limit);

  if (!videoId || !isValidObjectId(videoId))
    throw new ApiError(400, "Invalid Video Id");

  const totalComments = await Comment.countDocuments({ video: videoId });
  const totalPages = Math.ceil(totalComments / Number(limit));

  const comments = await Comment.aggregate([
    {
      $match: {
        video: new Types.ObjectId(videoId),
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
              username: 1,
              fullName: 1,
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
        foreignField: "comment",
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
        totalLikes: {
          $size: "$likes",
        },
      },
    },
    {
      $project: {
        likes: 0,
      },
    },
  ])
    .skip(Number(skipPage))
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  if (!comments) throw new ApiError(500, "Error while fetching comments");

  res.json(
    new ApiResponse(200, "Comments fetched successfully", {
      comments,
      totalComments,
      totalPages,
    })
  );
});

const getTweetComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { tweetId } = req.params;
  let { page, limit } = req.query;

  if (!page) page = 1;
  if (!limit) limit = 10;

  const skipPage = (Number(page) - 1) * Number(limit);

  if (!tweetId || !isValidObjectId(tweetId))
    throw new ApiError(400, "Invalid Video Id");

  const totalComments = await Comment.countDocuments({ tweet: tweetId });
  const totalPages = Math.ceil(totalComments / Number(limit));

  const comments = await Comment.aggregate([
    {
      $match: {
        tweet: new Types.ObjectId(tweetId),
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
              username: 1,
              fullName: 1,
              avatar: 1,
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
  ])
    .skip(skipPage)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  if (!comments) throw new ApiError(500, "Error while fetching comments");

  res.json(
    new ApiResponse(200, "Comments fetched successfully", {
      comments,
      totalComments,
      totalPages,
    })
  );
});

const addComment = asyncHandler(async (req, res) => {
  const { content, videoId, tweetId } = req.body;

  if (!content) throw new ApiError(400, "Content is required");
  if (!videoId && !tweetId)
    throw new ApiError(400, "videoId or tweetId is required");

  if (
    (videoId && !isValidObjectId(videoId)) ||
    (tweetId && !isValidObjectId(tweetId)) ||
    (!videoId && !tweetId)
  ) {
    throw new ApiError(400, "Invalid video ID or tweet ID");
  }

  if (videoId) {
    const existingCommentsOnVideo = await Comment.find({ video: videoId });
    if (existingCommentsOnVideo.length >= 10)
      throw new ApiError(422, "Maximum 10 comments allowed");
  }

  const comment = await Comment.create({
    content,
    video: videoId ? videoId : null,
    tweet: tweetId ? tweetId : null,
    owner: req.user._id,
  });

  if (!comment) throw new ApiError(500, "Error while creating comment");

  res
    .status(201)
    .json(new ApiResponse(201, "Comment Added successfully", comment));
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
  const { commentId } = req.params;
  const { content } = req.body;

  if (!commentId || !isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid tweet id");
  }

  if (!content) {
    throw new ApiError(400, "Content is required");
  }

  const comment = await Comment.findOneAndUpdate(
    { _id: commentId, owner: req.user._id },
    { content },
    { new: true }
  );

  if (!comment) throw new ApiError(500, "Error while updating comment");
  res.json(new ApiResponse(200, "Comment updated successfully", comment));
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
  const { commentId } = req.params;
  if (!commentId || !isValidObjectId(commentId))
    throw new ApiError(400, "Invalid TweetId");

  const comment = await Comment.findById(commentId);
  if (!comment) throw new ApiError(404, "Comment not found");

  await Comment.findByIdAndDelete({
    _id: commentId,
    owner: req.user._id,
  });

  res.json(new ApiResponse(200, "Comment Deleted successfully"));
});

export {
  getVideoComments,
  getTweetComments,
  addComment,
  updateComment,
  deleteComment,
};
