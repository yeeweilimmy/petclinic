import { useState, useEffect } from 'react';

const PetProfileForm = ({ onSubmit, editingPet, setEditingPet }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        age: '',
        breed: '',
    });

    useEffect(() => {
        if (editingPet) {
            setFormData(editingPet);
        } else {
            setFormData({ firstName: '', lastName: '', age: '', breed: '' });
        }
    }, [editingPet]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        setEditingPet && setEditingPet(null);
        setFormData({ firstName: '', lastName: '', age: '', breed: '' });
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
            <h1 className="text-2xl font-bold mb-4">
                {editingPet ? 'Edit Pet Profile' : 'Create Pet Profile'}
            </h1>

            <input
                type="text"
                name="firstName"
                placeholder="Pet First Name"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full mb-4 p-2 border rounded"
                required
            />

            <input
                type="text"
                name="lastName"
                placeholder="Pet Last Name"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full mb-4 p-2 border rounded"
                required
            />

            <div className="flex mb-4 gap-2">
                <input
                    type="number"
                    name="age"
                    placeholder="Age"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-1/2 p-2 border rounded"
                    min="0"
                    required
                />
                <input
                    type="text"
                    name="breed"
                    placeholder="Breed"
                    value={formData.breed}
                    onChange={handleChange}
                    className="w-1/2 p-2 border rounded"
                    required
                />
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
                {editingPet ? 'Update Pet Profile' : 'Create Pet Profile'}
            </button>
        </form>
    );
};

export default PetProfileForm; 