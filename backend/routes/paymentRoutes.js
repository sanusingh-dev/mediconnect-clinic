const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  getPendingPaymentRequests,
  uploadPaymentProof,
  confirmPayment,
  rejectPayment,
  getPaymentDetails,
  getPatientPaymentHistory,
} = require('../controllers/paymentController');

const router = express.Router();

// Doctor routes - get payment requests
router.get('/doctor/requests', protect, authorize('doctor'), getPendingPaymentRequests);

// Doctor routes - confirm/reject payment
router.put('/:paymentId/confirm', protect, authorize('doctor'), confirmPayment);
router.put('/:paymentId/reject', protect, authorize('doctor'), rejectPayment);

// Patient routes - upload payment proof
router.post('/:appointmentId/upload-proof', protect, authorize('patient'), uploadPaymentProof);

// Get payment details
router.get('/:appointmentId/details', protect, getPaymentDetails);

// Patient history
router.get('/patient/history', protect, authorize('patient'), getPatientPaymentHistory);

module.exports = router;
