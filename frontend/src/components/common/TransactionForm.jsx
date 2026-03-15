import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Alert,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import { useSettings } from '../../hooks/useSettings'

const getInitialState = (type, categories) => ({
  type,
  title: '',
  category: categories[type][0],
  amount: '',
  date: new Date().toISOString().split('T')[0],
  note: '',
})

function TransactionForm({ type, isSubmitting, onSubmit, serverError }) {
  const { categories } = useSettings()
  const [formValues, setFormValues] = useState(() => getInitialState(type, categories))
  const titleInputRef = useRef(null)

  useEffect(() => {
    setFormValues(getInitialState(type, categories))
  }, [categories, type])

  useEffect(() => {
    titleInputRef.current?.focus()
  }, [type])

  const availableCategories = useMemo(() => categories[type], [categories, type])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormValues((currentValues) => ({ ...currentValues, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    await onSubmit({
      ...formValues,
      amount: Number(formValues.amount),
    })
    setFormValues(getInitialState(type, categories))
    titleInputRef.current?.focus()
  }

  return (
    <Card className="surface-card fade-in">
      <CardContent>
        <Typography variant="h6">Add {type === 'income' ? 'Income' : 'Expense'}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
          Capture a new {type} record with category-based tracking.
        </Typography>
        <Stack component="form" spacing={2} onSubmit={handleSubmit}>
          {serverError ? <Alert severity="error">{serverError}</Alert> : null}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                required
                label="Title"
                name="title"
                inputRef={titleInputRef}
                value={formValues.title}
                onChange={handleChange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                required
                select
                label="Category"
                name="category"
                value={formValues.category}
                onChange={handleChange}
              >
                {availableCategories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                required
                type="number"
                label="Amount"
                name="amount"
                inputProps={{ min: 0, step: '0.01' }}
                value={formValues.amount}
                onChange={handleChange}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                required
                type="date"
                label="Date"
                name="date"
                value={formValues.date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                disabled
                label="Type"
                value={type === 'income' ? 'Income' : 'Expense'}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Note"
                name="note"
                multiline
                minRows={3}
                value={formValues.note}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          <Button type="submit" variant="contained" startIcon={<AddRoundedIcon />} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : `Add ${type === 'income' ? 'Income' : 'Expense'}`}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default TransactionForm