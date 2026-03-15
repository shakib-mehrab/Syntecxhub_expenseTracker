import { useEffect, useRef, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded'
import SavingsRoundedIcon from '@mui/icons-material/SavingsRounded'
import ShowChartRoundedIcon from '@mui/icons-material/ShowChartRounded'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const initialValues = {
  name: '',
  email: '',
  password: '',
}

function AuthPage() {
  const { isAuthenticated, isAuthLoading, continueWithDemo, login, signup } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mode, setMode] = useState('login')
  const [formValues, setFormValues] = useState(initialValues)
  const [error, setError] = useState('')
  const emailInputRef = useRef(null)

  useEffect(() => {
    emailInputRef.current?.focus()
  }, [mode])

  if (isAuthenticated) {
    return <Navigate to={location.state?.from || '/dashboard'} replace />
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormValues((currentValues) => ({ ...currentValues, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    try {
      if (mode === 'login') {
        await login({ email: formValues.email, password: formValues.password })
      } else {
        await signup(formValues)
      }

      navigate('/dashboard', { replace: true })
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || 'Authentication failed.')
    }
  }

  return (
    <div className="auth-layout">
      <Box className="auth-panel" sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', p: 4 }}>
        <Stack spacing={2} className="auth-copy" sx={{ maxWidth: 500 }}>
          <Chip label="JWT secured finance workspace" color="secondary" sx={{ width: 'fit-content' }} />
          <Typography variant="h1" sx={{ fontSize: { md: 40, lg: 48 }, lineHeight: 1.1 }}>
            Map your money flow with precision.
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 500 }}>
            A responsive expense tracker with summaries, charts, exports, recent activity, and category-focused reporting.
          </Typography>
          <div className="insight-strip">
            {[
              { icon: <ShieldRoundedIcon />, title: 'Secure Auth', text: 'JWT-based sign in and sign up.' },
              { icon: <SavingsRoundedIcon />, title: 'Track Income', text: 'Capture salary, freelance, and more.' },
              { icon: <ShowChartRoundedIcon />, title: 'See Trends', text: 'Bar, pie, and line charts in one view.' },
            ].map((item) => (
              <Card key={item.title} className="surface-card">
                <CardContent>
                  <Stack spacing={1.5}>
                    <Box sx={{ color: 'primary.main' }}>{item.icon}</Box>
                    <Typography fontWeight={700}>{item.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.text}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </div>
        </Stack>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: { xs: 1.5, sm: 2.5 } }}>
        <Card className="surface-card" sx={{ width: '100%', maxWidth: 500 }}>
          <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
            <Stack spacing={2} component="form" onSubmit={handleSubmit}>
              <div>
                <Typography variant="h3">{mode === 'login' ? 'Welcome back' : 'Create your account'}</Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }}>
                  {mode === 'login'
                    ? 'Sign in to continue managing your income and expenses.'
                    : 'Set up your workspace and start tracking every transaction.'}
                </Typography>
              </div>
              {error ? <Alert severity="error">{error}</Alert> : null}
              {mode === 'signup' ? (
                <TextField
                  fullWidth
                  required
                  label="Full name"
                  name="name"
                  value={formValues.name}
                  onChange={handleChange}
                />
              ) : null}
              <TextField
                fullWidth
                required
                label="Email"
                name="email"
                type="email"
                inputRef={emailInputRef}
                value={formValues.email}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                required
                label="Password"
                name="password"
                type="password"
                value={formValues.password}
                onChange={handleChange}
              />
              <Button type="submit" variant="contained" endIcon={<ArrowForwardRoundedIcon />} disabled={isAuthLoading}>
                {isAuthLoading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create account'}
              </Button>
              <Button variant="outlined" onClick={() => {
                continueWithDemo()
                navigate('/dashboard', { replace: true })
              }}>
                Continue with demo data
              </Button>
              <Alert severity="info">
                If the backend is unavailable, the app automatically falls back to a local demo workspace.
              </Alert>
              <Button variant="text" onClick={() => setMode((currentMode) => (currentMode === 'login' ? 'signup' : 'login'))}>
                {mode === 'login' ? 'Need an account? Sign up' : 'Already registered? Log in'}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </div>
  )
}

export default AuthPage