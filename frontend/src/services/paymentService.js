import axiosClient from '../api/axiosClient';

export const getPendingPaymentRequestsService = () =>
  axiosClient.get('/payments/doctor/requests');

export const uploadPaymentProofService = (appointmentId, paymentProofUrl) =>
  axiosClient.post(`/payments/${appointmentId}/upload-proof`, {
    paymentProofUrl,
  });

export const confirmPaymentService = (paymentId) =>
  axiosClient.put(`/payments/${paymentId}/confirm`);

export const rejectPaymentService = (paymentId, rejectionReason) =>
  axiosClient.put(`/payments/${paymentId}/reject`, {
    rejectionReason,
  });

export const getPaymentDetailsService = (appointmentId) =>
  axiosClient.get(`/payments/${appointmentId}/details`);

export const getPatientPaymentHistoryService = () =>
  axiosClient.get('/payments/patient/history');
