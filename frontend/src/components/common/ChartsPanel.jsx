import { useMemo } from 'react'
import { Card, CardContent, Stack, Typography } from '@mui/material'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useSettings } from '../../hooks/useSettings'

const chartColors = ['#184d7a', '#d97706', '#198754', '#c2410c', '#7c3aed', '#0f766e']

function ChartsPanel({ income, expenses, transactions }) {
  const { currencyFormatter, dateLocale } = useSettings()

  const monthlyData = useMemo(() => {
    const monthMap = new Map()

    transactions.forEach((item) => {
      const monthKey = new Intl.DateTimeFormat(dateLocale, {
        month: 'short',
        year: '2-digit',
      }).format(new Date(item.date))

      if (!monthMap.has(monthKey)) {
        monthMap.set(monthKey, { month: monthKey, income: 0, expense: 0 })
      }

      const currentMonth = monthMap.get(monthKey)
      currentMonth[item.type] += item.amount
    })

    return [...monthMap.values()].slice(-6)
  }, [dateLocale, transactions])

  const categoryData = useMemo(() => {
    const categoryMap = new Map()

    expenses.forEach((item) => {
      categoryMap.set(item.category, (categoryMap.get(item.category) || 0) + item.amount)
    })

    return [...categoryMap.entries()].map(([name, value]) => ({ name, value }))
  }, [expenses])

  const trendData = useMemo(
    () => transactions.slice(0, 8).reverse().map((item) => ({
      name: item.title.length > 12 ? `${item.title.slice(0, 12)}...` : item.title,
      amount: item.type === 'income' ? item.amount : -item.amount,
    })),
    [transactions],
  )

  return (
    <Stack spacing={2.25} className="fade-in">
      <div className="chart-grid">
        <Card className="surface-card">
          <CardContent>
            <Typography variant="h6">Income vs Expenses</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Monthly comparison across recent records.
            </Typography>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => currencyFormatter.format(value)} />
                <Legend />
                <Bar dataKey="income" fill="#198754" radius={[10, 10, 0, 0]} />
                <Bar dataKey="expense" fill="#c2410c" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="surface-card">
          <CardContent>
            <Typography variant="h6">Expense Categories</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Where most of your spending is going.
            </Typography>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Tooltip formatter={(value) => currencyFormatter.format(value)} />
                <Pie data={categoryData} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110} paddingAngle={4}>
                  {categoryData.map((entry, index) => (
                    <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <div className="mini-chart-grid">
        <Card className="surface-card">
          <CardContent>
            <Typography variant="h6">Cashflow Trend</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Positive values indicate income, negative values indicate expenses.
            </Typography>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => currencyFormatter.format(value)} />
                <Line type="monotone" dataKey="amount" stroke="#184d7a" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="surface-card">
          <CardContent>
            <Typography variant="h6">Quick Split</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Immediate breakdown of current totals.
            </Typography>
            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between">
                <Typography color="text.secondary">Income Entries</Typography>
                <Typography fontWeight={700}>{income.length}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography color="text.secondary">Expense Entries</Typography>
                <Typography fontWeight={700}>{expenses.length}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography color="text.secondary">Latest Activity</Typography>
                <Typography fontWeight={700}>{transactions[0]?.title || 'No records yet'}</Typography>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </div>
    </Stack>
  )
}

export default ChartsPanel