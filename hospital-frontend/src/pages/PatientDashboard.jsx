import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Button, Dialog, DialogTitle, DialogContent, TextField, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import Sidebar from '../components/Sidebar';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventIcon from '@mui/icons-material/Event';
import DescriptionIcon from '@mui/icons-material/Description';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import api from '../services/api.service';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const PatientDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [records, setRecords] = useState([]);
  
  const [openBook, setOpenBook] = useState(false);
  const [bookForm, setBookForm] = useState({ doctorId: '', appointmentDate: '', timeSlot: '' });

  const fetchData = async () => {
    try {
      const [docRes, apptRes, recRes] = await Promise.all([
        api.get('/patients/doctors'),
        api.get('/patients/appointments'),
        api.get('/patients/records')
      ]);
      setDoctors(docRes.data);
      setAppointments(apptRes.data);
      setRecords(recRes.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load dashboard data');
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/patient' },
  ];

  const handleBook = async (e) => {
    e.preventDefault();
    try {
      await api.post('/patients/appointments', bookForm);
      toast.success('Appointment booked successfully!');
      setOpenBook(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to book');
    }
  };

  const generatePDF = (record) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(13, 71, 161); // Primary Blue
    doc.text("HospitalApp Medical Prescription", 105, 20, null, null, "center");
    
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Date of Visit: ${record.visitDate}`, 20, 35);
    
    // Details Section
    doc.autoTable({
      startY: 45,
      theme: 'grid',
      headStyles: { fillColor: [13, 71, 161] },
      body: [
        ['Patient Name', record.patient.name],
        ['Attending Doctor', `Dr. ${record.doctor.name} (${record.doctor.specialty})`],
        ['Diagnosis', record.diagnosis],
      ],
    });

    // Prescription Box
    const finalY = doc.lastAutoTable.finalY || 45;
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("Prescription:", 20, finalY + 15);
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "italic");
    const splitPrescription = doc.splitTextToSize(record.prescription, 170);
    doc.text(splitPrescription, 20, finalY + 25);
    
    // Notes
    if(record.notes) {
       doc.setFont("helvetica", "normal");
       doc.text("Doctor's Notes: " + record.notes, 20, finalY + 25 + (splitPrescription.length * 7) + 10);
    }
    
    doc.save(`Prescription_${record.id}_${record.visitDate}.pdf`);
    toast.success("PDF Downloaded successfully!");
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar menuItems={menuItems} />
      <Box component="main" sx={{ flexGrow: 1, p: 3, minHeight: '100vh', transition: 'background-color 0.3s' }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
          Patient Dashboard
        </Typography>
        
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card elevation={2} sx={{ transition: '0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 } }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>Total Appointments</Typography>
                <Typography variant="h3">{appointments.length}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card elevation={2} sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 } }}>
                <Button variant="contained" color="secondary" size="large" onClick={() => setOpenBook(true)} startIcon={<EventIcon />}>
                  Book Appointment
                </Button>
            </Card>
          </Grid>
        </Grid>

        <Typography variant="h6" gutterBottom fontWeight="bold">My Appointments</Typography>
        {appointments.length === 0 ? <Typography paragraph>No appointments found.</Typography> : 
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {appointments.map(appt => (
              <Grid item xs={12} sm={6} md={4} key={appt.id}>
                <Card elevation={1} sx={{ transition: '0.2s', '&:hover': { boxShadow: 4, bgcolor: 'background.default' } }}>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold">Dr. {appt.doctor.name}</Typography>
                    <Typography variant="body2" color="textSecondary">{appt.doctor.specialty} • ${appt.doctor.consultationFee}/Session</Typography>
                    <Typography variant="body1" sx={{ mt: 1, fontWeight: 500 }}>
                      <EventIcon sx={{ fontSize: 16, verticalAlign: 'text-bottom', mr: 0.5 }} color="primary" /> 
                      {appt.appointmentDate} at {appt.timeSlot}
                    </Typography>
                    <Typography variant="caption" sx={{ display: 'inline-block', mt: 1.5, p: 0.5, px: 1, borderRadius: 1, fontWeight: 'bold', bgcolor: appt.status === 'PENDING' ? '#fff3e0' : (appt.status === 'COMPLETED' ? '#e8f5e9' : '#ffebee'), color: appt.status === 'PENDING' ? '#e65100' : (appt.status === 'COMPLETED' ? '#2e7d32' : '#c62828') }}>
                      {appt.status}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        }

        <Typography variant="h6" gutterBottom fontWeight="bold">Available Specialists</Typography>
        {doctors.length === 0 ? <Typography paragraph>No doctors actively available.</Typography> : 
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {doctors.map(doc => (
              <Grid item xs={12} sm={6} md={3} key={doc.id}>
                <Card elevation={2} sx={{ transition: 'all 0.3s', borderTop: '4px solid #0d47a1', '&:hover': { transform: 'scale(1.02)', boxShadow: 6 } }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" color="primary" fontWeight="bold">Dr. {doc.name}</Typography>
                    <Typography variant="subtitle2" color="secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1, my: 1 }}>{doc.specialty}</Typography>
                    <Typography variant="body2" color="textSecondary">{doc.experience} Years Experience</Typography>
                    <Typography variant="h5" fontWeight="bold" sx={{ mt: 2 }}>${doc.consultationFee}</Typography>
                    <Typography variant="caption" color="textSecondary">per consultation</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        }

        <Typography variant="h6" gutterBottom fontWeight="bold">Medical Records & Prescriptions</Typography>
        {records.length === 0 ? <Typography>No records found.</Typography> : 
          <TableContainer component={Paper} elevation={2} sx={{ transition: '0.3s', '&:hover': { boxShadow: 4 } }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'rgba(0,0,0,0.04)' }}>
                  <TableCell>Date</TableCell>
                  <TableCell>Doctor</TableCell>
                  <TableCell>Diagnosis</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {records.map((rec) => (
                  <TableRow key={rec.id} hover>
                    <TableCell>{rec.visitDate}</TableCell>
                    <TableCell>Dr. {rec.doctor.name}</TableCell>
                    <TableCell>{rec.diagnosis}</TableCell>
                    <TableCell>
                      <Button variant="outlined" startIcon={<PictureAsPdfIcon />} onClick={() => generatePDF(rec)}>
                        Download PDF
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        }

      </Box>

      <Dialog open={openBook} onClose={() => setOpenBook(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold', color: 'primary.main' }}>Book New Appointment</DialogTitle>
        <DialogContent dividers>
          <Box component="form" onSubmit={handleBook} sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField 
              select 
              fullWidth
              label="Select Doctor" 
              value={bookForm.doctorId} 
              onChange={e => setBookForm({...bookForm, doctorId: e.target.value})}
              required
            >
              {doctors.map(doc => (
                <MenuItem key={doc.id} value={doc.id}>Dr. {doc.name} ({doc.specialty}) - ${doc.consultationFee}</MenuItem>
              ))}
            </TextField>
            <TextField 
              type="date" 
              fullWidth
              label="Select Appointment Date" 
              InputLabelProps={{ shrink: true }}
              value={bookForm.appointmentDate}
              onChange={e => setBookForm({...bookForm, appointmentDate: e.target.value})}
              required
            />
            <TextField 
              select 
              fullWidth
              label="Select Time Slot" 
              value={bookForm.timeSlot} 
              onChange={e => setBookForm({...bookForm, timeSlot: e.target.value})}
              required
            >
              <MenuItem value="09:00 AM">09:00 AM</MenuItem>
              <MenuItem value="10:00 AM">10:00 AM</MenuItem>
              <MenuItem value="11:30 AM">11:30 AM</MenuItem>
              <MenuItem value="02:00 PM">02:00 PM</MenuItem>
              <MenuItem value="04:00 PM">04:00 PM</MenuItem>
            </TextField>
            <Button type="submit" variant="contained" size="large" sx={{ mt: 1 }}>Confirm Booking</Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default PatientDashboard;
