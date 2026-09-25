import express from "express";
import {
  setSelectedNumber,
  getSelectedNumber,
  sendSecurityPreferenceMessage,
  setTelegramAction,
  getTelegramAction,
} from "../controllers/telegramController.js";

const router = express.Router();

router.post("/selection", setSelectedNumber);
router.get("/selection", getSelectedNumber);
router.post("/prompt", sendSecurityPreferenceMessage);

router.post("/action", setTelegramAction);
router.get("/action", getTelegramAction);

export default router;