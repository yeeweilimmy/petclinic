import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const AppointmentList = ({ appointments, setAppointments, setEditingAppointment }) => {
  const { user } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);

  const handleDelete = async () => {
    if (appointmentToDelete) {
      try {
        await axiosInstance.delete(`/api/appointments/${appointmentToDelete}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setAppointments(appointments.filter((appointment) => appointment._id !== appointmentToDelete));
        setShowDeleteModal(false);
        setAppointmentToDelete(null);
      } catch (error) {
        alert('Failed to delete appointment.');
      }
    }
  };

  const confirmDelete = (appointmentId) => {
    setAppointmentToDelete(appointmentId);
    setShowDeleteModal(true);
  };

  return (
    <div className="bg-white rounded-2xl shadow-large p-8 border border-lightBlue/20">
      <h1 className="text-2xl font-bold text-darkNavy mb-6">Appointments List</h1>
      {appointments.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No appointments scheduled yet.</p>
          <p className="text-gray-400 text-sm mt-2">Create your first appointment above to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div key={appointment._id} className="bg-lightBlue/5 border border-lightBlue/20 rounded-xl p-6 hover:shadow-medium transition-all duration-200">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h2 className="font-bold text-xl text-darkNavy mb-2">{appointment.title}</h2>
                  {appointment.description && (
                    <p className="text-gray-700 mb-3">{appointment.description}</p>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => setEditingAppointment(appointment)}
                    className="bg-primaryBlue text-cream px-4 py-2 rounded-lg font-medium hover:bg-darkNavy hover:shadow-medium transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => confirmDelete(appointment._id)}
                    className="bg-red text-white px-4 py-2 rounded-lg font-medium hover:bg-red/80 hover:shadow-medium transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Pet Information */}
              {(appointment.petName || appointment.petId) && (
                <div className="bg-primaryBlue/10 border border-primaryBlue/20 rounded-lg p-3 mb-3">
                  <span className="text-primaryBlue font-medium">
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

              <div className="bg-cream/50 border border-cream rounded-lg p-3">
                <p className="text-darkNavy font-medium">
                  <span className="text-gray-600">Scheduled:</span> {new Date(appointment.deadline).toLocaleDateString()} at{" "}
                  {new Date(appointment.deadline).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white max-w-md w-full mx-4 rounded-2xl shadow-large border border-lightBlue/20">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-lightBlue/20">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-red/10 flex items-center justify-center">
                  <span className="text-lg font-bold text-red">⚠</span>
                </div>
                <h3 className="text-lg font-semibold text-darkNavy">Confirm Delete</h3>
              </div>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-darkNavy hover:text-red text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-darkNavy leading-relaxed">
                Are you sure you want to delete this appointment? This action cannot be undone.
              </p>
            </div>

            {/* Footer */}
            <div className="px-6 pb-6 flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-xl hover:bg-gray-600 transition-colors duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-red text-white py-3 px-4 rounded-xl hover:bg-red/80 transition-colors duration-200 font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentList;