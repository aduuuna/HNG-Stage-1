import mongoose = require("mongoose");

export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGO_URI || ""
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected successfully");
  } catch (error: any){
    console.log("MongoDB connection failed", error);
    process.exit(1);
  }
};