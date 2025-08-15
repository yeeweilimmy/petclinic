const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    completed: { type: Boolean, default: false },
    deadline: { type: Date },
    // New fields for pet integration
    petId: { type: mongoose.Schema.Types.ObjectId, ref: 'PetProfile' },
    petName: { type: String } // Store pet name for easy display
});

module.exports = mongoose.model('Appointment', appointmentSchema);