import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import { Tweet } from "../models/tweet.model.js";
import { Types, isValidObjectId } from "mongoose";

const createTweet = asyncHandler(async (req, res) => {
  // TODO: create tweet
  const { content } = req.body;

  if (!content) throw new ApiError(400, "content is required");

  const tweet = await Tweet.create({
    content,
    owner: req.user._id,
  });

  if (!tweet) throw new ApiError(500, "Error while creating tweet");

  res
    .status(201)
    .json(new ApiResponse(201, "Tweet created successfully", tweet));
});

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get user tweets
  const { userId } = req.params;

  if (!userId || !isValidObjectId(userId))
    throw new ApiError(400, "user id is invalid");

  const tweet = await Tweet.aggregate([
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
        from: "likes",
        localField: "_id",
        foreignField: "tweet",
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
  ]);

  if (!tweet) throw new ApiError(404, "Tweet Not found");

  res.json(new ApiResponse(200, "Tweet fetched successfully", tweet));
});

const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update tweet
  const { tweetId } = req.params;
  const { content } = req.body;

  if (!tweetId || !content) throw new ApiError(400, "All Fields Are required");

  const tweet = await Tweet.findById(tweetId);
  if (!tweet) throw new ApiError(404, "Tweet Not Found");
  if (tweet.owner.toString() !== req.user._id.toString())
    throw new ApiError(403, "Unauthorized");

  tweet.content = content;
  tweet.save({ validateBeforeSave: false });

  res.json(new ApiResponse(200, "tweet Updated Successfully", tweet));
});

const deleteTweet = asyncHandler(async (req, res) => {
  //TODO: delete tweet
  const { tweetId } = req.params;

  if (!tweetId) throw new ApiError(400, "tweet id is required");
  const isValidId = isValidObjectId(tweetId);

  if (!isValidId) throw new ApiError(400, "Invalid tweet id");

  const tweet = await Tweet.findById(tweetId);

  if (!tweet) throw new ApiError(404, "Tweet Not found");
  if (tweet.owner.toString() !== req.user._id.toString())
    throw new ApiError(403, "Unauthorized");

  await Tweet.deleteOne({ _id: tweetId });

  res.json(new ApiResponse(200, "Tweet deleted successfully"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
