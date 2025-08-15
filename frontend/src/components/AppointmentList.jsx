import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const AppointmentList = ({ appointments, setAppointments, setEditingAppointment }) => {
  const { user } = useAuth();

  const handleDelete = async (appointmentId) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await axiosInstance.delete(`/api/appointments/${appointmentId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setAppointments(appointments.filter((appointment) => appointment._id !== appointmentId));
      } catch (error) {
        alert('Failed to delete appointment.');
      }
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Appointments List</h1>
      {appointments.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No appointments scheduled yet.</p>
      ) : (
        appointments.map((appointment) => (
          <div key={appointment._id} className="bg-gray-100 p-4 mb-4 rounded shadow">
            <h2 className="font-bold text-lg">{appointment.title}</h2>
            <p className="text-gray-700 mb-2">{appointment.description}</p>

            {/* Pet Information */}
            {(appointment.petName || appointment.petId) && (
              <div className="bg-blue-50 border border-blue-200 rounded p-2 mb-2">
                <span className="text-blue-800">
                  <strong>Patient:</strong> {
                    // If petId is populated (object), use that data
                    appointment.petId && typeof appointment.petId === 'object'
                      ? `(${appointment.petId.firstName} ${appointment.petId.lastName}, ${appointment.petId.age}, ${appointment.petId.breed})`
                      // Otherwise, use the stored pet data fields
                      : appointment.petAge && appointment.petBreed
                        ? `(${appointment.petName}, ${appointment.petAge}, ${appointment.petBreed})`
                        // Fallback to just the pet name
                        : appointment.petName
                  }
                </span>
              </div>
            )}

            <p className="text-sm text-gray-500 mb-3">
              <strong>Scheduled:</strong> {new Date(appointment.deadline).toLocaleDateString()} at{" "}
              {new Date(appointment.deadline).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              })}
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setEditingAppointment(appointment)}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(appointment._id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AppointmentList;