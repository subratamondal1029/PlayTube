import fs from "fs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import {
  uploadFileOnCloudinary,
  deleteCloudinaryFile,
} from "../utils/cloudinary.js";

const generateAccessAndRefreshTokens = async (userId) => {
  const user = await User.findById(userId);
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};
const options = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
};

const calculateExpiryTime = (days) => {
  days = Number(days.split("d")[0]);
  const now = Math.floor(new Date() / 1000);
  return now + days * 24 * 60 * 60;
};

const registerUser = asyncHandler(async (req, res) => {
  // get user details
  const { fullName, username, email, password } = req.body;

  // data validation
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All Fields Are Required");
  }

  // check existing data conflict
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with same Email or Username already exist!");
  }

  // handle file upload and validation
  const uploadedFiles = req.files;

  if (
    !uploadedFiles ||
    !uploadedFiles.avatar ||
    uploadedFiles.avatar.length === 0
  ) {
    throw new ApiError(400, "Avatar is Required");
  }

  const avatarLocalPath = uploadedFiles.avatar[0].path;
  let coverImageLocalPath;
  if (uploadedFiles.coverImage && uploadedFiles.coverImage.length > 0) {
    coverImageLocalPath = uploadedFiles.coverImage[0].path;
  }

  // cloudinary file upload
  const avatar = await uploadFileOnCloudinary(avatarLocalPath);
  let coverImage;

  if (!avatar) {
    fs.unlinkSync(coverImageLocalPath);
    throw new ApiError(400, "Avatar is Required");
  } else {
    coverImage = await uploadFileOnCloudinary(coverImageLocalPath);
  }

  // new user Creation
  const user = await User.create({
    fullName,
    email,
    username: username.toLowerCase(),
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });

  return res
    .status(201)
    .json(new ApiResponse(201, "User Register Successfully", user));
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username && !email) {
    throw new ApiError(400, "username or email is required");
  }

  if (!password) throw new ApiError(400, "Password is Required");

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user)
    throw new ApiError(404, "User with your email or username is not exist");

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) throw new ApiError(401, "wrong login credentials");

  // create accessToken and refreshToken
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const responseUser = await User.findById(user._id);

  const accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY;
  const refreshAccessTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY;

  return res
    .cookie("accessToken", accessToken, {
      ...options,
      maxAge: calculateExpiryTime(accessTokenExpiry),
    })
    .cookie("refreshToken", refreshToken, {
      ...options,
      maxAge: calculateExpiryTime(refreshAccessTokenExpiry),
    })
    .json(
      new ApiResponse(200, "Logged In successFully", {
        user: responseUser,
        accessToken,
        refreshToken,
      })
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: { refreshToken: 1 },
    },
    {
      new: true,
    }
  );

  res
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, "User logout successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const clientRefreshToken =
    req.cookies?.refreshToken || req.body?.refreshToken;

  if (!clientRefreshToken) throw new ApiError(401, "Unauthorized request");

  const decodedRefreshToken = jwt.verify(
    clientRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  const user = await User.findById(decodedRefreshToken?._id);

  if (!user || user?.refreshToken !== clientRefreshToken)
    throw new ApiError(401, "Invalid Refresh Token");

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );
  const accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY;
  const refreshAccessTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY;
  return res
    .status(201)
    .cookie("accessToken", accessToken, {
      ...options,
      maxAge: calculateExpiryTime(accessTokenExpiry),
    })
    .cookie("refreshToken", refreshToken, {
      ...options,
      maxAge: calculateExpiryTime(refreshAccessTokenExpiry),
    })
    .send(
      new ApiResponse(
        200,
        { accessToken, refreshToken },
        "New AccessToken Created Successfully"
      )
    );
});

const getCurrentUser = asyncHandler(async (req, res) =>
  res.send(new ApiResponse(200, "Success", req.user))
);

const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) throw new ApiError(404, "User not found");

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect)
    throw new ApiError(400, "Old Password is not correct");

  user.password = newPassword;
  user.save({ validateBeforeSave: false });
  return res.send(new ApiResponse(200, "Password changed successfully"));
});

const updateUserDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;

  if (!fullName?.trim() && !email?.trim())
    throw new ApiError(400, "fullName or email is required");

  const isEmailExist = await User.findOne({ email });

  if (isEmailExist && String(isEmailExist._id) !== String(req.user._id))
    throw new ApiError(409, "Email already exist");

  const updatedFields = {
    fullName: fullName?.trim() || req.user.fullName,
    email: email?.trim() || req.user.email,
  };

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: updatedFields,
    },
    { new: true }
  );

  res.send(new ApiResponse(200, "User details updated successfully", user));
});

const updatedUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) throw new ApiError(400, "Avatar is required");

  const cloudinaryRes = await uploadFileOnCloudinary(avatarLocalPath);

  if (!cloudinaryRes?.url)
    throw new ApiError(500, "Error while uploading avatar");

  await deleteCloudinaryFile(req.user.avatar); //NOTE: assignment from tutorial
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { avatar: cloudinaryRes.url },
    },
    { new: true }
  );

  const { password, refreshToken, ...userDetails } = user.toObject();

  res.send(
    new ApiResponse(200, userDetails, "User avatar updated successfully")
  );
});

const updatedUserCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;

  if (!coverImageLocalPath) throw new ApiError(400, "Cover Image is required");

  const coverImage = await uploadFileOnCloudinary(coverImageLocalPath);
  if (!coverImage?.url)
    throw new ApiError(500, "Error while uploading Cover Image");

  await deleteCloudinaryFile(req.user.coverImage); //NOTE: assignment from tutorial
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { coverImage: coverImage.url } },
    { new: true }
  );

  res.send(new ApiResponse(200, "User Cover Image updated successfully", user));
});

const channelProfileDetails = asyncHandler(async (req, res) => {
  const { username } = req.params;

  if (!username?.trim()) throw new ApiError(400, "username is required");

  const channelDetails = await User.aggregate([
    {
      $match: { username: username?.toLowerCase() },
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
        subscribersCount: {
          $size: "$subscribers",
        },
        subscribedCount: {
          $size: "$subscribed",
        },
        isSubscribed: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullName: 1,
        username: 1,
        subscribersCount: 1,
        subscribedCount: 1,
        isSubscribed: 1,
        avatar: 1,
        coverImage: 1,
        email: 1,
        createdAt: 1,
      },
    },
  ]);

  if (!channelDetails?.length)
    throw new ApiError(404, "Channel Does Not Exist");

  return res.json(
    new ApiResponse(
      200,
      "Channel Details Fetched successfully!",
      channelDetails[0]
    )
  );
});

const userWatchHistory = asyncHandler(async (req, res) => {
  const user = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        pipeline: [
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
            $addFields: {
              owner: {
                $first: "$owner",
              },
            },
          },
        ],
      },
    },
  ]);

  // NOTE: only for testing
  console.log("userWatchHistory:", user[0].watchHistory);

  return res.json(
    new ApiResponse(
      200,
      "Watch History fetched successfully",
      user[0].watchHistory
    )
  );
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changePassword,
  getCurrentUser,
  updateUserDetails,
  updatedUserAvatar,
  updatedUserCoverImage,
  channelProfileDetails,
  userWatchHistory,
};
