const mongoose = require('mongoose');

const petProfileSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    age: { type: Number, required: true },
    breed: { type: String, required: true },
});

module.exports = mongoose.model('PetProfile', petProfileSchema);