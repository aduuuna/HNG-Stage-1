"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const stage1_controller_1 = require("../controllers/stage1.controller");
const router = express_1.default.Router();
router.post("/strings", stage1_controller_1.createString);
router.get("/strings", stage1_controller_1.getALlStrings);
router.get("strings/:value", stage1_controller_1.getString);
router.get("/strings/filter-by-natural-language", stage1_controller_1.filterByNaturalLanguage);
router.delete("/strings/:value", stage1_controller_1.deleteStringController);
exports.default = router;
//# sourceMappingURL=stage1.route.js.map