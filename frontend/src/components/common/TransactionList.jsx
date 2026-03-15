import {
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from '@mui/material'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import { useSettings } from '../../hooks/useSettings'

function TransactionList({ items, type, onDelete }) {
  const { currencyFormatter, dateLocale } = useSettings()

  return (
    <Stack spacing={2.25} className="fade-in">
      <div>
        <Typography variant="h6">{type === 'income' ? 'Income' : 'Expense'} Records</Typography>
        <Typography variant="body2" color="text.secondary">
          Hover over a card to reveal the delete action.
        </Typography>
      </div>
      <div className="transaction-grid">
        {items.length === 0 ? (
          <Card className="surface-card">
            <CardContent>
              <Typography color="text.secondary">No {type} transactions found.</Typography>
            </CardContent>
          </Card>
        ) : (
          items.map((item) => (
            <Card key={item._id} className="surface-card transaction-item">
              <CardContent>
                <Stack spacing={1.25}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle1" fontWeight={700}>
                      {item.title}
                    </Typography>
                    <Chip label={item.category} size="small" color={type === 'income' ? 'success' : 'error'} variant="outlined" />
                  </Stack>
                  <Typography color={type === 'income' ? 'success.main' : 'error.main'} variant="h6">
                    {type === 'income' ? '+' : '-'}{currencyFormatter.format(item.amount)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(item.date).toLocaleDateString(dateLocale)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.note || 'No notes added.'}
                  </Typography>
                  <Button
                    className="transaction-delete"
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteOutlineRoundedIcon />}
                    onClick={() => onDelete(item._id)}
                  >
                    Delete
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </Stack>
  )
}

export default TransactionList