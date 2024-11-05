import apiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Subscription } from "../models/subscription.model.js";
import apiResponse from "../utils/apiResponse.js";

const subscribeChannel = asyncHandler(async (req, res) => {
  const channelId = String(req.params.channelId);

  if (!channelId) throw new apiError(400, "channel id is required");

  const isSubscribed = await Subscription.findOne({
    channel: channelId,
    subscriber: req.user?._id,
  });

  if (isSubscribed) {
    throw new apiError(409, "Already subscribed");
  }

  const subscription = await Subscription.create({
    channel: channelId,
    subscriber: req.user?._id,
  });

  res.status(201).json(
    new apiResponse(
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

  if (!channelId) throw new apiError(400, "channel id is required");

  const unsubscribed = await Subscription.findOneAndDelete({
    channel: channelId,
    subscriber: req.user._id,
  });

  if (!unsubscribed) throw new apiError(404, "Subscription not found");

  res.json(new apiResponse(200, {}, "unsubscribed successfully!"));
});

export { subscribeChannel, unsubscribeChannel };
