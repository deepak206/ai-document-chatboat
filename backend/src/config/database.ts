import mongoose from "mongoose";
import { MONGODB_URI } from "./env";

export async function connectDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
}