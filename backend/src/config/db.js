import mongoose from "mongoose";
import { env } from "./env.js";

const connectDB = async () => {
  if (!env.mongoUri) {
    throw new Error("MONGO_URI is missing in environment variables");
  }

  const connection = await mongoose.connect(env.mongoUri);
  console.log(`MongoDB Connected: ${connection.connection.host}`);
};

export default connectDB;
