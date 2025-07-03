import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/users.routes.js";
import channelRouter from "./routes/channel.routes.js";
import tweetRouter from "./routes/tweet.routes.js";
import commentRouter from "./routes/comment.routes.js";
import likeRouter from "./routes/like.routes.js";
import playlistRouter from "./routes/playlist.routes.js";
import videoRouter from "./routes/video.routes.js";
import { healthcheck } from "./controllers/healthCheck.controllers.js";
import unavailableRoute from "./middlewares/unavailableRoute.middleware.js";
import swaggerUi from "swagger-ui-express";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const app = express();

app.use(cors({ origin: process.env.ORIGIN, credentials: true }));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes
app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(require("../public/swagger.json"))
);
app.get("/api/v1/health", healthcheck);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/c", channelRouter);
app.use("/api/v1/tweet", tweetRouter);
app.use("/api/v1/comment", commentRouter);
app.use("/api/v1/like", likeRouter);
app.use("/api/v1/playlist", playlistRouter);
app.use("/api/v1/v", videoRouter);

app.use(unavailableRoute);

export default app;
