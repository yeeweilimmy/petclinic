const PetProfileList = ({ pets, setEditingPet, onDeletePet, loading }) => {
    if (loading) {
        return (
            <div className="bg-white rounded-2xl shadow-large p-8 border border-lightBlue/20">
                <h1 className="text-2xl font-bold text-darkNavy mb-6">List of pets</h1>
                <div className="text-center py-12">
                    <div className="w-6 h-6 border-2 border-primaryBlue/30 border-t-primaryBlue rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500 text-lg">Loading pets...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-large p-8 border border-lightBlue/20">
            <h1 className="text-2xl font-bold text-darkNavy mb-6">
                List of pets ({pets.length})
            </h1>
            {pets.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No pet profiles created yet.</p>
                    <p className="text-gray-400 text-sm mt-2">Create your first pet profile above to get started.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {pets.map((pet) => (
                        <div key={pet._id} className="bg-lightBlue/5 border border-lightBlue/20 rounded-xl p-6 hover:shadow-medium transition-all duration-200">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center mb-4">
                                        <div>
                                            <h2 className="font-bold text-xl text-darkNavy">
                                                {pet.firstName} {pet.lastName}
                                            </h2>
                                            <p className="text-gray-600">{pet.age} years old • {pet.breed}</p>
                                        </div>
                                    </div>

                                    <div className="bg-cream/50 border border-cream rounded-lg p-4">
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-gray-600 font-medium">First Name</p>
                                                <p className="text-darkNavy">{pet.firstName}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600 font-medium">Last Name</p>
                                                <p className="text-darkNavy">{pet.lastName}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600 font-medium">Age</p>
                                                <p className="text-darkNavy">{pet.age} years old</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600 font-medium">Breed</p>
                                                <p className="text-darkNavy">{pet.breed}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2 ml-6">
                                    <button
                                        onClick={() => setEditingPet(pet)}
                                        className="bg-primaryBlue text-cream px-4 py-2 rounded-lg font-medium hover:bg-darkNavy hover:shadow-medium transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => onDeletePet(pet._id)}
                                        className="bg-red text-white px-4 py-2 rounded-lg font-medium hover:bg-red/80 hover:shadow-medium transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PetProfileList;