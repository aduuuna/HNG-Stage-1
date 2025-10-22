"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose = require("mongoose");
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || "";
        await mongoose.connect(mongoURI);
        console.log("MongoDB connected successfully");
    }
    catch (error) {
        console.log("MongoDB connection failed", error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
//# sourceMappingURL=db.config.js.map