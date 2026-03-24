import mongoose from "mongoose";
import { env } from "./env.js";

const connectDB = async () => {
  try {
    if (!env.mongoUri) {
      throw new Error("MONGO_URI is missing in environment variables");
    }

    const connection = await mongoose.connect(env.mongoUri, {
      dbName: "alumni-network", 
    });

    console.log(` MongoDB Connected: ${connection.connection.host}`);
  } catch (error) {
    console.error("MongoDB Connection Failed:", error.message);
    process.exit(1); 
  }
};

export default connectDB;