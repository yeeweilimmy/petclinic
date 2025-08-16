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
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-large p-8 border border-lightBlue/20">
            <h1 className="text-2xl font-bold text-darkNavy mb-6">
                {editingPet ? 'Edit Pet Profile' : 'Create Pet Profile'}
            </h1>

            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-darkNavy mb-2">
                            Pet First Name
                        </label>
                        <input
                            type="text"
                            name="firstName"
                            placeholder="Enter pet's first name"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border-2 border-lightBlue/30 rounded-xl focus:border-primaryBlue focus:ring-0 outline-none transition-colors duration-200 text-darkNavy placeholder-gray-400"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-darkNavy mb-2">
                            Pet Last Name
                        </label>
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Enter pet's last name"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border-2 border-lightBlue/30 rounded-xl focus:border-primaryBlue focus:ring-0 outline-none transition-colors duration-200 text-darkNavy placeholder-gray-400"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-darkNavy mb-2">
                            Age (years)
                        </label>
                        <input
                            type="number"
                            name="age"
                            placeholder="Enter pet's age"
                            value={formData.age}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border-2 border-lightBlue/30 rounded-xl focus:border-primaryBlue focus:ring-0 outline-none transition-colors duration-200 text-darkNavy placeholder-gray-400"
                            min="0"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-darkNavy mb-2">
                            Breed
                        </label>
                        <input
                            type="text"
                            name="breed"
                            placeholder="Enter pet's breed"
                            value={formData.breed}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border-2 border-lightBlue/30 rounded-xl focus:border-primaryBlue focus:ring-0 outline-none transition-colors duration-200 text-darkNavy placeholder-gray-400"
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full py-3 px-4 bg-primaryBlue text-cream font-semibold rounded-xl hover:bg-darkNavy hover:shadow-medium transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
                >
                    {editingPet ? 'Update Pet Profile' : 'Create Pet Profile'}
                </button>
            </div>
        </form>
    );
};

export default PetProfileForm;