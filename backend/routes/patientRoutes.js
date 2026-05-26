const express = require('express');
const router = express.Router();
const {
  getPatientProfile,
  updatePatientProfile,
  uploadReport,
  getPatientAppointments,
  getPatientPrescriptions,
} = require('../controllers/patientController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect, authorize('patient'));
router.get('/profile', getPatientProfile);
router.put('/profile', updatePatientProfile);
router.post('/reports', uploadReport);
router.get('/appointments', getPatientAppointments);
router.get('/prescriptions', getPatientPrescriptions);

module.exports = router;
