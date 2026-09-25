import express from "express";

import { sendNotification } from "../controllers/notificationController.js";

const router = express.Router();

router.get("/notify", sendNotification);

export default router;
