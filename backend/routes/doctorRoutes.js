const express = require('express');
const router = express.Router();
const {
  getDoctorProfile,
  updateDoctorProfile,
  getTodayAppointments,
  updateAppointmentStatus,
  writePrescription,
  getPatientHistory,
  getAllDoctorsPublic,
} = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/list', getAllDoctorsPublic);
router.use(protect, authorize('doctor'));
router.get('/profile', getDoctorProfile);
router.put('/profile', updateDoctorProfile);
router.get('/today', getTodayAppointments);
router.put('/appointments/:id', updateAppointmentStatus);
router.post('/appointments/:id/prescription', writePrescription);
router.get('/patient-history', getPatientHistory);

module.exports = router;
