const PetProfile = require('../models/PetProfile');

exports.createPetProfile = async (req, res) => {
    try {
        // Add userId to associate pet with the logged-in user
        const pet = await PetProfile.create({
            ...req.body,
            userId: req.user.id
        });
        res.status(201).json(pet);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getPetProfiles = async (req, res) => {
    try {
        // Only return pets belonging to the logged-in user
        const pets = await PetProfile.find({ userId: req.user.id });
        res.json(pets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};