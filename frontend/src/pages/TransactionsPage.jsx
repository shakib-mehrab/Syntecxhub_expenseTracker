import { useCallback, useMemo, useState } from 'react'
import { Alert, Button, Chip, Stack, Typography } from '@mui/material'
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded'
import { useTransactions } from '../hooks/useTransactions'
import SummaryCards from '../components/common/SummaryCards'
import TransactionForm from '../components/common/TransactionForm'
import TransactionList from '../components/common/TransactionList'

function TransactionsPage({ type }) {
  const {
    income,
    expenses,
    summary,
    error,
    isSubmitting,
    createTransaction,
    deleteTransaction,
    exportTransactions,
  } = useTransactions()
  const [feedback, setFeedback] = useState('')

  const items = useMemo(() => (type === 'income' ? income : expenses), [expenses, income, type])

  const handleCreate = useCallback(
    async (payload) => {
      setFeedback('')
      await createTransaction(payload)
      setFeedback(`${type === 'income' ? 'Income' : 'Expense'} added successfully.`)
    },
    [createTransaction, type],
  )

  const handleDelete = useCallback(
    async (id) => {
      setFeedback('')
      await deleteTransaction(id)
      setFeedback('Transaction deleted successfully.')
    },
    [deleteTransaction],
  )

  const handleExport = useCallback(() => {
    exportTransactions(type)
  }, [exportTransactions, type])

  return (
    <Stack spacing={2}>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
        <div>
          <Typography variant="h4">{type === 'income' ? 'Income' : 'Expenses'}</Typography>
          <Typography color="text.secondary">
            Add, review, delete, and export your {type} records with category-based visibility.
          </Typography>
        </div>
        <Stack direction="row" spacing={1.25} alignItems="center">
          <Chip label={`${items.length} records`} color={type === 'income' ? 'success' : 'error'} variant="outlined" />
          <Button variant="contained" startIcon={<DownloadRoundedIcon />} onClick={handleExport}>
            Export {type === 'income' ? 'Income' : 'Expenses'}
          </Button>
        </Stack>
      </Stack>
      {feedback ? <Alert severity="success">{feedback}</Alert> : null}
      {error ? <Alert severity="error">{error}</Alert> : null}
      <SummaryCards summary={summary} />
      <TransactionForm type={type} isSubmitting={isSubmitting} onSubmit={handleCreate} serverError={error} />
      <TransactionList items={items} type={type} onDelete={handleDelete} />
    </Stack>
  )
}

export default TransactionsPage