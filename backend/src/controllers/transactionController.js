import XLSX from "xlsx";
import { Transaction } from "../models/Transaction.js";

export const getTransactions = async (req, res) => {
  try {
    const { type } = req.query;
    const query = { user: req.user.id };

    if (type === "income" || type === "expense") {
      query.type = type;
    }

    const transactions = await Transaction.find(query).sort({ date: -1, createdAt: -1 });
    return res.status(200).json(transactions);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch transactions.", error: error.message });
  }
};

export const createTransaction = async (req, res) => {
  try {
    const { type, title, category, amount, date, note } = req.body;

    if (!type || !title || !category || !amount || !date) {
      return res.status(400).json({ message: "Required fields are missing." });
    }

    if (!["income", "expense"].includes(type)) {
      return res.status(400).json({ message: "Invalid transaction type." });
    }

    const parsedAmount = Number(amount);
    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than zero." });
    }

    const transaction = await Transaction.create({
      user: req.user.id,
      type,
      title,
      category,
      amount: parsedAmount,
      date,
      note: note || "",
    });

    return res.status(201).json(transaction);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create transaction.", error: error.message });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findOneAndDelete({ _id: id, user: req.user.id });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found." });
    }

    return res.status(200).json({ message: "Transaction deleted." });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete transaction.", error: error.message });
  }
};

export const exportTransactions = async (req, res) => {
  try {
    const { type } = req.query;
    const query = { user: req.user.id };

    if (type === "income" || type === "expense") {
      query.type = type;
    }

    const rows = await Transaction.find(query).sort({ date: -1, createdAt: -1 });

    const sheetData = rows.map((item) => ({
      Type: item.type,
      Title: item.title,
      Category: item.category,
      Amount: item.amount,
      Date: item.date.toISOString().split("T")[0],
      Note: item.note,
    }));

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(sheetData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

    const fileBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

    const fileName = type ? `${type}-report.xlsx` : "all-transactions-report.xlsx";
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

    return res.send(fileBuffer);
  } catch (error) {
    return res.status(500).json({ message: "Failed to export transactions.", error: error.message });
  }
};
