import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';
import PetProfileForm from '../components/PetProfileForm';
import PetProfileList from '../components/PetProfileList';

const PetProfile = () => {
  const { user } = useAuth();
  const [pets, setPets] = useState([]);

  useEffect(() => {
    const fetchPetProfiles = async () => {
      try {
        const response = await axiosInstance.get('/api/pet-profiles', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setPets(response.data);
      } catch (error) {
        alert('Failed to fetch pet profiles.');
      }
    };

    fetchPetProfiles();
  }, [user]);

  const handleAddPet = async (petData) => {
    try {
      const res = await axiosInstance.post('/api/pet-profiles', petData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setPets([...pets, res.data]);
    } catch (error) {
      alert('Failed to create pet profile.');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <PetProfileForm
        onSubmit={handleAddPet}
      />
      <PetProfileList pets={pets} />
    </div>
  );
};

export default PetProfile;