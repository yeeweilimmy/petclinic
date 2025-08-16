import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';
import PetProfileForm from '../components/PetProfileForm';
import PetProfileList from '../components/PetProfileList';

const PetProfile = () => {
  const { user } = useAuth();
  const [pets, setPets] = useState([]);
  const [editingPet, setEditingPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [petToDelete, setPetToDelete] = useState(null);

  useEffect(() => {
    const fetchPetProfiles = async () => {
      try {
        const response = await axiosInstance.get('/api/pet-profiles', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setPets(response.data);
      } catch (error) {
        alert('Failed to fetch pet profiles.');
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchPetProfiles();
    }

    // Listen for pets created in other components (like AppointmentForm)
    const handlePetCreated = (event) => {
      const newPet = event.detail;
      setPets(prevPets => {
        // Check if pet already exists to avoid duplicates
        const exists = prevPets.some(pet => pet._id === newPet._id);
        if (!exists) {
          return [...prevPets, newPet];
        }
        return prevPets;
      });
    };

    // Listen for pet updates from other components
    const handlePetUpdated = (event) => {
      const updatedPet = event.detail;
      setPets(prevPets =>
        prevPets.map(pet => pet._id === updatedPet._id ? updatedPet : pet)
      );
    };

    // Listen for pet deletions from other components
    const handlePetDeleted = (event) => {
      const deletedPetId = event.detail;
      setPets(prevPets => prevPets.filter(pet => pet._id !== deletedPetId));
    };

    window.addEventListener('petCreated', handlePetCreated);
    window.addEventListener('petUpdated', handlePetUpdated);
    window.addEventListener('petDeleted', handlePetDeleted);

    return () => {
      window.removeEventListener('petCreated', handlePetCreated);
      window.removeEventListener('petUpdated', handlePetUpdated);
      window.removeEventListener('petDeleted', handlePetDeleted);
    };
  }, [user?.token]);

  const handleAddPet = async (petData) => {
    try {
      const res = await axiosInstance.post('/api/pet-profiles', petData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const newPet = res.data;
      setPets(prevPets => [...prevPets, newPet]);

      // Dispatch event to notify other components
      window.dispatchEvent(new CustomEvent('petCreated', { detail: newPet }));
    } catch (error) {
      alert('Failed to create pet profile.');
    }
  };

  const handleUpdatePet = async (petData) => {
    try {
      const response = await axiosInstance.put(`/api/pet-profiles/${editingPet._id}`, petData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const updatedPet = response.data;
      setPets(pets.map((pet) =>
        pet._id === updatedPet._id ? updatedPet : pet
      ));

      // Dispatch event to notify other components
      window.dispatchEvent(new CustomEvent('petUpdated', { detail: updatedPet }));
    } catch (error) {
      alert('Failed to update pet profile.');
    }
  };

  const handleDeletePet = async () => {
    if (petToDelete) {
      try {
        await axiosInstance.delete(`/api/pet-profiles/${petToDelete}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setPets(pets.filter(pet => pet._id !== petToDelete));

        // Dispatch event to notify other components
        window.dispatchEvent(new CustomEvent('petDeleted', { detail: petToDelete }));

        setShowDeleteModal(false);
        setPetToDelete(null);
      } catch (error) {
        alert('Failed to delete pet profile.');
      }
    }
  };

  const confirmDelete = (petId) => {
    setPetToDelete(petId);
    setShowDeleteModal(true);
  };

  const handleSubmit = (petData) => {
    if (editingPet) {
      handleUpdatePet(petData);
    } else {
      handleAddPet(petData);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-lightBlue to-primaryBlue">
      <div className="container mx-auto p-6">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-darkNavy mb-2">Pet Profiles</h1>
          <p className="text-darkNavy opacity-70">Manage your pet's information</p>
        </div>

        <div className="max-w-6xl mx-auto space-y-8">
          <PetProfileForm
            onSubmit={handleSubmit}
            editingPet={editingPet}
            setEditingPet={setEditingPet}
          />
          <PetProfileList
            pets={pets}
            setEditingPet={setEditingPet}
            onDeletePet={confirmDelete}
            loading={loading}
          />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white max-w-md w-full mx-4 rounded-2xl shadow-large border border-lightBlue/20">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-lightBlue/20">
              <div className="flex items-center space-x-3">
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
                Are you sure you want to delete this pet profile? This will remove the pet from any associated appointments.
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
                onClick={handleDeletePet}
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

export default PetProfile;