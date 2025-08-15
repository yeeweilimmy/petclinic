const express = require('express');
const router = express.Router();
const petProfileController = require('../controllers/petProfileController');
const { protect } = require('../middleware/authMiddleware'); // Add this import

router.post('/', protect, petProfileController.createPetProfile); // Add protect middleware
router.get('/', protect, petProfileController.getPetProfiles);    // Add protect middleware

module.exports = router;