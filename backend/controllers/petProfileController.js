const PetProfile = require('../models/PetProfile');
const Appointment = require('../models/Appointment');

exports.createPetProfile = async (req, res) => {
    try {
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
        const pets = await PetProfile.find({ userId: req.user.id }).sort({ firstName: 1 });
        res.json(pets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getPetProfile = async (req, res) => {
    try {
        const pet = await PetProfile.findOne({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!pet) {
            return res.status(404).json({ message: 'Pet profile not found' });
        }

        res.json(pet);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updatePetProfile = async (req, res) => {
    try {
        const pet = await PetProfile.findOne({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!pet) {
            return res.status(404).json({ message: 'Pet profile not found' });
        }

        const updatedPet = await PetProfile.findByIdAndUpdate(
            req.params.id,
            { ...req.body, userId: req.user.id },
            { new: true, runValidators: true }
        );

        // Update associated appointments with new pet data
        await Appointment.updateMany(
            { petId: req.params.id, userId: req.user.id },
            {
                petName: `${updatedPet.firstName} ${updatedPet.lastName}`,
                petAge: updatedPet.age,
                petBreed: updatedPet.breed
            }
        );

        res.json(updatedPet);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deletePetProfile = async (req, res) => {
    try {
        const pet = await PetProfile.findOne({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!pet) {
            return res.status(404).json({ message: 'Pet profile not found' });
        }

        await PetProfile.findByIdAndDelete(req.params.id);

        // Update associated appointments to remove pet reference but keep pet data
        await Appointment.updateMany(
            { petId: req.params.id, userId: req.user.id },
            {
                $unset: { petId: 1 }
            }
        );

        res.json({ message: 'Pet profile deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};