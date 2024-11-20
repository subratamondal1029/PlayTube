import { Types } from "mongoose";
import { User } from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";

const getChannelStats = asyncHandler(async (req, res) => {
  // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
  const { userId = req.user._id } = req.query;

  const allStats = await User.aggregate([
    {
      $match: {
        _id: new Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "_id",
        foreignField: "owner",
        as: "videos",
      },
    },
    {
      $lookup: {
        from: "likes",
        let: { videoIds: "$videos._id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $in: ["$video", "$$videoIds"],
              },
            },
          },
        ],
        as: "totalLikes",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribed",
      },
    },
    {
      $addFields: {
        totalVideos: {
          $size: "$videos",
        },
        totalSubscribers: {
          $size: "$subscribers",
        },
        totalSubscribed: {
          $size: "$subscribed",
        },
        totalViews: {
          $reduce: {
            input: "$videos",
            initialValue: 0,
            in: { $add: ["$$value", "$$this.views"] },
          },
        },
        totalLikes: {
          $size: "$totalLikes",
        },
      },
    },
    {
      $project: {
        _id: 1,
        username: 1,
        fullName: 1,
        email: 1,
        totalSubscribers: 1,
        totalSubscribed: 1,
        createdAt: 1,
        totalVideos: 1,
        totalViews: 1,
        totalLikes: 1,
      },
    },
  ]);

  if (!allStats || allStats.length === 0)
    throw new ApiError(404, "Channel stats not found");

  res.json(
    new ApiResponse(200, allStats[0], "Channel stats fetched successfully")
  );
});

export { getChannelStats };
