import ApiError from "../utils/apiError.js";

const unavailableRoute = (req, res) => {
  res
    .status(404)
    .json(
      new ApiError(404, "Route not found", [
        "Route not found",
        `${req.originalUrl} not found`,
      ])
    );
};

export default unavailableRoute;
