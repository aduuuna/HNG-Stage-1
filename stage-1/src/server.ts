import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app";
import { connectDB } from "./config/db.config";


dotenv.config();

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

    process.on('SIGINT', async () => {
      console.log('Shutting down server...');
      await mongoose.connection.close();
      process.exit(0);
    });
  } catch (error: any) {
    console.error("Server startup failed: ", error);
    process.exit(1);
  }
}


startServer()

