import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { DEMO_MODE, defaultAppSettings, defaultTransactionCategories, STORAGE_KEYS } from '../config'
import { categoriesApi, settingsApi } from '../services/api'
import { useAuth } from '../hooks/useAuth'

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

const buildCategoryState = (categoryRows) => {
  const rows = Array.isArray(categoryRows) ? categoryRows : []
  const incomeRows = rows.filter((item) => item.type === 'income' && !item.isArchived)
  const expenseRows = rows.filter((item) => item.type === 'expense' && !item.isArchived)

  const categories = {
    income: incomeRows.length > 0
      ? incomeRows.map((item) => item.name)
      : defaultTransactionCategories.income,
    expense: expenseRows.length > 0
      ? expenseRows.map((item) => item.name)
      : defaultTransactionCategories.expense,
  }

  const idMap = {
    income: Object.fromEntries(incomeRows.map((item) => [item.name.toLowerCase(), item._id])),
    expense: Object.fromEntries(expenseRows.map((item) => [item.name.toLowerCase(), item._id])),
  }

  return { categories, idMap }
}

export function SettingsProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const [settings, setSettings] = useState(loadStoredSettings)
  const [categoryIdMap, setCategoryIdMap] = useState({ income: {}, expense: {} })
  const [settingsError, setSettingsError] = useState('')
  const [isSettingsLoading, setIsSettingsLoading] = useState(false)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.appSettings, JSON.stringify(settings))
  }, [settings])

  useEffect(() => {
    if (!isAuthenticated) {
      setSettingsError('')
      setCategoryIdMap({ income: {}, expense: {} })
      return
    }

    let ignore = false

    const loadRemoteSettings = async () => {
      setIsSettingsLoading(true)
      setSettingsError('')

      try {
        const [settingsResponse, categoriesResponse] = await Promise.all([
          settingsApi.get(),
          categoriesApi.list(),
        ])

        if (ignore) {
          return
        }

        const { categories, idMap } = buildCategoryState(categoriesResponse)
        setCategoryIdMap(idMap)
        setSettings((currentValue) => ({
          ...currentValue,
          currency: settingsResponse.currency || currentValue.currency,
          dateLocale: settingsResponse.dateLocale || currentValue.dateLocale,
          categories,
        }))
      } catch (requestError) {
        if (!DEMO_MODE && !ignore) {
          setSettingsError(requestError.response?.data?.message || 'Unable to load settings from server.')
        }
      } finally {
        if (!ignore) {
          setIsSettingsLoading(false)
        }
      }
    }

    loadRemoteSettings()

    return () => {
      ignore = true
    }
  }, [isAuthenticated])

  const setCurrency = useCallback(async (currency) => {
    setSettings((currentValue) => ({ ...currentValue, currency }))

    if (!isAuthenticated) {
      return
    }

    try {
      await settingsApi.update({ currency })
      setSettingsError('')
    } catch (requestError) {
      if (!DEMO_MODE) {
        const message = requestError.response?.data?.message || 'Unable to update currency.'
        setSettingsError(message)
        throw requestError
      }
    }
  }, [isAuthenticated])

  const addCategory = useCallback(async (type, categoryName) => {
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

    if (!isAuthenticated) {
      return
    }

    try {
      const createdCategory = await categoriesApi.create({ type, name: trimmedValue })
      setCategoryIdMap((currentMap) => ({
        ...currentMap,
        [type]: {
          ...currentMap[type],
          [trimmedValue.toLowerCase()]: createdCategory._id,
        },
      }))
      setSettingsError('')
    } catch (requestError) {
      if (!DEMO_MODE) {
        const message = requestError.response?.data?.message || 'Unable to add category.'
        setSettingsError(message)
        throw requestError
      }
    }
  }, [isAuthenticated])

  const removeCategory = useCallback(async (type, categoryName) => {
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

    const categoryId = categoryIdMap[type][categoryName.toLowerCase()]
    setCategoryIdMap((currentMap) => {
      const nextMap = { ...currentMap[type] }
      delete nextMap[categoryName.toLowerCase()]
      return { ...currentMap, [type]: nextMap }
    })

    if (!isAuthenticated || !categoryId) {
      return
    }

    try {
      await categoriesApi.remove(categoryId)
      setSettingsError('')
    } catch (requestError) {
      if (!DEMO_MODE) {
        const message = requestError.response?.data?.message || 'Unable to remove category.'
        setSettingsError(message)
        throw requestError
      }
    }
  }, [categoryIdMap, isAuthenticated])

  const resetSettings = useCallback(async () => {
    setSettings((currentValue) => ({
      ...currentValue,
      currency: defaultAppSettings.currency,
      dateLocale: defaultAppSettings.dateLocale,
      categories: defaultAppSettings.categories,
    }))

    if (!isAuthenticated) {
      return
    }

    try {
      await settingsApi.update({
        currency: defaultAppSettings.currency,
        dateLocale: defaultAppSettings.dateLocale,
      })
      setSettingsError('')
    } catch (requestError) {
      if (!DEMO_MODE) {
        const message = requestError.response?.data?.message || 'Unable to reset settings.'
        setSettingsError(message)
        throw requestError
      }
    }
  }, [isAuthenticated])

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
      settingsError,
      isSettingsLoading,
      setCurrency,
      addCategory,
      removeCategory,
      resetSettings,
    }),
    [addCategory, currencyFormatter, isSettingsLoading, removeCategory, resetSettings, setCurrency, settings, settingsError],
  )

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export { SettingsContext }