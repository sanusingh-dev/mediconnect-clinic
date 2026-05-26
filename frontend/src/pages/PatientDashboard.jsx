import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getDoctorsPublicService } from '../services/doctorService';
import { bookAppointmentService } from '../services/appointmentService';
import { getPatientAppointmentsService, uploadReportService, getPatientPrescriptionsService, getPatientProfileService } from '../services/patientService';
import LoadingSpinner from '../components/common/LoadingSpinner';

const PatientDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({ doctorId: '', appointmentDate: '', timeSlot: '' });
  const [reportData, setReportData] = useState({ filename: '', url: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [doctorRes, appointmentRes, prescriptionRes, profileRes] = await Promise.all([
          getDoctorsPublicService(),
          getPatientAppointmentsService(),
          getPatientPrescriptionsService(),
          getPatientProfileService(),
        ]);
        setDoctors(doctorRes.data);
        setAppointments(appointmentRes.data);
        setPrescriptions(prescriptionRes.data);
        setProfile(profileRes.data);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Unable to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleBook = async (event) => {
    event.preventDefault();
    try {
      await bookAppointmentService(formData);
      toast.success('Appointment booked successfully');
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    }
  };

  const handleReport = async (event) => {
    event.preventDefault();
    try {
      await uploadReportService(reportData);
      toast.success('Report uploaded');
      setReportData({ filename: '', url: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Welcome back</h2>
          <p className="mt-2 text-slate-600">{profile?.user?.name}, manage your appointments and reports below.</p>
          <div className="mt-6 grid gap-3 text-sm text-slate-700">
            <div className="rounded-2xl bg-slate-50 p-4">Email: {profile?.user?.email}</div>
            <div className="rounded-2xl bg-slate-50 p-4">Phone: {profile?.phone || 'N/A'}</div>
            <div className="rounded-2xl bg-slate-50 p-4">Visits: {appointments.length}</div>
          </div>
        </div>

        <div className="xl:col-span-2 rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Book a new appointment</h2>
          <form onSubmit={handleBook} className="mt-5 grid gap-4 md:grid-cols-3">
            <select name="doctorId" value={formData.doctorId} onChange={handleChange} required className="md:col-span-1">
              <option value="">Choose doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor._id} value={doctor._id}>{doctor.user.name} - {doctor.specialty}</option>
              ))}
            </select>
            <input name="appointmentDate" type="date" value={formData.appointmentDate} onChange={handleChange} required className="md:col-span-1" />
            <input name="timeSlot" value={formData.timeSlot} onChange={handleChange} placeholder="Time slot e.g. 10:00 AM" required className="md:col-span-1" />
            <button type="submit" className="md:col-span-3 rounded-full bg-brand px-6 py-3 text-white hover:bg-blue-600">Book appointment</button>
          </form>
        </div>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Appointment history</h2>
          <div className="mt-4 space-y-4">
            {appointments.length === 0 ? (
              <p className="text-slate-600">No appointments yet.</p>
            ) : (
              appointments.map((appointment) => (
                <div key={appointment._id} className="rounded-3xl border border-slate-200 p-4">
                  <p className="font-semibold text-slate-900">Dr. {appointment.doctor.user.name}</p>
                  <p className="text-sm text-slate-600">{new Date(appointment.appointmentDate).toLocaleDateString()} • {appointment.timeSlot}</p>
                  <p className="mt-2 text-sm">Status: <span className="font-semibold">{appointment.status}</span></p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Upload reports</h2>
          <form onSubmit={handleReport} className="mt-5 space-y-4">
            <input name="filename" value={reportData.filename} onChange={(e) => setReportData({ ...reportData, filename: e.target.value })} placeholder="Report name" required />
            <input name="url" value={reportData.url} onChange={(e) => setReportData({ ...reportData, url: e.target.value })} placeholder="File URL or storage link" required />
            <button type="submit" className="rounded-full bg-brand px-6 py-3 text-white hover:bg-blue-600">Upload report</button>
          </form>
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-slate-900">Recent prescriptions</h3>
            {prescriptions.length === 0 ? (
              <p className="mt-3 text-slate-600">No prescriptions available yet.</p>
            ) : (
              prescriptions.slice(0, 3).map((prescription) => (
                <div key={prescription._id} className="mt-4 rounded-3xl bg-slate-50 p-4">
                  <p className="font-semibold">Dr. {prescription.doctor.user.name}</p>
                  <p className="text-sm text-slate-600">{prescription.instructions}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
