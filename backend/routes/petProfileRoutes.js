const express = require('express');
const router = express.Router();
const petProfileController = require('../controllers/petProfileController');

router.post('/', petProfileController.createPetProfile);
router.get('/', petProfileController.getPetProfiles);

module.exports = router;