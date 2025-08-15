const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    completed: { type: Boolean, default: false },
    deadline: { type: Date },
    // Pet integration fields
    petId: { type: mongoose.Schema.Types.ObjectId, ref: 'PetProfile' },
    petName: { type: String },
    petAge: { type: Number },
    petBreed: { type: String }
});

module.exports = mongoose.model('Appointment', appointmentSchema);