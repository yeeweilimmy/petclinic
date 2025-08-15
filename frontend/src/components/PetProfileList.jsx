const PetProfileList = ({ pets }) => {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">List of pets</h1>
            {pets.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No pet profiles created yet.</p>
            ) : (
                pets.map((pet) => (
                    <div key={pet._id} className="bg-gray-100 p-4 mb-4 rounded shadow">
                        <h2 className="font-bold text-lg">{pet.firstName} {pet.lastName}, {pet.age}, {pet.breed}</h2>
                        <div className="text-sm text-gray-600 mb-3">
                            <p><strong>First Name:</strong> {pet.firstName}</p>
                            <p><strong>Last Name:</strong> {pet.lastName}</p>
                            <p><strong>Age:</strong> {pet.age} years old</p>
                            <p><strong>Breed:</strong> {pet.breed}</p>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default PetProfileList;