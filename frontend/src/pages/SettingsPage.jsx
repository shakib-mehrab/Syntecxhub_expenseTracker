import { useMemo, useState } from 'react'
import {
  Alert,
  Button,
  Card,
  CardContent,
  Chip,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import SaveRoundedIcon from '@mui/icons-material/SaveRounded'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import { useAuth } from '../hooks/useAuth'
import { useSettings } from '../hooks/useSettings'

const supportedCurrencies = ['BDT', 'USD', 'EUR', 'GBP', 'INR', 'AED']

function SettingsPage() {
  const { user, updateProfile } = useAuth()
  const {
    currency,
    categories,
    setCurrency,
    addCategory,
    removeCategory,
    resetSettings,
    settingsError,
    isSettingsLoading,
  } = useSettings()

  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
  })
  const [categoryType, setCategoryType] = useState('expense')
  const [categoryInput, setCategoryInput] = useState('')
  const [status, setStatus] = useState('')
  const [actionError, setActionError] = useState('')

  const totalCategories = useMemo(
    () => categories.income.length + categories.expense.length,
    [categories.expense.length, categories.income.length],
  )

  const handleProfileSave = async () => {
    setActionError('')
    try {
      await updateProfile(profileForm)
      setStatus('Profile updated successfully.')
    } catch (requestError) {
      setActionError(requestError.response?.data?.message || 'Unable to update profile.')
    }
  }

  const handleAddCategory = async () => {
    if (!categoryInput.trim()) {
      return
    }

    setActionError('')
    try {
      await addCategory(categoryType, categoryInput)
      setCategoryInput('')
      setStatus('Category added successfully.')
    } catch (requestError) {
      setActionError(requestError.response?.data?.message || 'Unable to add category.')
    }
  }

  const handleCategoryRemove = async (type, category) => {
    setActionError('')
    try {
      await removeCategory(type, category)
      setStatus('Category removed successfully.')
    } catch (requestError) {
      setActionError(requestError.response?.data?.message || 'Unable to remove category.')
    }
  }

  const handleReset = async () => {
    setActionError('')
    try {
      await resetSettings()
      setStatus('Settings reset to defaults.')
    } catch (requestError) {
      setActionError(requestError.response?.data?.message || 'Unable to reset settings.')
    }
  }

  const handleCurrencyChange = async (nextCurrency) => {
    setActionError('')
    try {
      await setCurrency(nextCurrency)
      setStatus('Currency updated successfully.')
    } catch (requestError) {
      setActionError(requestError.response?.data?.message || 'Unable to update currency.')
    }
  }

  return (
    <Stack spacing={{ xs: 1.25, sm: 2 }}>
      <div>
        <Typography variant="h4" sx={{ fontSize: { xs: '1.35rem', sm: '1.75rem' } }}>Settings</Typography>
        <Typography color="text.secondary">
          Update profile, tweak currencies, and manage income/expense categories.
        </Typography>
      </div>

      {status ? <Alert severity="success">{status}</Alert> : null}
      {actionError ? <Alert severity="error">{actionError}</Alert> : null}
      {settingsError ? <Alert severity="warning">{settingsError}</Alert> : null}

      <Card className="surface-card">
        <CardContent>
          <Stack spacing={1.5}>
            <Typography variant="h6">Profile</Typography>
            <TextField
              label="Full Name"
              value={profileForm.name}
              onChange={(event) => setProfileForm((prev) => ({ ...prev, name: event.target.value }))}
            />
            <TextField
              label="Email"
              type="email"
              value={profileForm.email}
              onChange={(event) => setProfileForm((prev) => ({ ...prev, email: event.target.value }))}
            />
            <Button variant="contained" startIcon={<SaveRoundedIcon />} onClick={handleProfileSave} fullWidth>
              {isSettingsLoading ? 'Please wait...' : 'Save Profile'}
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Card className="surface-card">
        <CardContent>
          <Stack spacing={1.5}>
            <Typography variant="h6">Currency</Typography>
            <TextField
              select
              label="Default Currency"
              value={currency}
              onChange={(event) => handleCurrencyChange(event.target.value)}
            >
              {supportedCurrencies.map((currencyCode) => (
                <MenuItem key={currencyCode} value={currencyCode}>
                  {currencyCode}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </CardContent>
      </Card>

      <Card className="surface-card">
        <CardContent>
          <Stack spacing={1.5}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Categories</Typography>
              <Chip label={`${totalCategories} total`} size="small" />
            </Stack>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1}>
              <TextField
                select
                label="Category Type"
                value={categoryType}
                onChange={(event) => setCategoryType(event.target.value)}
                sx={{ minWidth: 150 }}
              >
                <MenuItem value="income">Income</MenuItem>
                <MenuItem value="expense">Expense</MenuItem>
              </TextField>
              <TextField
                fullWidth
                label="New Category"
                value={categoryInput}
                onChange={(event) => setCategoryInput(event.target.value)}
              />
              <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={handleAddCategory} fullWidth>
                Add
              </Button>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2">Income Categories</Typography>
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {categories.income.map((category) => (
                  <Chip
                    key={`income-${category}`}
                    label={category}
                    onDelete={() => handleCategoryRemove('income', category)}
                    deleteIcon={<DeleteOutlineRoundedIcon />}
                    color="success"
                    variant="outlined"
                  />
                ))}
              </Stack>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2">Expense Categories</Typography>
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {categories.expense.map((category) => (
                  <Chip
                    key={`expense-${category}`}
                    label={category}
                    onDelete={() => handleCategoryRemove('expense', category)}
                    deleteIcon={<DeleteOutlineRoundedIcon />}
                    color="error"
                    variant="outlined"
                  />
                ))}
              </Stack>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Card className="surface-card">
        <CardContent>
          <Stack spacing={1.5}>
            <Typography variant="h6">Reset</Typography>
            <Typography color="text.secondary">
              Revert currency and category settings back to defaults.
            </Typography>
            <Button variant="outlined" color="error" startIcon={<RestartAltRoundedIcon />} onClick={handleReset}>
              Reset Settings
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  )
}

export default SettingsPage