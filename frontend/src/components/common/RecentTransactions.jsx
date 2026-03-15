import { Avatar, Card, CardContent, Chip, Divider, Stack, Typography } from '@mui/material'
import PaidRoundedIcon from '@mui/icons-material/PaidRounded'
import ReceiptRoundedIcon from '@mui/icons-material/ReceiptRounded'
import { useSettings } from '../../hooks/useSettings'

function RecentTransactions({ transactions }) {
  const { currencyFormatter, dateLocale } = useSettings()

  return (
    <Card className="surface-card fade-in">
      <CardContent>
        <Typography variant="h6">Recent Transactions</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
          Your latest income and expense movements.
        </Typography>
        <Stack divider={<Divider flexItem />} spacing={2}>
          {transactions.length === 0 ? (
            <Typography color="text.secondary">No recent transactions yet.</Typography>
          ) : (
            transactions.slice(0, 6).map((item) => (
              <Stack key={item._id} direction="row" spacing={1.5} alignItems="center" justifyContent="space-between">
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Avatar sx={{ bgcolor: item.type === 'income' ? 'success.light' : 'error.light' }}>
                    {item.type === 'income' ? <PaidRoundedIcon /> : <ReceiptRoundedIcon />}
                  </Avatar>
                  <div>
                    <Typography fontWeight={700}>{item.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.category} • {new Date(item.date).toLocaleDateString(dateLocale)}
                    </Typography>
                  </div>
                </Stack>
                <Stack alignItems="flex-end" spacing={1}>
                  <Typography color={item.type === 'income' ? 'success.main' : 'error.main'} fontWeight={700}>
                    {item.type === 'income' ? '+' : '-'}{currencyFormatter.format(item.amount)}
                  </Typography>
                  <Chip label={item.type} size="small" color={item.type === 'income' ? 'success' : 'error'} variant="outlined" />
                </Stack>
              </Stack>
            ))
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}

export default RecentTransactions