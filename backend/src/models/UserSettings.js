import mongoose from "mongoose";

const userSettingsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    currency: {
      type: String,
      trim: true,
      uppercase: true,
      default: "BDT",
    },
    dateLocale: {
      type: String,
      trim: true,
      default: "en-BD",
    },
    compactMode: {
      type: Boolean,
      default: true,
    },
    startOfWeek: {
      type: String,
      enum: ["sunday", "monday", "saturday"],
      default: "monday",
    },
    dashboard: {
      showCharts: {
        type: Boolean,
        default: true,
      },
      showRecentTransactions: {
        type: Boolean,
        default: true,
      },
      defaultRange: {
        type: String,
        enum: ["7d", "30d", "90d", "1y", "all"],
        default: "30d",
      },
    },
    exports: {
      fileType: {
        type: String,
        enum: ["xlsx", "csv"],
        default: "xlsx",
      },
      includeNotes: {
        type: Boolean,
        default: true,
      },
    },
  },
  { timestamps: true }
);

export const UserSettings = mongoose.model("UserSettings", userSettingsSchema);