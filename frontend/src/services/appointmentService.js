import axiosClient from '../api/axiosClient';

export const fetchSlots = (doctorId) => axiosClient.get(`/appointments/doctor/${doctorId}/slots`);
export const bookAppointmentService = (payload) => axiosClient.post('/appointments', payload);
export const myAppointmentsService = () => axiosClient.get('/appointments/me');
export const appointmentDetailService = (id) => axiosClient.get(`/appointments/${id}`);
