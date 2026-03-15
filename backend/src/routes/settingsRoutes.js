import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { getSettings, updateProfile, updateSettings } from "../controllers/settingsController.js";

const router = Router();

router.use(auth);
router.get("/", getSettings);
router.patch("/", updateSettings);
router.patch("/profile", updateProfile);

export default router;