import asyncHandler from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";
import apiError from "../utils/apiError.js";
import { Tweet } from "../models/tweet.model.js";
import { Types, isValidObjectId } from "mongoose";

const createTweet = asyncHandler(async (req, res) => {
  // TODO: create tweet
  const { content } = req.body;

  if (!content) throw new apiError(400, "content is required");

  const tweet = await Tweet.create({
    content,
    owner: req.user._id,
  });

  if (!tweet) throw new apiError(500, "Error while creating tweet");

  res
    .status(201)
    .json(new apiResponse(201, tweet, "Tweet created successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get user tweets
  const { userId } = req.params;

  if (!userId || !isValidObjectId(userId))
    throw new apiError(400, "user id is invalid");

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

  if (!tweet) throw new apiError(404, "Tweet Not found");

  res.json(new apiResponse(200, tweet[0], "Tweet Fetched successfully"));
});

const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update tweet
  const { tweetId } = req.params;
  const { content } = req.body;

  if (!tweetId || !content) throw new apiError(400, "All Fields Are required");

  const tweet = await Tweet.findById(tweetId);
  if (!tweet) throw new apiError(404, "Tweet Not Found");
  if (tweet.owner.toString() !== req.user._id.toString())
    throw new apiError(403, "Unauthorized");

  tweet.content = content;
  tweet.save({ validateBeforeSave: false });

  console.log(tweet);

  res.json(new apiResponse(200, tweet, "tweet Updated Successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  //TODO: delete tweet
  const { tweetId } = req.params;

  if (!tweetId) throw new apiError(400, "tweet id is required");
  const isValidId = isValidObjectId(tweetId);

  if (!isValidId) throw new apiError(400, "Invalid tweet id");

  const tweet = await Tweet.findById(tweetId);

  if (!tweet) throw new apiError(404, "Tweet Not found");
  if (tweet.owner.toString() !== req.user._id.toString())
    throw new apiError(403, "Unauthorized");

  await Tweet.deleteOne({ _id: tweetId });

  res.json(new apiResponse(200, {}, "Tweet deleted successfully"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
