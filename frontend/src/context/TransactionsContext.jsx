import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import * as XLSX from 'xlsx'
import { DEMO_MODE, STORAGE_KEYS } from '../config'
import { transactionsApi } from '../services/api'
import { useAuth } from '../hooks/useAuth'

const TransactionsContext = createContext(null)

const sortByDate = (items) => [...items].sort((left, right) => new Date(right.date) - new Date(left.date))

const readDemoTransactions = () => {
  const storedValue = localStorage.getItem(STORAGE_KEYS.demoTransactions)

  if (!storedValue) {
    return null
  }

  try {
    return JSON.parse(storedValue)
  } catch {
    return null
  }
}

const writeDemoTransactions = (rows) => {
  localStorage.setItem(STORAGE_KEYS.demoTransactions, JSON.stringify(rows))
}

const downloadWorkbook = (rows, type) => {
  const sheetRows = rows.map((item) => ({
    Type: item.type,
    Title: item.title,
    Category: item.category,
    Amount: item.amount,
    Date: new Date(item.date).toISOString().split('T')[0],
    Note: item.note || '',
  }))

  const workbook = XLSX.utils.book_new()
  const worksheet = XLSX.utils.json_to_sheet(sheetRows)
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions')
  XLSX.writeFile(workbook, `${type || 'all-transactions'}-report.xlsx`)
}

export function TransactionsProvider({ children }) {
  const { isAuthenticated, isDemoMode } = useAuth()
  const [income, setIncome] = useState([])
  const [expenses, setExpenses] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const fetchTransactions = useCallback(async () => {
    if (!isAuthenticated) {
      setIncome([])
      setExpenses([])
      return
    }

    setIsLoading(true)
    setError('')

    try {
      let incomeRows
      let expenseRows

      try {
        ;[incomeRows, expenseRows] = await Promise.all([
          transactionsApi.list('income'),
          transactionsApi.list('expense'),
        ])
      } catch (requestError) {
        if (!DEMO_MODE) {
          throw requestError
        }

        const storedRows = readDemoTransactions()
        const mockRows = storedRows || []

        if (!storedRows) {
          writeDemoTransactions(mockRows)
        }

        incomeRows = mockRows.filter((item) => item.type === 'income')
        expenseRows = mockRows.filter((item) => item.type === 'expense')
      }

      setIncome(sortByDate(incomeRows))
      setExpenses(sortByDate(expenseRows))
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load transactions.')
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  const createTransaction = useCallback(async (payload) => {
    setIsSubmitting(true)
    setError('')

    try {
      let createdItem

      try {
        createdItem = await transactionsApi.create(payload)
      } catch (requestError) {
        if (!DEMO_MODE) {
          throw requestError
        }

        createdItem = {
          ...payload,
          _id: `demo-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        const currentRows = sortByDate([createdItem, ...readDemoTransactions() || []])
        writeDemoTransactions(currentRows)
      }

      if (createdItem.type === 'income') {
        setIncome((currentRows) => sortByDate([createdItem, ...currentRows]))
      } else {
        setExpenses((currentRows) => sortByDate([createdItem, ...currentRows]))
      }

      return createdItem
    } catch (requestError) {
      const message = requestError.response?.data?.message || 'Unable to save transaction.'
      setError(message)
      throw requestError
    } finally {
      setIsSubmitting(false)
    }
  }, [])

  const deleteTransaction = useCallback(async (id) => {
    try {
      await transactionsApi.remove(id)
    } catch (requestError) {
      if (!DEMO_MODE) {
        throw requestError
      }

      const remainingRows = (readDemoTransactions() || []).filter((item) => item._id !== id)
      writeDemoTransactions(remainingRows)
    }

    setIncome((currentRows) => currentRows.filter((item) => item._id !== id))
    setExpenses((currentRows) => currentRows.filter((item) => item._id !== id))
  }, [])

  const exportTransactions = useCallback(async (type) => {
    try {
      const response = await transactionsApi.export(type)
      const fileName = response.headers['content-disposition']?.split('filename=')[1] || `${type || 'transactions'}.xlsx`
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      const url = window.URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = fileName.replaceAll('"', '')
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
      window.URL.revokeObjectURL(url)
      return
    } catch (requestError) {
      if (!DEMO_MODE) {
        throw requestError
      }
    }

    const availableRows = type === 'income' ? income : type === 'expense' ? expenses : sortByDate([...income, ...expenses])
    downloadWorkbook(availableRows, type)
  }, [expenses, income])

  const transactions = useMemo(() => sortByDate([...income, ...expenses]), [expenses, income])

  const summary = useMemo(() => {
    const totalIncome = income.reduce((sum, entry) => sum + entry.amount, 0)
    const totalExpense = expenses.reduce((sum, entry) => sum + entry.amount, 0)

    return {
      totalIncome,
      totalExpense,
      totalBalance: totalIncome - totalExpense,
    }
  }, [expenses, income])

  const value = useMemo(
    () => ({
      income,
      expenses,
      transactions,
      summary,
      isDemoMode,
      error,
      isLoading,
      isSubmitting,
      fetchTransactions,
      createTransaction,
      deleteTransaction,
      exportTransactions,
    }),
    [createTransaction, deleteTransaction, error, expenses, exportTransactions, fetchTransactions, income, isDemoMode, isLoading, isSubmitting, summary, transactions],
  )

  return <TransactionsContext.Provider value={value}>{children}</TransactionsContext.Provider>
}

export { TransactionsContext }