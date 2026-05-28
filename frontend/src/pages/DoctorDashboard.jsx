import { useEffect, useMemo, useState } from 'react';
import { FiActivity, FiClock, FiUsers, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { doctorTodayAppointmentsService, updateAppointmentStatusService, writePrescriptionService, getDoctorProfileService } from '../services/doctorService';
import LoadingSpinner from '../components/common/LoadingSpinner';

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [prescription, setPrescription] = useState({ medicines: '', instructions: '', notes: '' });
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const stats = useMemo(() => ({
    total: appointments.length,
    pending: appointments.filter((appointment) => appointment.status === 'pending').length,
    confirmed: appointments.filter((appointment) => appointment.status === 'confirmed').length,
    completed: appointments.filter((appointment) => appointment.status === 'completed').length,
  }), [appointments]);

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
      <div className="grid gap-6 xl:grid-cols-[1fr_1.8fr]">
        <aside className="rounded-[2rem] bg-white p-8 shadow-xl shadow-slate-900/5">
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.3em] text-brand">Doctor profile</p>
              <h2 className="text-3xl font-semibold text-slate-900">Dr. {profile?.user?.name}</h2>
              <p className="text-sm text-slate-500">{profile?.specialty}</p>
            </div>
            <div className="rounded-[1.8rem] bg-slate-50 p-6">
              <p className="text-sm text-slate-500">Location</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{profile?.location || 'N/A'}</p>
            </div>
            <div className="rounded-[1.8rem] bg-slate-50 p-6">
              <p className="text-sm text-slate-500">Contact</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{profile?.phone || 'N/A'}</p>
            </div>
            <div className="grid gap-4">
              {[
                { label: 'Total tokens today', value: stats.total, icon: <FiActivity /> },
                { label: 'Pending', value: stats.pending, icon: <FiHourglass /> },
                { label: 'Confirmed', value: stats.confirmed, icon: <FiCheckCircle /> },
                { label: 'Completed', value: stats.completed, icon: <FiUsers /> },
              ].map((card) => (
                <div key={card.label} className="flex items-center gap-4 rounded-3xl bg-slate-50 p-5 shadow-sm">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand">{card.icon}</span>
                  <div>
                    <p className="text-lg font-semibold text-slate-900">{card.value}</p>
                    <p className="text-sm text-slate-500">{card.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <main className="space-y-6">
          <div className="rounded-[2rem] bg-white p-8 shadow-xl shadow-slate-900/5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-brand">Today's patients</p>
                <h2 className="mt-3 text-2xl font-semibold text-slate-900">Manage appointments</h2>
              </div>
              <p className="rounded-full bg-slate-50 px-4 py-2 text-sm text-slate-600">{appointments.length} scheduled</p>
            </div>
            <div className="mt-8 space-y-4">
              {appointments.length === 0 ? (
                <div className="rounded-[1.8rem] border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600">
                  No appointments scheduled for today.
                </div>
              ) : (
                appointments.map((appointment) => (
                  <div key={appointment._id} className="rounded-[1.8rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                      <div className="space-y-2">
                        <p className="text-xl font-semibold text-slate-900">{appointment.patient.user.name}</p>
                        <p className="text-sm text-slate-600">Token #{appointment.tokenNumber || appointment.token} • {appointment.appointmentTime || appointment.timeSlot}</p>
                        <p className="text-sm text-slate-600">{new Date(appointment.appointmentDate).toLocaleDateString()}</p>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <span className={`rounded-full px-4 py-2 text-sm font-semibold ${
                          appointment.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : appointment.status === 'confirmed' ? 'bg-sky-100 text-sky-700' : appointment.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {appointment.status}
                        </span>
                        <span className="rounded-full bg-white px-4 py-2 text-sm text-slate-700 shadow-sm">Payment: {appointment.paymentStatus || 'pending'}</span>
                      </div>
                    </div>
                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                      <button onClick={() => handleStatus(appointment._id, 'confirmed')} className="rounded-full bg-brand px-4 py-3 text-white transition hover:bg-blue-600">
                        Accept
                      </button>
                      <button onClick={() => handleStatus(appointment._id, 'cancelled')} className="rounded-full bg-red-500 px-4 py-3 text-white transition hover:bg-red-600">
                        Reject
                      </button>
                      <button onClick={() => handleStatus(appointment._id, 'completed')} className="rounded-full bg-slate-900 px-4 py-3 text-white transition hover:bg-slate-700">
                        Complete
                      </button>
                    </div>
                    <div className="mt-5 space-y-4 rounded-[1.8rem] bg-white p-4 shadow-inner">
                      <p className="text-sm font-semibold text-slate-900">Prescription notes</p>
                      <div className="grid gap-3 md:grid-cols-3">
                        <input value={prescription.medicines} onChange={(e) => setPrescription({ ...prescription, medicines: e.target.value })} placeholder="Medicine summary" className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" />
                        <input value={prescription.instructions} onChange={(e) => setPrescription({ ...prescription, instructions: e.target.value })} placeholder="Instructions" className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" />
                        <input value={prescription.notes} onChange={(e) => setPrescription({ ...prescription, notes: e.target.value })} placeholder="Notes" className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" />
                      </div>
                      <button onClick={() => handlePrescription(appointment._id)} className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-600">
                        Save prescription
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DoctorDashboard;
