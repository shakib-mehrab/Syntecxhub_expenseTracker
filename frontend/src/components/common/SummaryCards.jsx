import { Card, CardContent, Stack, Typography } from '@mui/material'
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded'
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded'
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded'
import { useSettings } from '../../hooks/useSettings'

const summaryMeta = [
  {
    key: 'totalBalance',
    label: 'Total Balance',
    icon: <AccountBalanceWalletRoundedIcon />,
    accent: '#184d7a',
  },
  {
    key: 'totalIncome',
    label: 'Income',
    icon: <TrendingUpRoundedIcon />,
    accent: '#198754',
  },
  {
    key: 'totalExpense',
    label: 'Expenses',
    icon: <TrendingDownRoundedIcon />,
    accent: '#c2410c',
  },
]

function SummaryCards({ summary }) {
  const { currencyFormatter } = useSettings()

  return (
    <div className="summary-grid fade-in">
      {summaryMeta.map((item) => (
        <Card key={item.key} className="surface-card">
          <CardContent>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <div>
                <Typography variant="body2" color="text.secondary">
                  {item.label}
                </Typography>
                <Typography variant="h4" sx={{ mt: 1 }}>
                  {currencyFormatter.format(summary[item.key])}
                </Typography>
              </div>
              <Stack
                alignItems="center"
                justifyContent="center"
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '16px',
                  bgcolor: `${item.accent}1A`,
                  color: item.accent,
                }}
              >
                {item.icon}
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default SummaryCards