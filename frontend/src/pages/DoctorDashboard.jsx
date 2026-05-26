import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { doctorTodayAppointmentsService, updateAppointmentStatusService, writePrescriptionService, getDoctorProfileService } from '../services/doctorService';
import LoadingSpinner from '../components/common/LoadingSpinner';

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [prescription, setPrescription] = useState({ medicines: '', instructions: '', notes: '' });
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [appointmentsRes, profileRes] = await Promise.all([
          doctorTodayAppointmentsService(),
          getDoctorProfileService(),
        ]);
        setAppointments(appointmentsRes.data);
        setProfile(profileRes.data);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Unable to load doctor dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleStatus = async (id, status) => {
    try {
      await updateAppointmentStatusService(id, { status });
      setAppointments((prev) => prev.map((item) => (item._id === id ? { ...item, status } : item)));
      toast.success('Appointment updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Status update failed');
    }
  };

  const handlePrescription = async (appointmentId) => {
    try {
      const payload = {
        medicines: [{ name: prescription.medicines, dosage: 'as prescribed', frequency: 'twice a day' }],
        instructions: prescription.instructions,
        notes: prescription.notes,
      };
      await writePrescriptionService(appointmentId, payload);
      toast.success('Prescription saved');
      setPrescription({ medicines: '', instructions: '', notes: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to save prescription');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="grid gap-6 xl:grid-cols-4">
        <div className="rounded-3xl bg-white p-6 shadow-sm xl:col-span-1">
          <h2 className="text-xl font-semibold text-slate-900">Doctor profile</h2>
          <p className="mt-3 text-slate-600">{profile?.user?.name}</p>
          <p className="text-sm text-slate-500">{profile?.specialty}</p>
          <div className="mt-6 space-y-3 text-sm text-slate-700">
            <p>Location: {profile?.location || 'N/A'}</p>
            <p>Contact: {profile?.phone || 'N/A'}</p>
            <p>Appointments today: {appointments.length}</p>
          </div>
        </div>

        <div className="xl:col-span-3 space-y-6">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Today's patients</h2>
            <div className="mt-5 space-y-4">
              {appointments.length === 0 ? (
                <p className="text-slate-600">No patients scheduled for today.</p>
              ) : (
                appointments.map((appointment) => (
                  <div key={appointment._id} className="rounded-3xl border border-slate-200 p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-semibold text-slate-900">{appointment.patient.user.name}</p>
                        <p className="text-sm text-slate-600">{appointment.timeSlot} • Token #{appointment.token}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button onClick={() => handleStatus(appointment._id, 'confirmed')} className="rounded-full bg-emerald-500 px-4 py-2 text-white">
                          Confirm
                        </button>
                        <button onClick={() => handleStatus(appointment._id, 'completed')} className="rounded-full bg-slate-900 px-4 py-2 text-white">
                          Complete
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 space-y-3 rounded-3xl bg-slate-50 p-4">
                      <p className="text-sm text-slate-700">Status: {appointment.status}</p>
                      <div className="grid gap-3 md:grid-cols-3">
                        <input value={prescription.medicines} onChange={(e) => setPrescription({ ...prescription, medicines: e.target.value })} placeholder="Medicine summary" className="md:col-span-1" />
                        <input value={prescription.instructions} onChange={(e) => setPrescription({ ...prescription, instructions: e.target.value })} placeholder="Instructions" className="md:col-span-1" />
                        <input value={prescription.notes} onChange={(e) => setPrescription({ ...prescription, notes: e.target.value })} placeholder="Notes" className="md:col-span-1" />
                      </div>
                      <button onClick={() => handlePrescription(appointment._id)} className="rounded-full bg-brand px-5 py-2 text-white hover:bg-blue-600">
                        Save prescription
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
