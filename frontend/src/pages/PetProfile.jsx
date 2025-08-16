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

  useEffect(() => {
    fetchPetProfiles();

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
  }, [user]);

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

  const handleDeletePet = async (petId) => {
    if (window.confirm('Are you sure you want to delete this pet profile? This will remove the pet from any associated appointments.')) {
      try {
        await axiosInstance.delete(`/api/pet-profiles/${petId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setPets(pets.filter(pet => pet._id !== petId));

        // Dispatch event to notify other components
        window.dispatchEvent(new CustomEvent('petDeleted', { detail: petId }));
      } catch (error) {
        alert('Failed to delete pet profile.');
      }
    }
  };

  const handleSubmit = (petData) => {
    if (editingPet) {
      handleUpdatePet(petData);
    } else {
      handleAddPet(petData);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <PetProfileForm
        onSubmit={handleSubmit}
        editingPet={editingPet}
        setEditingPet={setEditingPet}
      />
      <PetProfileList
        pets={pets}
        setEditingPet={setEditingPet}
        onDeletePet={handleDeletePet}
        loading={loading}
      />
    </div>
  );
};

export default PetProfile;