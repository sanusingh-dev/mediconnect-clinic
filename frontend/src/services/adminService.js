import axiosClient from '../api/axiosClient';

export const getAnalyticsService = () => axiosClient.get('/admin/analytics');
export const getUsersService = (params) => axiosClient.get('/admin/users', { params });
export const getDoctorsService = () => axiosClient.get('/admin/doctors');
export const getAppointmentsService = () => axiosClient.get('/admin/appointments');
export const deleteUserService = (id) => axiosClient.delete(`/admin/users/${id}`);
