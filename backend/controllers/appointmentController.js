const Appointment = require("../models/Appointment");
const PetProfile = require("../models/PetProfile");

const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.user.id })
      .populate('petId', 'firstName lastName age breed'); // Populate pet details
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create appointment 
const addAppointment = async (req, res) => {
  const { title, description, deadline, petId, petName, petAge, petBreed } = req.body;
  try {
    const appointment = await Appointment.create({
      userId: req.user.id,
      title,
      description,
      deadline: deadline,
      petId: petId || null,
      petName: petName || null,
      petAge: petAge || null,
      petBreed: petBreed || null
    });

    // Populate the pet data before returning
    await appointment.populate('petId', 'firstName lastName age breed');
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update appointment
const updateAppointment = async (req, res) => {
  const { title, description, completed, deadline, petId, petName, petAge, petBreed } = req.body;
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    appointment.title = title || appointment.title;
    appointment.description = description || appointment.description;
    appointment.completed = completed ?? appointment.completed;
    appointment.deadline = deadline || appointment.deadline;
    appointment.petId = petId !== undefined ? petId : appointment.petId;
    appointment.petName = petName !== undefined ? petName : appointment.petName;
    appointment.petAge = petAge !== undefined ? petAge : appointment.petAge;
    appointment.petBreed = petBreed !== undefined ? petBreed : appointment.petBreed;

    const updatedAppointment = await appointment.save();

    // Populate the pet data before returning
    await updatedAppointment.populate('petId', 'firstName lastName age breed');
    res.json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete appointment
const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });
    await appointment.deleteOne(); // Updated method
    res.json({ message: "Appointment deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get appointments for a specific pet
const getAppointmentsByPet = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      userId: req.user.id,
      petId: req.params.petId
    });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAppointments,
  addAppointment,
  updateAppointment,
  deleteAppointment,
  getAppointmentsByPet
};