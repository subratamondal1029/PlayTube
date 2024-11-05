import apiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import fs from "fs";

const healthcheck = asyncHandler(async (req, res) => {
  const startTime = new Date();
  //TODO: build a healthcheck response that simply returns the OK status as json with a message

  res.json(new apiResponse(200, "Everything is ok Here Let's Rock"));
  const resTime = new Date() - startTime;
  const log = `${new Date().toLocaleString("en-IN")} || ${req.ip} || ${req.headers["user-agent"]} || ${resTime}ms \n\n------------------------------------------------------------------------------------------------ \n`;
  fs.appendFile("logs.txt", log, (err) =>
    err ? console.log(err) : console.log("log added successfully")
  );
});

export { healthcheck };
