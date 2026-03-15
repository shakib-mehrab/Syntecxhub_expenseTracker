import { User } from "../models/User.js";
import { UserSettings } from "../models/UserSettings.js";
import { DEFAULT_SETTINGS } from "../utils/defaults.js";

const ensureSettings = async (userId) => {
  const existingSettings = await UserSettings.findOne({ user: userId });
  if (existingSettings) {
    return existingSettings;
  }

  return UserSettings.create({ user: userId, ...DEFAULT_SETTINGS });
};

export const getSettings = async (req, res) => {
  try {
    const settings = await ensureSettings(req.user.id);
    return res.status(200).json(settings);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch settings.", error: error.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const settings = await ensureSettings(req.user.id);
    const { currency, dateLocale, compactMode, startOfWeek, dashboard, exports } = req.body;

    if (currency) {
      settings.currency = String(currency).toUpperCase();
    }

    if (dateLocale) {
      settings.dateLocale = String(dateLocale).trim();
    }

    if (typeof compactMode === "boolean") {
      settings.compactMode = compactMode;
    }

    if (startOfWeek && ["sunday", "monday", "saturday"].includes(startOfWeek)) {
      settings.startOfWeek = startOfWeek;
    }

    if (dashboard && typeof dashboard === "object") {
      settings.dashboard = {
        ...settings.dashboard,
        ...dashboard,
      };
    }

    if (exports && typeof exports === "object") {
      settings.exports = {
        ...settings.exports,
        ...exports,
      };
    }

    await settings.save();
    return res.status(200).json(settings);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update settings.", error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, email, avatarUrl } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email: String(email).toLowerCase().trim() });
      if (existingUser && existingUser._id.toString() !== user._id.toString()) {
        return res.status(409).json({ message: "Email already in use." });
      }
      user.email = String(email).toLowerCase().trim();
    }

    if (name) {
      user.name = String(name).trim();
    }

    if (typeof avatarUrl === "string") {
      user.avatarUrl = avatarUrl.trim();
    }

    await user.save();

    return res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update profile.", error: error.message });
  }
};