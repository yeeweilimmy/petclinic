const Appointment = require("../models/Appointment");
const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.user.id });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create appointment 
const addAppointment = async (req, res) => {
  const { title, description, deadline } = req.body;
  try {
    const appointment = await Appointment.create({
      userId: req.user.id,
      title,
      description,
      deadline: deadline,
    });
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update appointment
const updateAppointment = async (req, res) => {
  const { title, description, completed, deadline } = req.body;
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });
    appointment.title = title || appointment.title;
    appointment.description = description || appointment.description;
    appointment.completed = completed ?? appointment.completed;
    appointment.deadline = deadline || appointment.deadline;
    const updatedAppointment = await appointment.save();
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
    await appointment.remove();
    res.json({ message: "Appointment deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//     expect(res.status.calledWith(200)).to.be.true;
module.exports = { getAppointments, addAppointment, updateAppointment, deleteAppointment };