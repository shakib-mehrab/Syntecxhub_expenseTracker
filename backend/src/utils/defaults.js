export const DEFAULT_SETTINGS = {
  currency: "BDT",
  dateLocale: "en-BD",
  compactMode: true,
  startOfWeek: "monday",
  dashboard: {
    showCharts: true,
    showRecentTransactions: true,
    defaultRange: "30d",
  },
  exports: {
    fileType: "xlsx",
    includeNotes: true,
  },
};

export const DEFAULT_CATEGORIES = {
  income: ["Salary", "Freelance", "Investments", "Business", "Rental", "Bonus", "Other"],
  expense: ["Food", "Transport", "Housing", "Utilities", "Health", "Shopping", "Entertainment", "Education", "Other"],
};