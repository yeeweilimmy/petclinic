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
      const response = await axiosInstance.get('/api/pet-profiles', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
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
    // Add the new pet to local pets list
    setPets(prevPets => [...prevPets, pet]);

    // Trigger a custom event to notify other components about the new pet
    window.dispatchEvent(new CustomEvent('petCreated', { detail: pet }));
  };

  const handleCreateNewPet = async (petData) => {
    try {
      const response = await axiosInstance.post('/api/pet-profiles', petData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
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

  // Get filtered pets for search
  const filteredPets = pets.filter(pet =>
    pet.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pet.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pet.breed.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-large p-8 border border-lightBlue/20">
        <h1 className="text-2xl font-bold text-darkNavy mb-6">
          {editingAppointment ? 'Edit Appointment' : 'Create Appointment'}
        </h1>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-darkNavy mb-2">
              Reason for appointment
            </label>
            <input
              type="text"
              placeholder="Enter reason for appointment"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border-2 border-lightBlue/30 rounded-xl focus:border-primaryBlue focus:ring-0 outline-none transition-colors duration-200 text-darkNavy placeholder-gray-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-darkNavy mb-2">
              Brief description
            </label>
            <input
              type="text"
              placeholder="Enter brief description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border-2 border-lightBlue/30 rounded-xl focus:border-primaryBlue focus:ring-0 outline-none transition-colors duration-200 text-darkNavy placeholder-gray-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-darkNavy mb-2">
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-3 border-2 border-lightBlue/30 rounded-xl focus:border-primaryBlue focus:ring-0 outline-none transition-colors duration-200 text-darkNavy"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-darkNavy mb-2">
                Time
              </label>
              <select
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-4 py-3 border-2 border-lightBlue/30 rounded-xl focus:border-primaryBlue focus:ring-0 outline-none transition-colors duration-200 text-darkNavy"
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
          </div>

          {/* Pet Selection Section */}
          <div>
            <label className="block text-sm font-semibold text-darkNavy mb-2">Add patient details:</label>
            <div className="flex gap-3 mb-4">
              <button
                type="button"
                onClick={() => {
                  setShowPetSearch(true);
                  fetchPets();
                }}
                className="bg-primaryBlue text-cream px-4 py-2 rounded-xl font-medium hover:bg-darkNavy hover:shadow-medium transition-all duration-200"
              >
                Search Pet
              </button>
              <button
                type="button"
                onClick={() => setShowPetForm(true)}
                className="bg-darkNavy text-cream px-4 py-2 rounded-xl font-medium hover:bg-primaryBlue hover:shadow-medium transition-all duration-200"
              >
                Add New Pet
              </button>
            </div>
            {formData.petName && (
              <div className="bg-lightBlue/20 border border-primaryBlue/30 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <span className="text-darkNavy font-medium">
                    <strong>Selected Pet:</strong> ({formData.petName}, {formData.petAge}, {formData.petBreed})
                  </span>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, petId: '', petName: '', petAge: '', petBreed: '' })}
                    className="text-red-500 hover:text-red-700 font-medium transition-colors duration-200"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-primaryBlue text-cream font-semibold rounded-xl hover:bg-darkNavy hover:shadow-medium transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            {editingAppointment ? 'Update Appointment' : 'Create Appointment'}
          </button>
        </div>
      </form>

      {/* Pet Search Modal */}
      {showPetSearch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-large p-6 w-full max-w-md max-h-96 overflow-hidden border border-lightBlue/20">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-darkNavy">Search Pets</h3>
              <button
                onClick={() => setShowPetSearch(false)}
                className="text-gray-500 hover:text-gray-700 text-xl font-bold"
              >
                ×
              </button>
            </div>

            <input
              type="text"
              placeholder="Search pets by name or breed..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border-2 border-lightBlue/30 rounded-xl focus:border-primaryBlue focus:ring-0 outline-none transition-colors duration-200 text-darkNavy placeholder-gray-400 mb-4"
            />

            <div className="max-h-60 overflow-y-auto">
              {loading ? (
                <p className="text-center text-gray-500 py-4">Loading pets...</p>
              ) : (
                (() => {
                  return filteredPets.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">No pets found</p>
                  ) : (
                    filteredPets.map(pet => (
                      <div
                        key={pet._id}
                        onClick={() => handleSelectPet(pet)}
                        className="p-3 border-2 border-lightBlue/20 rounded-xl mb-2 cursor-pointer hover:bg-lightBlue/10 hover:border-primaryBlue/40 transition-all duration-200"
                      >
                        <div className="font-semibold text-darkNavy">({pet.firstName} {pet.lastName}, {pet.age}, {pet.breed})</div>
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
          <div className="bg-white rounded-2xl shadow-large p-6 w-full max-w-md border border-lightBlue/20">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-darkNavy">Add New Pet</h3>
              <button
                onClick={() => setShowPetForm(false)}
                className="text-gray-500 hover:text-gray-700 text-xl font-bold"
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-darkNavy mb-2">First Name</label>
          <input
            type="text"
            placeholder="Pet First Name"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            className="w-full px-4 py-3 border-2 border-lightBlue/30 rounded-xl focus:border-primaryBlue focus:ring-0 outline-none transition-colors duration-200 text-darkNavy placeholder-gray-400"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-darkNavy mb-2">Last Name</label>
          <input
            type="text"
            placeholder="Pet Last Name"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            className="w-full px-4 py-3 border-2 border-lightBlue/30 rounded-xl focus:border-primaryBlue focus:ring-0 outline-none transition-colors duration-200 text-darkNavy placeholder-gray-400"
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-darkNavy mb-2">Age</label>
          <input
            type="number"
            placeholder="Age"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            className="w-full px-4 py-3 border-2 border-lightBlue/30 rounded-xl focus:border-primaryBlue focus:ring-0 outline-none transition-colors duration-200 text-darkNavy placeholder-gray-400"
            min="0"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-darkNavy mb-2">Breed</label>
          <input
            type="text"
            placeholder="Breed"
            value={formData.breed}
            onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
            className="w-full px-4 py-3 border-2 border-lightBlue/30 rounded-xl focus:border-primaryBlue focus:ring-0 outline-none transition-colors duration-200 text-darkNavy placeholder-gray-400"
            required
          />
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="flex-1 bg-primaryBlue text-cream py-3 px-4 rounded-xl font-semibold hover:bg-darkNavy hover:shadow-medium transition-all duration-200"
        >
          Create Pet
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-xl font-semibold hover:bg-gray-600 hover:shadow-medium transition-all duration-200"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AppointmentForm;