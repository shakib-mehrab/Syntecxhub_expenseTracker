import { createContext, useEffect, useMemo, useState } from 'react'
import { defaultAppSettings, STORAGE_KEYS } from '../config'

const SettingsContext = createContext(null)

const normalizeCategories = (categories) => {
  const income = Array.isArray(categories?.income) && categories.income.length > 0
    ? categories.income
    : defaultAppSettings.categories.income
  const expense = Array.isArray(categories?.expense) && categories.expense.length > 0
    ? categories.expense
    : defaultAppSettings.categories.expense

  return { income, expense }
}

const loadStoredSettings = () => {
  const storedValue = localStorage.getItem(STORAGE_KEYS.appSettings)

  if (!storedValue) {
    return defaultAppSettings
  }

  try {
    const parsedValue = JSON.parse(storedValue)
    return {
      currency: parsedValue.currency || defaultAppSettings.currency,
      dateLocale: parsedValue.dateLocale || defaultAppSettings.dateLocale,
      categories: normalizeCategories(parsedValue.categories),
    }
  } catch {
    return defaultAppSettings
  }
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(loadStoredSettings)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.appSettings, JSON.stringify(settings))
  }, [settings])

  const setCurrency = (currency) => {
    setSettings((currentValue) => ({ ...currentValue, currency }))
  }

  const addCategory = (type, categoryName) => {
    const trimmedValue = categoryName.trim()
    if (!trimmedValue) {
      return
    }

    setSettings((currentValue) => {
      const currentCategories = currentValue.categories[type]
      const exists = currentCategories.some((item) => item.toLowerCase() === trimmedValue.toLowerCase())
      if (exists) {
        return currentValue
      }

      return {
        ...currentValue,
        categories: {
          ...currentValue.categories,
          [type]: [...currentCategories, trimmedValue],
        },
      }
    })
  }

  const removeCategory = (type, categoryName) => {
    setSettings((currentValue) => {
      const nextCategories = currentValue.categories[type].filter((item) => item !== categoryName)
      if (nextCategories.length === 0) {
        return currentValue
      }

      return {
        ...currentValue,
        categories: {
          ...currentValue.categories,
          [type]: nextCategories,
        },
      }
    })
  }

  const resetSettings = () => {
    setSettings(defaultAppSettings)
  }

  const currencyFormatter = useMemo(
    () => new Intl.NumberFormat(settings.dateLocale, {
      style: 'currency',
      currency: settings.currency,
      currencyDisplay: 'symbol',
      maximumFractionDigits: 0,
    }),
    [settings.currency, settings.dateLocale],
  )

  const value = useMemo(
    () => ({
      currency: settings.currency,
      dateLocale: settings.dateLocale,
      categories: settings.categories,
      currencyFormatter,
      setCurrency,
      addCategory,
      removeCategory,
      resetSettings,
    }),
    [currencyFormatter, settings],
  )

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export { SettingsContext }