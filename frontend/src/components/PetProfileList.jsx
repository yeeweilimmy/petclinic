const PetProfileList = ({ pets, setEditingPet, onDeletePet, loading }) => {
    if (loading) {
        return (
            <div>
                <h1 className="text-2xl font-bold mb-4">List of pets</h1>
                <div className="text-center py-8">
                    <p className="text-gray-500">Loading pets...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">List of pets ({pets.length})</h1>
            {pets.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No pet profiles created yet.</p>
            ) : (
                pets.map((pet) => (
                    <div key={pet._id} className="bg-gray-100 p-4 mb-4 rounded shadow">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="font-bold text-lg">{pet.firstName} {pet.lastName}, {pet.age}, {pet.breed}</h2>
                                <div className="text-sm text-gray-600 mb-3">
                                    <p><strong>First Name:</strong> {pet.firstName}</p>
                                    <p><strong>Last Name:</strong> {pet.lastName}</p>
                                    <p><strong>Age:</strong> {pet.age} years old</p>
                                    <p><strong>Breed:</strong> {pet.breed}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setEditingPet(pet)}
                                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => onDeletePet(pet._id)}
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default PetProfileList;