import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import authService from './services/auth.service';
import { CustomThemeProvider } from './theme/ThemeContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientDashboard from './pages/PatientDashboard';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = authService.getCurrentUser();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !user.roles.some(role => allowedRoles.includes(role))) {
    if (user.roles.includes('ROLE_ADMIN')) return <Navigate to="/admin" replace />;
    if (user.roles.includes('ROLE_DOCTOR')) return <Navigate to="/doctor" replace />;
    return <Navigate to="/patient" replace />;
  }
  
  return children;
};

const App = () => {
  return (
    <CustomThemeProvider>
      <Toaster position="top-right" />
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/admin/*" element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/doctor/*" element={
            <ProtectedRoute allowedRoles={['ROLE_DOCTOR']}>
              <DoctorDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/patient/*" element={
            <ProtectedRoute allowedRoles={['ROLE_PATIENT']}>
              <PatientDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </CustomThemeProvider>
  );
};

export default App;
