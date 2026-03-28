import ApiError from "../utils/ApiError.js";

export const errorHandler = (err, req, res, next) => {
  if (err?.name === "MulterError") {
    return res.status(400).json({
      success: false,
      message: err.message || "File upload error",
    });
  }
  if (err?.message && typeof err.message === "string" && err.message.includes("Only PDF or Word")) {
    return res.status(400).json({ success: false, message: err.message });
  }
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
  }

  const status = err.statusCode && Number.isInteger(err.statusCode) ? err.statusCode : 500;
  if (status !== 500) {
    return res.status(status).json({
      success: false,
      message: err.message || "Request failed",
    });
  }

  return res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};