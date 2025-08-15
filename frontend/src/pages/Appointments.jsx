import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import AppointmentForm from '../components/AppointmentForm';
import AppointmentList from '../components/AppointmentList';
import { useAuth } from '../context/AuthContext';

// Appointments list page
const Appointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [editingAppointment, setEditingAppointment] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axiosInstance.get('/api/appointments', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setAppointments(response.data);
      } catch (error) {
        alert('Failed to fetch appointments.');
      }
    };

    fetchAppointments();
  }, [user]);

  return (
    <div className="container mx-auto p-6">
      <AppointmentForm
        appointments={appointments}
        setAppointments={setAppointments}
        editingAppointment={editingAppointment}
        setEditingAppointment={setEditingAppointment}
      />
      <AppointmentList appointments={appointments} setAppointments={setAppointments} setEditingAppointment={setEditingAppointment} />
    </div>
  );
};

export default Appointments;
