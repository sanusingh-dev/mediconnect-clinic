const express = require('express');
const router = express.Router();
const {
  getAvailableSlots,
  bookAppointment,
  getAppointmentDetails,
  getMyAppointments,
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');

router.get('/doctor/:doctorId/slots', getAvailableSlots);
router.post('/', protect, bookAppointment);
router.get('/me', protect, getMyAppointments);
router.get('/:id', protect, getAppointmentDetails);

module.exports = router;
