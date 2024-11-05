import { isValidObjectId, Types } from "mongoose";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Comment } from "../models/comment.model.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const skipPage = (Number(page) - 1) * Number(limit);

  if (!videoId || !isValidObjectId(videoId))
    throw new apiError(400, "Invalid Video Id");

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

  if (!comments) throw new apiError(500, "Error while fetching comments");

  res.json(new apiResponse(200, comments, "Comments fetched successfully"));
});

const getTweetComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { tweetId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const skipPage = (Number(page) - 1) * Number(limit);

  if (!tweetId || !isValidObjectId(tweetId))
    throw new apiError(400, "Invalid Video Id");

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

  if (!comments) throw new apiError(500, "Error while fetching comments");

  res.json(new apiResponse(200, comments, "Comments fetched successfully"));
});

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video
  const { content, videoId, tweetId } = req.body;

  if (!content) throw new apiError(400, "Content is required");
  if (!videoId && !tweetId)
    throw new apiError(400, "videoId or tweetId is required");

  if (
    (videoId && !isValidObjectId(videoId)) ||
    (tweetId && !isValidObjectId(tweetId)) ||
    (!videoId && !tweetId)
  ) {
    throw new apiError(400, "Invalid video ID or tweet ID");
  }

  // TODO: add a validatio for only 10 comment on a video or tweet
  if (videoId) {
    const existingCommentsOnVideo = await Comment.find({ video: videoId });
    if (existingCommentsOnVideo.length >= 10)
      throw new apiError(422, "Maximum 10 comments allowed");
  }

  const comment = await Comment.create({
    content,
    video: videoId ? videoId : null,
    tweet: tweetId ? tweetId : null,
    owner: req.user._id,
  });

  if (!comment) throw new apiError(500, "Error while creating comment");

  res
    .status(201)
    .json(new apiResponse(201, comment, "comment added successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
  const { commentId } = req.params;
  const { content } = req.body;

  if (!commentId || !isValidObjectId(commentId)) {
    throw new apiError(400, "Invalid tweet id");
  }

  if (!content) {
    throw new apiError(400, "Content is required");
  }

  const comment = await Comment.findOneAndUpdate(
    { _id: commentId, owner: req.user._id },
    { content },
    { new: true }
  );

  if (!comment) throw new apiError(500, "Error while updating comment");
  res.json(new apiResponse(200, comment, "comment updated successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
  const { commentId } = req.params;
  if (!commentId || !isValidObjectId(commentId))
    throw new apiError(400, "Invalid TweetId");

  const comment = await Comment.findByIdAndDelete({
    _id: commentId,
    owner: req.user._id,
  });
  if (!comment) throw new apiError(500, "Comment delete failed");

  res.json(new apiResponse(200, {}, "Comment Deleted successfully"));
});

export {
  getVideoComments,
  getTweetComments,
  addComment,
  updateComment,
  deleteComment,
};
