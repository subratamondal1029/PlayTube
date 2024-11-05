import fs from "fs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
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
  secure: true,
};

const registerUser = asyncHandler(async (req, res) => {
  // get user details
  const { fullName, username, email, password } = req.body;

  // data validation
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new apiError(400, "All Fields Are Required");
  }

  // check existing data conflict
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new apiError(409, "User with same Email or Username already exist!");
  }

  // handle file upload and validation
  const uploadedFiles = req.files;

  if (
    !uploadedFiles ||
    !uploadedFiles.avatar ||
    uploadedFiles.avatar.length === 0
  ) {
    throw new apiError(400, "Avatar is Required");
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
    throw new apiError(400, "Avatar is Required");
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

  // Check is the created and make a response data
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new apiError(500, "Internal Server Error while user Creation");
  }

  return res
    .status(201)
    .json(new apiResponse(201, createdUser, "User Register Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username && !email) {
    throw new apiError(400, "username or email is required");
  }

  if (!password) throw new apiError(400, "Password is Required");

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user)
    throw new apiError(404, "User with your email or username is not exist");

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) throw new apiError(401, "wrong login credentials");

  // create accessToken and refreshToken
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const resposeUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new apiResponse(
        200,
        { user: resposeUser, accessToken, refreshToken },
        "Logged In successFully"
      )
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
    .json(new apiResponse(200, null, "User logout successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const clientRefreshToken =
    req.cookies?.refreshToken || req.body?.refreshToken;

  if (!clientRefreshToken) throw new apiError(401, "Unauthorized request");

  const decodedRefreshToken = jwt.verify(
    clientRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  const user = await User.findById(decodedRefreshToken?._id);
  if (!user || user?.refreshToken !== clientRefreshToken)
    throw new apiError(401, "Invalid Refresh Token");

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .send(
      new apiResponse(
        200,
        { accessToken, refreshToken },
        "New AccessToken Created Successfully"
      )
    );
});

const getCurrentUser = asyncHandler(async (req, res) =>
  res.send(new apiResponse(200, req.user, "current user fetched successfully"))
);

const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) throw new apiError(404, "User not found");

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect)
    throw new apiError(400, "Old Password is not correct");

  user.password = newPassword;
  user.save({ validateBeforeSave: false });
  return res.send(new apiResponse(200, {}, "Password changed successfully"));
});

const updateUserDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;

  if (!fullName?.trim() && !email?.trim())
    throw new apiError(400, "fullName or email is required");

  const isEmailExist = await User.findOne({ email });

  if (isEmailExist && String(isEmailExist._id) !== String(req.user._id))
    throw new apiError(409, "Email already exist");

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

  const { password, refreshToken, ...userDetails } = user.toObject();

  res.send(
    new apiResponse(200, userDetails, "User details updated successfully")
  );
});

const updatedUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) throw new apiError(400, "Avatar is required");

  const cloudinaryRes = await uploadFileOnCloudinary(avatarLocalPath);

  if (!cloudinaryRes?.url)
    throw new apiError(500, "Error while uploading avatar");

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
    new apiResponse(200, userDetails, "User avatar updated successfully")
  );
});

const updatedUserCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;

  if (!coverImageLocalPath) throw new apiError(400, "Cover Image is required");

  const coverImage = await uploadFileOnCloudinary(coverImageLocalPath);
  if (!coverImage?.url)
    throw new apiError(500, "Error while uploading Cover Image");

  await deleteCloudinaryFile(req.user.coverImage); //NOTE: assignment from tutorial
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { coverImage: coverImage.url } },
    { new: true }
  );

  const { password, refreshToken, ...userDetails } = user.toObject();

  res.send(
    new apiResponse(200, userDetails, "User Cover Image updated successfully")
  );
});

const channelProfileDetails = asyncHandler(async (req, res) => {
  const { username } = req.params;

  if (!username?.trim()) throw new apiError(400, "username is required");

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
    throw new apiError(404, "Channel Does Not Exist");

  return res.json(
    new apiResponse(
      200,
      channelDetails[0],
      "Channel Details Fetched successfully!"
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
    new apiResponse(
      200,
      user[0].watchHistory,
      "Watch History fetched successfully"
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
