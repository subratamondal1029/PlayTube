import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Subscription } from "../models/subscription.model.js";
import ApiResponse from "../utils/apiResponse.js";

const subscribeChannel = asyncHandler(async (req, res) => {
  const channelId = String(req.params.channelId);

  if (!channelId) throw new ApiError(400, "channel id is required");

  const isSubscribed = await Subscription.findOne({
    channel: channelId,
    subscriber: req.user?._id,
  });

  if (isSubscribed) {
    throw new ApiError(409, "Already subscribed");
  }

  const subscription = await Subscription.create({
    channel: channelId,
    subscriber: req.user?._id,
  });

  res.status(201).json(
    new ApiResponse(
      201,
      {
        channel: subscription.channel,
        subscriber: subscription.subscriber,
      },
      "Subscribed successfully"
    )
  );
});

const unsubscribeChannel = asyncHandler(async (req, res) => {
  const channelId = String(req.params.channelId);

  if (!channelId) throw new ApiError(400, "channel id is required");

  const unsubscribed = await Subscription.findOneAndDelete({
    channel: channelId,
    subscriber: req.user._id,
  });

  if (!unsubscribed) throw new ApiError(404, "Subscription not found");

  res.json(new ApiResponse(200, {}, "unsubscribed successfully!"));
});

export { subscribeChannel, unsubscribeChannel };
