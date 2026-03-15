import bcrypt from "bcryptjs";
import { Category } from "../models/Category.js";
import { User } from "../models/User.js";
import { UserSettings } from "../models/UserSettings.js";
import { DEFAULT_CATEGORIES, DEFAULT_SETTINGS } from "../utils/defaults.js";
import { signToken } from "../utils/token.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    await UserSettings.create({
      user: user._id,
      ...DEFAULT_SETTINGS,
    });

    const categoryRows = [
      ...DEFAULT_CATEGORIES.income.map((categoryName) => ({
        user: user._id,
        type: "income",
        name: categoryName,
        isSystem: true,
      })),
      ...DEFAULT_CATEGORIES.expense.map((categoryName) => ({
        user: user._id,
        type: "expense",
        name: categoryName,
        isSystem: true,
      })),
    ];

    await Category.insertMany(categoryRows, { ordered: false });

    const token = signToken({ id: user._id.toString() });

    return res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Signup failed.", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = signToken({ id: user._id.toString() });

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Login failed.", error: error.message });
  }
};
