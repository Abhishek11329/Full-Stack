import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Button, Dialog, DialogTitle, DialogContent, TextField, Chip } from '@mui/material';
import Sidebar from '../components/Sidebar';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import api from '../services/api.service';
import toast from 'react-hot-toast';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useColorMode } from '../theme/ThemeContext';

const locales = {
  'en-US': enUS,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const { mode } = useColorMode();
  
  const [openRecord, setOpenRecord] = useState(false);
  const [recordForm, setRecordForm] = useState({ appointmentId: '', diagnosis: '', prescription: '', notes: '' });

  const fetchData = async () => {
    try {
      const res = await api.get('/doctors/appointments');
      setAppointments(res.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load appointments');
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/doctors/appointments/${id}/status?status=${status}`);
      toast.success('Status updated');
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error('Failed to update status');
    }
  };

  const handleCreateRecord = async (e) => {
    e.preventDefault();
    try {
      await api.post('/doctors/records', recordForm);
      toast.success('Medical record saved successfully!');
      setOpenRecord(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save record');
    }
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/doctor' },
  ];

  // Convert string times like "09:00 AM" into standard JS Date objects.
  const parseEventDate = (dateStr, timeStr) => {
    // Basic conversion logic to adapt string "2026-04-20" and "09:00 AM" to Date
    const baseDate = new Date(dateStr);
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':');
    hours = parseInt(hours);
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    baseDate.setHours(hours, parseInt(minutes));
    return baseDate;
  };

  const myEventsList = appointments.map(appt => {
     const startDate = parseEventDate(appt.appointmentDate, appt.timeSlot);
     // Assuming 1 hr appointments default
     const endDate = new Date(startDate.getTime() + 60*60*1000); 
     return {
       id: appt.id,
       title: `${appt.patient.name} (${appt.status})`,
       start: startDate,
       end: endDate,
       resource: appt
     }
  });

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar menuItems={menuItems} />
      <Box component="main" sx={{ flexGrow: 1, p: 3, transition: 'background-color 0.3s' }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
          Doctor's Schedule
        </Typography>

        <Card elevation={2} sx={{ mb: 4, mt: 3, p: 2 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>Availability Calendar</Typography>
          <Box sx={{ height: 500, '.rbc-calendar': { 
            bgcolor: mode === 'dark' ? '#1e1e1e' : '#fff',
            color: mode === 'dark' ? '#fff' : '#000',
            border: 'none',
          }, '.rbc-toolbar button': {
             color: mode === 'dark' ? '#fff' : '#000',
          }, '.rbc-event': {
             bgcolor: '#00bfa5'
          } }}>
            <Calendar
              localizer={localizer}
              events={myEventsList}
              startAccessor="start"
              endAccessor="end"
              style={{ height: '100%' }}
              views={['month', 'week', 'day']}
              defaultView="week"
            />
          </Box>
        </Card>

        <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mt: 4 }}>Pending & Confirmed Appointments</Typography>
        {appointments.filter(a => a.status !== 'COMPLETED' && a.status !== 'CANCELLED').length === 0 ? <Typography>No pending appointments found.</Typography> : 
          <Grid container spacing={2}>
            {appointments.filter(a => a.status !== 'COMPLETED' && a.status !== 'CANCELLED').map(appt => (
              <Grid item xs={12} md={6} key={appt.id}>
                <Card elevation={2}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6" fontWeight="bold">{appt.patient.name}</Typography>
                      <Chip 
                        label={appt.status} 
                        color={appt.status === 'PENDING' ? 'warning' : 'info'} 
                        size="small" 
                      />
                    </Box>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>{appt.appointmentDate} at {appt.timeSlot}</Typography>
                    
                    {appt.status === 'PENDING' && (
                      <Box display="flex" gap={1}>
                        <Button variant="contained" color="success" size="small" onClick={() => updateStatus(appt.id, 'CONFIRMED')}>Confirm</Button>
                        <Button variant="outlined" color="error" size="small" onClick={() => updateStatus(appt.id, 'CANCELLED')}>Cancel</Button>
                      </Box>
                    )}
                    
                    {appt.status === 'CONFIRMED' && (
                      <Button 
                        variant="contained" 
                        color="primary" 
                        size="small" 
                        startIcon={<CheckCircleIcon />}
                        onClick={() => {
                          setRecordForm({ ...recordForm, appointmentId: appt.id });
                          setOpenRecord(true);
                        }}
                      >
                        Complete Session & Add Record
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        }
      </Box>

      <Dialog open={openRecord} onClose={() => setOpenRecord(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Complete Session: Add Medical Record</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleCreateRecord} sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField 
              label="Diagnosis" 
              value={recordForm.diagnosis} 
              onChange={e => setRecordForm({...recordForm, diagnosis: e.target.value})}
              required
            />
            <TextField 
              label="Prescription" 
              multiline rows={3}
              value={recordForm.prescription}
              onChange={e => setRecordForm({...recordForm, prescription: e.target.value})}
              required
            />
            <TextField 
              label="Additional Notes (Optional)" 
              multiline rows={2}
              value={recordForm.notes} 
              onChange={e => setRecordForm({...recordForm, notes: e.target.value})}
            />
            <Button type="submit" variant="contained" size="large" sx={{ mt: 2 }}>Save Record</Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default DoctorDashboard;
