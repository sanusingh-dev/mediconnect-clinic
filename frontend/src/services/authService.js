import axiosClient from '../api/axiosClient';

export const loginService = (formData) => axiosClient.post('/auth/login', formData);
export const registerPatientService = (formData) => axiosClient.post('/auth/register/patient', formData);
export const registerDoctorService = (formData) => axiosClient.post('/auth/register/doctor', formData);
export const getProfileService = () => axiosClient.get('/auth/me');
