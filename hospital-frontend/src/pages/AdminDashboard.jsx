import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Button } from '@mui/material';
import Sidebar from '../components/Sidebar';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PeopleIcon from '@mui/icons-material/People';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import api from '../services/api.service';
import toast from 'react-hot-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StatCard = ({ title, value, icon, color }) => (
  <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
    <Box sx={{ position: 'absolute', top: -10, right: -10, opacity: 0.1, color: color }}>
      {React.cloneElement(icon, { sx: { fontSize: 100 } })}
    </Box>
    <CardContent sx={{ flexGrow: 1, zIndex: 1 }}>
      <Typography color="textSecondary" variant="h6" gutterBottom>{title}</Typography>
      <Typography variant="h3" fontWeight="bold" color="textPrimary">{value}</Typography>
    </CardContent>
  </Card>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    todaysAppointments: 0
  });

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/statistics');
      setStats(res.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load statistics');
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchStats();
  }, []);

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
  ];

  const chartData = [
    { name: 'Patients', count: stats.totalPatients },
    { name: 'Doctors', count: stats.totalDoctors },
    { name: 'Appointments', count: stats.totalAppointments },
    { name: 'Today\'s Appts', count: stats.todaysAppointments },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar menuItems={menuItems} />
      <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
          Admin Dashboard
        </Typography>

        <Grid container spacing={3} sx={{ my: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Total Patients" value={stats.totalPatients} icon={<PeopleIcon />} color="#0d47a1" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Total Doctors" value={stats.totalDoctors} icon={<LocalHospitalIcon />} color="#00bfa5" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="All Appointments" value={stats.totalAppointments} icon={<EventAvailableIcon />} color="#f57c00" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Today's Bookings" value={stats.todaysAppointments} icon={<EventAvailableIcon />} color="#d32f2f" />
          </Grid>
        </Grid>

        <Card elevation={2} sx={{ p: 2, mt: 4 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">System Overview Overview</Typography>
          <Box sx={{ height: 400, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} contentStyle={{ borderRadius: 8 }} />
                <Bar dataKey="count" fill="#0d47a1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
