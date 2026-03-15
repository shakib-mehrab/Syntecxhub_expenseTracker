import { useState } from 'react'
import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import WalletRoundedIcon from '@mui/icons-material/WalletRounded'
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded'
import SavingsRoundedIcon from '@mui/icons-material/SavingsRounded'
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded'
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { navigationItems } from '../../config'
import { useAuth } from '../../hooks/useAuth'

const drawerWidth = 252

const navIcons = {
  '/dashboard': <DashboardRoundedIcon fontSize="small" />,
  '/income': <SavingsRoundedIcon fontSize="small" />,
  '/expenses': <ReceiptLongRoundedIcon fontSize="small" />,
  '/settings': <SettingsRoundedIcon fontSize="small" />,
}

function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleDrawerToggle = () => {
    setMobileOpen((isOpen) => !isOpen)
  }

  const handleLogout = () => {
    logout()
    navigate('/auth', { replace: true })
  }

  const drawerContent = (
    <Box sx={{ display: 'flex', height: '100%', flexDirection: 'column', p: 1.75 }}>
      <Stack direction="row" spacing={1.25} alignItems="center" sx={{ px: 0.75, py: 0.75 }}>
        <Avatar sx={{ bgcolor: 'secondary.main', color: 'common.white' }}>
          <WalletRoundedIcon />
        </Avatar>
        <Box>
          <Typography variant="subtitle1" fontWeight={700}>
            Expense Atlas
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            Track every taka with clarity
          </Typography>
        </Box>
      </Stack>
      <Divider sx={{ my: 1.5, borderColor: 'rgba(255,255,255,0.1)' }} />
      <List sx={{ display: 'grid', gap: 1 }}>
        {navigationItems.map((item) => (
          <ListItemButton
            key={item.path}
            component={NavLink}
            to={item.path}
            onClick={() => setMobileOpen(false)}
            sx={{
              borderRadius: 3,
              gap: 1,
              px: 1.25,
              py: 0.9,
              color: 'rgba(255,255,255,0.78)',
              '&.active': {
                bgcolor: 'rgba(255,255,255,0.14)',
                color: '#fff',
              },
            }}
          >
            {navIcons[item.path]}
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
      <Box sx={{ mt: 'auto' }}>
        <Box
          sx={{
            borderRadius: 4,
            bgcolor: '#205987',
            p: 1.5,
          }}
        >
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.65)' }}>
            Signed in as
          </Typography>
          <Typography variant="subtitle1" fontWeight={700}>
            {user?.name}
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.72)' }}>
            {user?.email}
          </Typography>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<LogoutRoundedIcon />}
            onClick={handleLogout}
            sx={{
              mt: 2,
              borderColor: 'rgba(255,255,255,0.2)',
              color: '#fff',
            }}
          >
            Logout
          </Button>
        </Box>
      </Box>
    </Box>
  )

  return (
    <Box className="app-shell" sx={{ display: 'flex' }}>
      <Box component="nav" sx={{ width: { lg: drawerWidth }, flexShrink: { lg: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', lg: 'none' },
            '& .MuiDrawer-paper': { width: drawerWidth },
          }}
        >
          {drawerContent}
        </Drawer>
        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: 'none', lg: 'block' },
            '& .MuiDrawer-paper': { width: drawerWidth },
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 1.5, sm: 2 } }}>
        <IconButton
          onClick={handleDrawerToggle}
          sx={{ display: { lg: 'none' }, mb: 1, bgcolor: '#ffffff', border: '1px solid #e5e7eb' }}
        >
          <MenuRoundedIcon />
        </IconButton>
        <Outlet />
      </Box>
    </Box>
  )
}

export default AppShell