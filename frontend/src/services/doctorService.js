import axiosClient from '../api/axiosClient';

export const getDoctorProfileService = () => axiosClient.get('/doctors/profile');
export const getDoctorsPublicService = () => axiosClient.get('/doctors/list');
export const doctorTodayAppointmentsService = () => axiosClient.get('/doctors/today');
export const updateDoctorProfileService = (payload) => axiosClient.put('/doctors/profile', payload);
export const updateAppointmentStatusService = (id, payload) => axiosClient.put(`/doctors/appointments/${id}`, payload);
export const writePrescriptionService = (id, payload) => axiosClient.post(`/doctors/appointments/${id}/prescription`, payload);
