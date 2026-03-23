import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

/* CORS */
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
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
  res.status(200).json({
    success: true,
    message: "Alumni Backend API Running 🚀",
  });
});

/* Routes (to be added later) */
// app.use("/api/v1/auth", authRoutes);
// app.use("/api/v1/alumni", alumniRoutes);
// app.use("/api/v1/blog", blogRoutes);
// app.use("/api/v1/referral", referralRoutes);

/* Global Error Handler */
app.use((err, req, res, next) => {
  console.error(err.message);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

/* 404 Handler */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

export default app;