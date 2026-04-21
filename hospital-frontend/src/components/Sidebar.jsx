import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Box, Typography, Divider, Button, Switch, FormControlLabel } from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate, useLocation } from 'react-router-dom';
import authService from '../services/auth.service';
import { useColorMode } from '../theme/ThemeContext';

const drawerWidth = 260;

const Sidebar = ({ menuItems }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toggleColorMode, mode } = useColorMode();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { 
          width: drawerWidth, 
          boxSizing: 'border-box',
          backgroundColor: mode === 'light' ? '#0d47a1' : '#1e1e1e',
          color: 'white',
          borderRight: 'none'
        },
      }}
    >
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <LocalHospitalIcon fontSize="large" sx={{ color: '#00bfa5' }}/>
        <Typography variant="h6" fontWeight="bold">
          HospitalApp
        </Typography>
      </Box>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
      <Box sx={{ overflow: 'auto', flex: 1, pt: 2 }}>
        <List>
          {menuItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <ListItem 
                button 
                key={item.text} 
                onClick={() => navigate(item.path)}
                sx={{
                  mx: 2,
                  my: 1,
                  borderRadius: 2,
                  width: 'auto',
                  backgroundColor: active ? 'rgba(255,255,255,0.15)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.2)',
                  }
                }}
              >
                <ListItemIcon sx={{ color: active ? '#00bfa5' : 'white', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ 
                    fontWeight: active ? 'bold' : 'normal',
                    color: active ? '#00bfa5' : 'white'
                  }} 
                />
              </ListItem>
            );
          })}
        </List>
      </Box>
      <Box sx={{ p: 2 }}>
        <FormControlLabel
          control={<Switch checked={mode === 'dark'} onChange={toggleColorMode} color="secondary" />}
          label="Dark Mode"
          sx={{ color: 'white', mb: 2, ml: 1 }}
        />
        <Button 
          fullWidth 
          variant="outlined" 
          color="inherit" 
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{ borderColor: 'rgba(255,255,255,0.3)', '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.1)' } }}
        >
          Logout
        </Button>
      </Box>
    </Drawer>
  );
}

export default Sidebar;
