import { useState, useEffect } from 'react';
import axios from 'axios';
// import axiosInstance from '../axiosConfig';
import PetProfileForm from '../components/PetProfileForm';
import PetProfileList from '../components/PetProfileList'; // If you have this

const PetProfile = () => {
    const [pets, setPets] = useState([]);

    useEffect(() => {
        // Fetch all pet profiles when the page loads
        axios.get('/api/pet-profiles').then(res => setPets(res.data));
        // axios.get('http://localhost:5001/api/pet-profiles').then(res => setPets(res.data));
    }, []);

    const handleAddPet = async (petData) => {
        const res = await axios.post('/api/pet-profiles', petData);
        // const res = await axios.post('http://localhost:5001/api/pet-profiles', petData);
        setPets([...pets, res.data]);
    };

    return (
        <div>
            <PetProfileForm onSubmit={handleAddPet} />
            <h2 className="text-xl font-bold mb-2">Pet Profiles</h2>
            <PetProfileList pets={pets} />
            {/* If you don't have PetProfileList.jsx, you can render inline:
      <ul>
        {pets.map((pet) => (
          <li key={pet._id}>
            {pet.firstName} {pet.lastName} — Age: {pet.age}, Breed: {pet.breed}
          </li>
        ))}
      </ul>
      */}
        </div>
    );
};

export default PetProfile;