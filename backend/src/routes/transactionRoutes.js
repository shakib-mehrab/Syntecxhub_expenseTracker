import { Router } from "express";
import {
  createTransaction,
  deleteTransaction,
  exportTransactions,
  getTransactions,
} from "../controllers/transactionController.js";
import { auth } from "../middleware/auth.js";

const router = Router();

router.use(auth);
router.get("/", getTransactions);
router.get("/export", exportTransactions);
router.post("/", createTransaction);
router.delete("/:id", deleteTransaction);

export default router;
