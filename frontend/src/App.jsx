import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { SettingsProvider } from './context/SettingsContext'
import { TransactionsProvider } from './context/TransactionsContext'
import ProtectedRoute from './components/common/ProtectedRoute'
import AppShell from './components/layout/AppShell'
import AuthPage from './pages/AuthPage'
import DashboardPage from './pages/DashboardPage'
import TransactionsPage from './pages/TransactionsPage'
import SettingsPage from './pages/SettingsPage'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SettingsProvider>
          <TransactionsProvider>
            <Routes>
              <Route path="/auth" element={<AuthPage />} />
              <Route
                element={
                  <ProtectedRoute>
                    <AppShell />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/income" element={<TransactionsPage type="income" />} />
                <Route path="/expenses" element={<TransactionsPage type="expense" />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </TransactionsProvider>
        </SettingsProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
