import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/users.routes.js";
import channelRouter from "./routes/channel.routes.js";
import tweetRouter from "./routes/tweet.routes.js";
import healthcheckRouter from "./routes/healthCheck.routes.js";
import commentRouter from "./routes/comment.routes.js";
import likeRouter from "./routes/like.routes.js";
import playlistRouter from "./routes/playlist.routes.js";
import videoRouter from "./routes/video.routes.js";

const app = express();

app.use(cors({ origin: process.env.ORIGIN, credentials: true }));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes
app.use("/api/v1", healthcheckRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/c", channelRouter);
app.use("/api/v1/tweet", tweetRouter);
app.use("/api/v1/comment", commentRouter);
app.use("/api/v1/like", likeRouter);
app.use("/api/v1/playlist", playlistRouter);
app.use("/api/v1/v", videoRouter);

export { app };
