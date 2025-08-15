const PetProfile = require('../models/PetProfile');

exports.createPetProfile = async (req, res) => {
    try {
        const pet = await PetProfile.create(req.body);
        res.status(201).json(pet);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getPetProfiles = async (req, res) => {
    try {
        const pets = await PetProfile.find();
        res.json(pets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    };
};