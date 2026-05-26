const express = require('express');
const router = express.Router();
const {
  registerPatient,
  registerDoctor,
  login,
  getCurrentUser,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register/patient', registerPatient);
router.post('/register/doctor', registerDoctor);
router.post('/login', login);
router.get('/me', protect, getCurrentUser);

module.exports = router;
