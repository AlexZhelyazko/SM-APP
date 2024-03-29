import express from "express";
import {
  getRelationships,
  addRelationship,
  deleteRelationship,
  getSuggestions,
} from "../controllers/relationship.js";

const router = express.Router();

router.get("/", getRelationships);
router.get("/suggestions", getSuggestions);
router.post("/", addRelationship);
router.delete("/", deleteRelationship);

export default router;
