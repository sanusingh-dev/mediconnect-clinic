const express = require('express');
const router = express.Router();
const {
  getAnalytics,
  getAllUsers,
  getAllDoctors,
  getAllAppointments,
  deleteUser,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect, authorize('admin'));
router.get('/analytics', getAnalytics);
router.get('/users', getAllUsers);
router.get('/doctors', getAllDoctors);
router.get('/appointments', getAllAppointments);
router.delete('/users/:id', deleteUser);

module.exports = router;
