import { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, Button, Card, CardContent, Stack, Typography } from '@mui/material'
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'
import SavingsRoundedIcon from '@mui/icons-material/SavingsRounded'
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded'
import { useNavigate } from 'react-router-dom'
import ChartsPanel from '../components/common/ChartsPanel'
import RecentTransactions from '../components/common/RecentTransactions'
import SummaryCards from '../components/common/SummaryCards'
import { useTransactions } from '../hooks/useTransactions'

function DashboardPage() {
  const navigate = useNavigate()
  const {
    income,
    expenses,
    transactions,
    summary,
    error,
    isLoading,
    fetchTransactions,
    exportTransactions,
  } = useTransactions()
  const [insights, setInsights] = useState([])

  useEffect(() => {
    let ignore = false

    const loadInsights = async () => {
      const response = await fetch('/mock/insights.json')
      const data = await response.json()

      if (!ignore) {
        setInsights(data.insights || [])
      }
    }

    loadInsights()

    return () => {
      ignore = true
    }
  }, [])

  const handleRefresh = useCallback(() => {
    fetchTransactions()
  }, [fetchTransactions])

  const handleExportAll = useCallback(() => {
    exportTransactions()
  }, [exportTransactions])

  const topInsights = useMemo(() => insights.slice(0, 3), [insights])

  return (
    <Stack spacing={{ xs: 1.25, sm: 2 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
        <div>
          <Typography variant="h4" sx={{ fontSize: { xs: '1.35rem', sm: '1.75rem' } }}>Overview</Typography>
          <Typography color="text.secondary">
            A live snapshot of your balance, income, expenses, and recent performance.
          </Typography>
        </div>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          <Button
            variant="outlined"
            startIcon={<SavingsRoundedIcon />}
            onClick={() => navigate('/income')}
            fullWidth
          >
            Income
          </Button>
          <Button
            variant="outlined"
            startIcon={<ReceiptLongRoundedIcon />}
            onClick={() => navigate('/expenses')}
            fullWidth
          >
            Expenses
          </Button>
          <Button variant="outlined" startIcon={<RefreshRoundedIcon />} onClick={handleRefresh} disabled={isLoading} fullWidth>
            Refresh
          </Button>
          <Button variant="contained" startIcon={<DownloadRoundedIcon />} onClick={handleExportAll} fullWidth>
            Export Report
          </Button>
        </Stack>
      </Stack>
      {error ? <Alert severity="error">{error}</Alert> : null}
      <SummaryCards summary={summary} />
      <div className="insight-strip fade-in">
        {topInsights.map((insight) => (
          <Card key={insight.title} className="surface-card">
            <CardContent>
              <Typography variant="subtitle1" fontWeight={700}>
                {insight.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {insight.description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </div>
      <ChartsPanel income={income} expenses={expenses} transactions={transactions} />
      <RecentTransactions transactions={transactions} />
    </Stack>
  )
}

export default DashboardPage