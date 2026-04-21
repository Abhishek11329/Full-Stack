import React, { useState } from 'react';
import { Box, Paper, TextField, Button, Typography, Container, CircularProgress, Grid, FormControl, InputLabel, Select, MenuItem, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/auth.service';
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [role, setRole] = useState('PATIENT');
  
  const [formData, setFormData] = useState({
    username: '', password: '', name: '', phone: '',
    age: '', gender: '', address: '', bloodGroup: '',
    specialty: '', experience: '', consultationFee: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.register({ ...formData, role });
      toast.success('Registration successful! Please log in.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed.');
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
      py: 5
    }}>
      <Container maxWidth="md">
        <Paper elevation={24} sx={{ 
          p: { xs: 3, md: 5 }, 
          borderRadius: 4,
          bgcolor: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.5)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
          }
        }}>
          <Typography variant="h4" color="primary" gutterBottom align="center" fontWeight="900" sx={{ mt: 1 }}>
            Create an Account
          </Typography>
          <Typography variant="subtitle1" color="textSecondary" gutterBottom align="center" sx={{ mb: 4 }}>
            Join our secure hospital management network
          </Typography>
          
          <Box sx={{ mb: 4 }}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Account Type</InputLabel>
              <Select value={role} label="Account Type" onChange={(e) => setRole(e.target.value)} sx={{ fontWeight: 'bold' }}>
                <MenuItem value="PATIENT">Register as Patient</MenuItem>
                <MenuItem value="DOCTOR">Register as Doctor</MenuItem>
                <MenuItem value="ADMIN">Register as Administrator</MenuItem>
              </Select>
            </FormControl>
          </Box>
          
          <Box component="form" onSubmit={handleRegister}>
            <Grid container spacing={2}>
              {/* Common Fields */}
              <Grid item xs={12} sm={6}><TextField fullWidth label="Email Address" name="username" type="email" required onChange={handleChange} /></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="Password" name="password" type="password" required onChange={handleChange} /></Grid>
              
              {role !== 'ADMIN' && (
                <>
                  <Grid item xs={12} sm={6}><TextField fullWidth label="Full Name" name="name" required onChange={handleChange} /></Grid>
                  <Grid item xs={12} sm={6}><TextField fullWidth label="Phone Number" name="phone" required onChange={handleChange} /></Grid>
                </>
              )}
              
              {/* Patient Fields */}
              {role === 'PATIENT' && (
                <>
                  <Grid item xs={12} sm={6}><TextField fullWidth label="Age" name="age" type="number" required onChange={handleChange} sx={{ transition: '0.3s', '&:hover': { transform: 'translateY(-2px)' } }}/></Grid>
                  <Grid item xs={12} sm={6}><TextField fullWidth label="Gender" name="gender" required onChange={handleChange} sx={{ transition: '0.3s', '&:hover': { transform: 'translateY(-2px)' } }}/></Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom sx={{ fontWeight: 'bold', mb: 1 }}>Select Blood Group *</Typography>
                    <ToggleButtonGroup
                      value={formData.bloodGroup}
                      exclusive
                      onChange={(e, newGroup) => {
                        if (newGroup !== null) {
                          setFormData({ ...formData, bloodGroup: newGroup });
                        }
                      }}
                      sx={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: 1.5, 
                        '& .MuiToggleButtonGroup-grouped': { 
                          border: '2px solid rgba(0, 191, 165, 0.2) !important', 
                          borderRadius: '12px !important', 
                          margin: '0 !important',
                          bgcolor: 'rgba(255,255,255,0.7)', 
                          flex: '1 1 calc(25% - 12px)',
                          transition: 'all 0.2s',
                          '&:hover': {
                             bgcolor: 'rgba(0, 191, 165, 0.1)',
                             transform: 'translateY(-2px)'
                          },
                          '&.Mui-selected': { 
                             bgcolor: '#00bfa5', 
                             color: 'white', 
                             border: '2px solid #00bfa5 !important',
                             boxShadow: '0 4px 10px rgba(0, 191, 165, 0.4)',
                             '&:hover': { bgcolor: '#009688' } 
                          } 
                        } 
                      }}
                    >
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                        <ToggleButton key={bg} value={bg} sx={{ py: 1.5, fontWeight: 'bold', fontSize: '1rem' }}>
                          {bg}
                        </ToggleButton>
                      ))}
                    </ToggleButtonGroup>
                  </Grid>
                  <Grid item xs={12}><TextField fullWidth label="Address" name="address" required multiline rows={2} onChange={handleChange} sx={{ mt: 1, transition: '0.3s', '&:hover': { transform: 'translateY(-2px)' } }}/></Grid>
                </>
              )}
              
              {/* Doctor Fields */}
              {role === 'DOCTOR' && (
                <>
                  <Grid item xs={12} sm={4}><TextField fullWidth label="Specialty" name="specialty" required onChange={handleChange} placeholder="e.g. Cardiology" /></Grid>
                  <Grid item xs={12} sm={4}><TextField fullWidth label="Experience (Yrs)" name="experience" type="number" required onChange={handleChange} /></Grid>
                  <Grid item xs={12} sm={4}><TextField fullWidth label="Consultation Fee ($)" name="consultationFee" type="number" required onChange={handleChange} /></Grid>
                </>
              )}
            </Grid>
            
            <Button fullWidth type="submit" variant="contained" color="secondary" size="large" disabled={loading || (role === 'PATIENT' && !formData.bloodGroup)} sx={{ mt: 4, mb: 3, height: 52, fontSize: '1.1rem', borderRadius: 2, transition: 'all 0.3s', '&:hover': { boxShadow: '0 8px 16px rgba(0, 191, 165, 0.4)', transform: 'translateY(-2px)' } }}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Complete Registration'}
            </Button>
            
            <Typography variant="body1" color="textSecondary" align="center">
              Already have an account? <Link to="/login" style={{ color: '#00bfa5', textDecoration: 'none', fontWeight: 'bold' }}>Log In</Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;
