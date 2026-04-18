import fs from "fs";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const resumeDir = path.join(__dirname, "..", "..", "public", "uploads", "resumes");
const photoDir = path.join(__dirname, "..", "..", "public", "uploads", "photos");

fs.mkdirSync(resumeDir, { recursive: true });
fs.mkdirSync(photoDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, resumeDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || ".pdf";
    const safe = `${String(req.user.id)}_${Date.now()}${ext.replace(/[^a-zA-Z0-9.]/g, "")}`;
    cb(null, safe);
  },
});

const allowedMime = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

export const resumeUpload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (allowedMime.has(file.mimetype)) {
      cb(null, true);
      return;
    }
    cb(new Error("Only PDF or Word documents are allowed"));
  },
});

const photoStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, photoDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || ".jpg";
    const safe = `${String(req.user.id)}_${Date.now()}${ext.replace(/[^a-zA-Z0-9.]/g, "")}`;
    cb(null, safe);
  },
});

const allowedImageMime = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export const profilePhotoUpload = multer({
  storage: photoStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (allowedImageMime.has(file.mimetype)) {
      cb(null, true);
      return;
    }
    cb(new Error("Only JPEG, PNG, or WebP images are allowed"));
  },
});
