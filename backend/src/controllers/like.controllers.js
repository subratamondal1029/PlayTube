import asyncHandler from "../utils/asyncHandler.js";
import { isValidObjectId, Types } from "mongoose";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";
import { Tweet } from "../models/tweet.model.js";
import { Like } from "../models/like.model.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: toggle like on video
  if (!videoId || !isValidObjectId(videoId))
    throw new apiError(400, "Invalid Video Id");

  const video = await Video.findById(videoId);
  if (!video) throw new apiError(404, "Video not found");

  const isLiked = await Like.findOne({
    video: videoId,
    likedBy: req.user._id,
  });

  try {
    if (isLiked) {
      await Like.findByIdAndDelete(isLiked._id);
      res.json(new apiResponse(200, {}, "Like removed successfully"));
    } else {
      await Like.create({
        video: videoId,
        likedBy: req.user._id,
      });
      res.json(
        new apiResponse(
          200,
          { userId: req.user._id },
          "Like added successfully"
        )
      );
    }
  } catch (error) {
    throw new apiError(500, "Error while toggle Like");
  }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  //TODO: toggle like on comment
  if (!commentId || !isValidObjectId(commentId))
    throw new apiError(400, "Invalid Video Id");

  const comment = await Comment.findById(commentId);
  if (!comment) throw new apiError(404, "comment not found");

  const isLiked = await Like.findOne({
    comment: commentId,
    likedBy: req.user._id,
  });

  try {
    if (isLiked) {
      await Like.findByIdAndDelete(isLiked._id);
      res.json(new apiResponse(200, {}, "Like removed successfully"));
    } else {
      await Like.create({
        comment: commentId,
        likedBy: req.user._id,
      });
      res.json(
        new apiResponse(
          200,
          { userId: req.user._id },
          "Like added successfully"
        )
      );
    }
  } catch (error) {
    throw new apiError(500, "Error while toggle Like");
  }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  //TODO: toggle like on tweet
  if (!tweetId || !isValidObjectId(tweetId))
    throw new apiError(400, "Invalid Video Id");

  const tweet = await Tweet.findById(tweetId);
  if (!tweet) throw new apiError(404, "tweet not found");

  const isLiked = await Like.findOne({
    tweet: tweetId,
    likedBy: req.user._id,
  });

  try {
    if (isLiked) {
      await Like.findByIdAndDelete(isLiked._id);
      res.json(new apiResponse(200, {}, "Like removed successfully"));
    } else {
      await Like.create({
        tweet: tweetId,
        likedBy: req.user._id,
      });
      res.json(
        new apiResponse(
          200,
          { userId: req.user._id },
          "Like added successfully"
        )
      );
    }
  } catch (error) {
    throw new apiError(500, "Error while toggle Like");
  }
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos

  const likedVideos = await Like.aggregate([
    {
      $match: {
        likedBy: new Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "video",
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
        video: {
          $first: "$video",
        },
      },
    },
    {
      $project: {
        likedBy: 0,
      },
    },
  ]);

  // TODO: check for multiple videos

  res.json(
    new apiResponse(200, likedVideos, "Liked videos fetched successfully")
  );
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
