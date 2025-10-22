"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const db_config_1 = require("./config/db.config");
dotenv_1.default.config();
const PORT = process.env.PORT || 5000;
async function startServer() {
    try {
        await (0, db_config_1.connectDB)();
        app_1.default.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
        process.on('SIGINT', async () => {
            console.log('Shutting down server...');
            await mongoose_1.default.connection.close();
            process.exit(0);
        });
    }
    catch (error) {
        console.error("Server startup failed: ", error);
        process.exit(1);
    }
}
startServer();
//# sourceMappingURL=server.js.map