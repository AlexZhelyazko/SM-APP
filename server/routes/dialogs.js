import express from "express";
import {
  checkDialog,
  checkUser,
  createDialog,
  deleteDialog,
  getDialogs,
  getMessages,
  getUsersId,
} from "../controllers/dialog.js";

const router = express.Router();

router.post("/create", createDialog);
router.get("/check", checkDialog);
router.get("/getIds", getUsersId);
router.get("/getMessages", getMessages);
router.get("/getDialogs", getDialogs);
router.get("/checkUser", checkUser);
router.delete("/deleteDialog", deleteDialog);
export default router;
