import { Router } from "express";
import { createCategory, deleteCategory, getCategories } from "../controllers/categoryController.js";
import { auth } from "../middleware/auth.js";

const router = Router();

router.use(auth);
router.get("/", getCategories);
router.post("/", createCategory);
router.delete("/:id", deleteCategory);

export default router;