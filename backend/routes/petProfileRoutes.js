const express = require('express');
const router = express.Router();
const petProfileController = require('../controllers/petProfileController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, petProfileController.createPetProfile);
router.get('/', protect, petProfileController.getPetProfiles);
router.get('/:id', protect, petProfileController.getPetProfile);
router.put('/:id', protect, petProfileController.updatePetProfile);
// router.delete('/:id', protect, petProfileController.deletePetProfile);

module.exports = router;