export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

export const STORAGE_KEYS = {
  token: 'expense-tracker-token',
  user: 'expense-tracker-user',
  demoTransactions: 'expense-tracker-demo-transactions',
  appSettings: 'expense-tracker-app-settings',
}

export const DEMO_MODE = import.meta.env.VITE_DEMO_MODE !== 'false'

export const defaultTransactionCategories = {
  income: ['Salary', 'Freelance', 'Investments', 'Business', 'Rental', 'Bonus', 'Other'],
  expense: ['Food', 'Transport', 'Housing', 'Utilities', 'Health', 'Shopping', 'Entertainment', 'Education', 'Other'],
}

export const defaultAppSettings = {
  currency: 'BDT',
  dateLocale: 'en-BD',
  categories: defaultTransactionCategories,
}

export const navigationItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Income', path: '/income' },
  { label: 'Expenses', path: '/expenses' },
  { label: 'Settings', path: '/settings' },
]