const PetProfileList = ({ pets }) => (
    <ul>
        {pets.map((pet) => (
            <li key={pet._id} className="mb-2 p-2 border rounded">
                <strong>{pet.firstName} {pet.lastName}</strong> — Age: {pet.age}, Breed: {pet.breed}
            </li>
        ))}
    </ul>
);

export default PetProfileList;