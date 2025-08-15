import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const AppointmentForm = ({ appointments, setAppointments, editingAppointment, setEditingAppointment }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ title: '', description: '', date: '', time: '' });

  useEffect(() => {
    if (editingAppointment) {
      const deadline = editingAppointment.deadline ? new Date(editingAppointment.deadline) : null;
      setFormData({
        title: editingAppointment.title,
        description: editingAppointment.description,
        date: deadline ? deadline.toISOString().slice(0, 10) : '',
        time: deadline ? deadline.toISOString().slice(11, 16) : '',
      });
    } else {
      setFormData({ title: '', description: '', date: '', time: '' });
    }
  }, [editingAppointment]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Combine date and time into ISO string
    const deadline = formData.date && formData.time
      ? new Date(`${formData.date}T${formData.time}`).toISOString()
      : '';
    const payload = {
      title: formData.title,
      description: formData.description,
      deadline,
    };
    try {
      if (editingAppointment) {
        const response = await axiosInstance.put(`/api/appointments/${editingAppointment._id}`, payload, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setAppointments(appointments.map((appointment) => (appointment._id === response.data._id ? response.data : appointment)));
      } else {
        const response = await axiosInstance.post('/api/appointments', payload, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setAppointments([...appointments, response.data]);
      }
      setEditingAppointment(null);
      setFormData({ title: '', description: '', date: '', time: '' });
    } catch (error) {
      alert('Failed to save appointment.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-4">{editingAppointment ? 'Edit Appointment' : 'Create Appointment'}</h1>
      <input
        type="text"
        placeholder="Reason for appointment"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Brief description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <div className="flex mb-4 gap-2">
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="w-1/2 p-2 border rounded"
        />
        <select
          value={formData.time}
          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
          className="w-1/2 p-2 border rounded"
        >
          <option value="">Select time</option>
          {Array.from({ length: 24 }).map((_, hour) =>
            [0, 15, 30, 45].map((min) => {
              const h = hour.toString().padStart(2, '0');
              const m = min.toString().padStart(2, '0');
              const val = `${h}:${m}`;
              return (
                <option key={val} value={val}>
                  {val}
                </option>
              );
            })
          )}
        </select>
      </div>
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
        {editingAppointment ? 'Update Appointment' : 'Create appointment'}
      </button>
    </form>
  );
};

export default AppointmentForm;
