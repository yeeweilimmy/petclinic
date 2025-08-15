const express = require('express');
const {
    getAppointments,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    getAppointmentsByPet
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(protect, getAppointments).post(protect, addAppointment);
router.route('/:id').put(protect, updateAppointment).delete(protect, deleteAppointment);
// New route to get appointments for a specific pet
router.route('/pet/:petId').get(protect, getAppointmentsByPet);

module.exports = router;