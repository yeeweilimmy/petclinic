const mongoose = require('mongoose');

const petProfileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Add this line
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    age: { type: Number, required: true },
    breed: { type: String, required: true },
});

module.exports = mongoose.model('PetProfile', petProfileSchema);