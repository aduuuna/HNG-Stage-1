import express from "express";
import { 
  createString,
  getALlStrings,
  getString,
  deleteStringController,
  filterByNaturalLanguage
} from "../controllers/stage1.controller";

const router = express.Router();

router.post("/", createString);
router.get("/filter-by-natural-language", filterByNaturalLanguage);
router.get("/", getALlStrings)  
router.get("/:value", getString); 
router.delete("/:value", deleteStringController);

export default router;