import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import ApiResponse from "./utils/ApiResponse.js";
import ApiError from "./utils/ApiError.js";

import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/users/user.routes.js";
import profileRoutes from "./modules/profiles/profile.routes.js";
import postRoutes from "./modules/posts/post.routes.js";
import referralRoutes from "./modules/referrals/referral.routes.js";
import directoryRoutes from "./modules/directory/directory.routes.js";
import notificationRoutes from "./modules/notifications/notification.routes.js";
import hofRoutes from "./modules/hallOfFame/hof.routes.js";
const app = express();
app.disable("x-powered-by");
/* CORS */
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || origin === env.corsOrigin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

/* Body Parsers */
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));

/* Static Files */
app.use(express.static("public"));

/* Cookies */
app.use(cookieParser());

/* Health Check */
app.get("/", (req, res) => {
  res
  .status(200)
  .json(new ApiResponse(200, null, "Alumni Backend API Running"));
});

/* Routes */
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/referrals", referralRoutes);
app.use("/api/directory", directoryRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/hall-of-fame", hofRoutes);

/* 404 Handler */
app.use((req, res, next) => {
  next(new ApiError(404, "Route Not Found"));
});

/* Global Error Handler */
app.use(errorHandler);
export default app;