import axiosClient from '../api/axiosClient';

export const getPatientProfileService = () => axiosClient.get('/patients/profile');
export const updatePatientProfileService = (payload) => axiosClient.put('/patients/profile', payload);
export const uploadReportService = (payload) => axiosClient.post('/patients/reports', payload);
export const getPatientAppointmentsService = () => axiosClient.get('/patients/appointments');
export const getPatientPrescriptionsService = () => axiosClient.get('/patients/prescriptions');
