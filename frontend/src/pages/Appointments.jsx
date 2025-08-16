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
    <div className="min-h-screen bg-gradient-to-br from-cream via-lightBlue to-primaryBlue">
      <div className="container mx-auto p-6">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-darkNavy mb-2">Appointments</h1>
          <p className="text-darkNavy opacity-70">Manage your pet's appointments</p>
        </div>

        <div className="max-w-6xl mx-auto space-y-8">
          <AppointmentForm
            appointments={appointments}
            setAppointments={setAppointments}
            editingAppointment={editingAppointment}
            setEditingAppointment={setEditingAppointment}
          />
          <AppointmentList
            appointments={appointments}
            setAppointments={setAppointments}
            setEditingAppointment={setEditingAppointment}
          />
        </div>
      </div>
    </div>
  );
};

export default Appointments;