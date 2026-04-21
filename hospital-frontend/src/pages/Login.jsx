import React, { useState } from 'react';
import { Box, Paper, TextField, Button, Typography, Container, CircularProgress } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/auth.service';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authService.login(username, password);
      toast.success('Logged in successfully!');
      
      const roles = response.roles;
      if (roles.includes('ROLE_ADMIN')) {
        navigate('/admin');
      } else if (roles.includes('ROLE_DOCTOR')) {
        navigate('/doctor');
      } else {
        navigate('/patient');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      backgroundImage: 'url("https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2000&auto=format&fit=crop")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
      <Container maxWidth="sm">
        <Paper elevation={24} sx={{ 
          p: { xs: 3, md: 5 }, 
          borderRadius: 4,
          bgcolor: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.5)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': { boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }
        }}>
          <Typography variant="h4" color="primary" gutterBottom align="center" fontWeight="900" sx={{ mt: 1 }}>
            Welcome Back
          </Typography>
          <Typography variant="subtitle1" color="textSecondary" gutterBottom align="center" sx={{ mb: 4 }}>
            Sign in to access your portal
          </Typography>
          
          <Box component="form" onSubmit={handleLogin}>
            <TextField 
              fullWidth 
              label="Email Address" 
              name="username" 
              type="email" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
              sx={{ mb: 2 }}
            />
            <TextField 
              fullWidth 
              label="Password" 
              name="password" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              sx={{ mb: 3 }}
            />
            
            <Button 
              fullWidth 
              type="submit" 
              variant="contained" 
              color="primary" 
              size="large" 
              disabled={loading} 
              sx={{ mb: 3, height: 52, fontSize: '1.1rem', boxShadow: '0 8px 16px rgba(13, 71, 161, 0.3)' }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Log In'}
            </Button>
            
            <Typography variant="body1" color="textSecondary" align="center">
              Don't have an account? <Link to="/register" style={{ color: '#0d47a1', textDecoration: 'none', fontWeight: 'bold' }}>Sign Up</Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
