import apiError from "./apiError.js";

// const asyncHandler = (fn) => async (req, res, next) => {
//   try {
//     await fn(req, res, next);
//   } catch (error) {
//     res
//       .status(error.code || 500)
//       .json({ success: false, message: error.message || "Internal Server Error" });
//   }
// };

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    const error = new apiError(
      err.statusCode,
      err.message || "Internal Server Error"
    );

    // NOTE: for testing purpose only
    console.log(err);

    res.status(error.statusCode || 500).json(error);
  });
};

export default asyncHandler;
