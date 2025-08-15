import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const AppointmentList = ({ appointments, setAppointments, setEditingAppointment }) => {
  const { user } = useAuth();

  const handleDelete = async (appointmentId) => {
    try {
      await axiosInstance.delete(`/api/appointments/${appointmentId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setAppointments(appointments.filter((appointment) => appointment._id !== appointmentId));
    } catch (error) {
      alert('Failed to delete appointment.');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Appointments list</h1>
      {appointments.map((appointment) => (
        <div key={appointment._id} className="bg-gray-100 p-4 mb-4 rounded shadow">
          <h2 className="font-bold">{appointment.title}</h2>
          <p>{appointment.description}</p>
          <p className="text-sm text-gray-500">
            Scheduled: {new Date(appointment.deadline).toLocaleDateString()}{" "}
            {new Date(appointment.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
          </p>
          <div className="mt-2">
            {/* edit button */}
            <button
              onClick={() => setEditingAppointment(appointment)}
              className="mr-2 bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Edit
            </button>
            {/* delete button */}
            <button
              onClick={() => handleDelete(appointment._id)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AppointmentList;
