import mongoose from "mongoose";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import fs from "fs";

const healthcheck = asyncHandler(async (req, res) => {
  const db = await (await mongoose.connection.db.stats()).db;

  //  TODO: add average response time calculation with log file

  const data = {
    uptime: process.uptime(),
    db,
    environment: process.env.NODE_ENV,
    timeStamp: new Date(),
  };

  res.json(new ApiResponse(200, "Success", data));
});

export { healthcheck };
