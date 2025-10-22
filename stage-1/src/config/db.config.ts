import mongoose = require("mongoose");

export const connectDB = async (): Promise<void> => {
  try {

    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("MongoDB connected successfully");
  } catch (error: any){
    console.log("MongoDB connection failed", error);
    process.exit(1);
  }
};