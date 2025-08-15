import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const AppointmentForm = ({ appointments, setAppointments, editingAppointment, setEditingAppointment }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    petId: '',
    petName: '',
    petAge: '',
    petBreed: ''
  });
  const [showPetSearch, setShowPetSearch] = useState(false);
  const [showPetForm, setShowPetForm] = useState(false);
  const [pets, setPets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingAppointment) {
      const deadline = editingAppointment.deadline ? new Date(editingAppointment.deadline) : null;
      setFormData({
        title: editingAppointment.title,
        description: editingAppointment.description,
        date: deadline ? deadline.toISOString().slice(0, 10) : '',
        time: deadline ? deadline.toISOString().slice(11, 16) : '',
        petId: editingAppointment.petId || '',
        petName: editingAppointment.petName || '',
        petAge: editingAppointment.petAge || '',
        petBreed: editingAppointment.petBreed || ''
      });
    } else {
      setFormData({ title: '', description: '', date: '', time: '', petId: '', petName: '', petAge: '', petBreed: '' });
    }
  }, [editingAppointment]);

  const fetchPets = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/api/pet-profiles');
      setPets(response.data);
    } catch (error) {
      console.error('Failed to fetch pets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPet = (pet) => {
    setFormData({
      ...formData,
      petId: pet._id,
      petName: `${pet.firstName} ${pet.lastName}`,
      petAge: pet.age,
      petBreed: pet.breed
    });
    setShowPetSearch(false);
  };

  const handlePetCreated = (pet) => {
    setFormData({
      ...formData,
      petId: pet._id,
      petName: `${pet.firstName} ${pet.lastName}`,
      petAge: pet.age,
      petBreed: pet.breed
    });
    setShowPetForm(false);
    fetchPets();
  };

  const handleCreateNewPet = async (petData) => {
    try {
      const response = await axiosInstance.post('/api/pet-profiles', petData);
      handlePetCreated(response.data);
    } catch (error) {
      alert('Failed to create pet profile.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const deadline = formData.date && formData.time
      ? new Date(`${formData.date}T${formData.time}`).toISOString()
      : '';

    const payload = {
      title: formData.title,
      description: formData.description,
      deadline,
      petId: formData.petId || null,
      petName: formData.petName || null,
      petAge: formData.petAge || null,
      petBreed: formData.petBreed || null
    };

    try {
      if (editingAppointment) {
        const response = await axiosInstance.put(`/api/appointments/${editingAppointment._id}`, payload, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setAppointments(appointments.map((appointment) =>
          appointment._id === response.data._id ? response.data : appointment
        ));
      } else {
        const response = await axiosInstance.post('/api/appointments', payload, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setAppointments([...appointments, response.data]);
      }
      setEditingAppointment(null);
      setFormData({ title: '', description: '', date: '', time: '', petId: '', petName: '', petAge: '', petBreed: '' });
    } catch (error) {
      alert('Failed to save appointment.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
        <h1 className="text-2xl font-bold mb-4">
          {editingAppointment ? 'Edit Appointment' : 'Create Appointment'}
        </h1>

        <input
          type="text"
          placeholder="Reason for appointment"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
          required
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
            required
          />
          <select
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            className="w-1/2 p-2 border rounded"
            required
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

        {/* Pet Selection Section */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Add patient details:</label>
          <div className="flex gap-2 mb-2">
            <button
              type="button"
              onClick={() => {
                setShowPetSearch(true);
                fetchPets();
              }}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Search Pet
            </button>
            <button
              type="button"
              onClick={() => setShowPetForm(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add New Pet
            </button>
          </div>
          {formData.petName && (
            <div className="bg-green-50 border border-green-200 rounded p-3 mb-2">
              <div className="flex justify-between items-center">
                <span className="text-green-800">
                  <strong>Selected Pet:</strong> ({formData.petName}, {formData.petAge}, {formData.petBreed})
                </span>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, petId: '', petName: '', petAge: '', petBreed: '' })}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          )}
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
          {editingAppointment ? 'Update Appointment' : 'Create Appointment'}
        </button>
      </form>

      {/* Pet Search Modal */}
      {showPetSearch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-96 overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Search Pets</h3>
              <button
                onClick={() => setShowPetSearch(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            </div>

            <input
              type="text"
              placeholder="Search pets by name or breed..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            />

            <div className="max-h-60 overflow-y-auto">
              {loading ? (
                <p className="text-center text-gray-500">Loading pets...</p>
              ) : (
                (() => {
                  const filteredPets = pets.filter(pet =>
                    pet.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    pet.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    pet.breed.toLowerCase().includes(searchTerm.toLowerCase())
                  );

                  return filteredPets.length === 0 ? (
                    <p className="text-center text-gray-500">No pets found</p>
                  ) : (
                    filteredPets.map(pet => (
                      <div
                        key={pet._id}
                        onClick={() => handleSelectPet(pet)}
                        className="p-3 border rounded mb-2 cursor-pointer hover:bg-blue-50 transition-colors"
                      >
                        <div className="font-semibold">({pet.firstName} {pet.lastName}, {pet.age}, {pet.breed})</div>
                      </div>
                    ))
                  );
                })()
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add New Pet Modal */}
      {showPetForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add New Pet</h3>
              <button
                onClick={() => setShowPetForm(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            </div>

            <PetForm
              onPetCreated={handleCreateNewPet}
              onCancel={() => setShowPetForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Pet Form Component for Modal
const PetForm = ({ onPetCreated, onCancel }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    breed: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onPetCreated(formData);
    setFormData({ firstName: '', lastName: '', age: '', breed: '' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          placeholder="Pet First Name"
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          className="p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Pet Last Name"
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          className="p-2 border rounded"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <input
          type="number"
          placeholder="Age"
          value={formData.age}
          onChange={(e) => setFormData({ ...formData, age: e.target.value })}
          className="p-2 border rounded"
          min="0"
          required
        />
        <input
          type="text"
          placeholder="Breed"
          value={formData.breed}
          onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
          className="p-2 border rounded"
          required
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          Create Pet
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AppointmentForm;