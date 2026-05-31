import { useEffect, useMemo, useState } from 'react';
import { Activity, Clock, Users, CheckCircle2, AlertTriangle, FileText, HeartPulse } from 'lucide-react';
import { toast } from 'react-toastify';
import { doctorTodayAppointmentsService, updateAppointmentStatusService, writePrescriptionService, getDoctorProfileService } from '../services/doctorService';
import { getPendingPaymentRequestsService, confirmPaymentService, rejectPaymentService } from '../services/paymentService';
import PaymentStatusBadge from '../components/ui/PaymentStatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [paymentRequests, setPaymentRequests] = useState([]);
  const [prescription, setPrescription] = useState({ medicines: '', instructions: '', notes: '' });
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionProcessing, setActionProcessing] = useState(false);

  const stats = useMemo(() => ({
    totalPatients: new Set(appointments.map((appt) => appt?.patient?._id || appt?.patientId || '')).size,
    today: appointments.length,
    pending: appointments.filter((appointment) => appointment.status === 'pending').length,
    completed: appointments.filter((appointment) => appointment.status === 'completed').length,
    totalRequests: paymentRequests.length,
    pendingRequests: paymentRequests.filter((request) => request.paymentStatus === 'proof_uploaded' || request.paymentStatus === 'pending').length,
    confirmedPayments: paymentRequests.filter((request) => request.paymentStatus === 'confirmed').length,
  }), [appointments, paymentRequests]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [appointmentsRes, profileRes, paymentRes] = await Promise.all([
          doctorTodayAppointmentsService(),
          getDoctorProfileService(),
          getPendingPaymentRequestsService(),
        ]);
        setAppointments(appointmentsRes.data);
        setProfile(profileRes.data);
        setPaymentRequests(paymentRes.data);
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

  const handleConfirmPayment = async (paymentId) => {
    setActionProcessing(true);
    try {
      const response = await confirmPaymentService(paymentId);
      setPaymentRequests((prev) => prev.map((item) => (item._id === paymentId ? response.data.payment : item)));
      toast.success('Payment confirmed and token generated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to confirm payment');
    } finally {
      setActionProcessing(false);
    }
  };

  const handleRejectPayment = async (paymentId) => {
    const reason = window.prompt('Provide a brief reason for rejection', 'Invalid proof or payment mismatch');
    if (reason === null) return;

    setActionProcessing(true);
    try {
      const response = await rejectPaymentService(paymentId, reason);
      setPaymentRequests((prev) => prev.map((item) => (item._id === paymentId ? response.data.payment : item)));
      toast.success('Payment rejected');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to reject payment');
    } finally {
      setActionProcessing(false);
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

  const statusStyles = {
    pending: 'bg-amber-100 text-amber-700',
    confirmed: 'bg-emerald-100 text-emerald-700',
    rejected: 'bg-red-100 text-red-700',
    cancelled: 'bg-red-100 text-red-700',
    completed: 'bg-blue-100 text-blue-700',
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="grid gap-6 xl:grid-cols-[1fr_1.6fr]">
        <aside className="rounded-[2rem] bg-white p-8 shadow-xl shadow-slate-900/5 dark:bg-slate-900 dark:shadow-slate-950/40">
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.3em] text-brand">Doctor profile</p>
              <h2 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">Dr. {profile?.user?.name}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">{profile?.specialty}</p>
            </div>
            <div className="rounded-[1.8rem] bg-slate-50 p-6 dark:bg-slate-950">
              <p className="text-sm text-slate-500 dark:text-slate-400">Location</p>
              <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">{profile?.location || 'N/A'}</p>
            </div>
            <div className="rounded-[1.8rem] bg-slate-50 p-6 dark:bg-slate-950">
              <p className="text-sm text-slate-500 dark:text-slate-400">Contact</p>
              <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">{profile?.phone || 'N/A'}</p>
            </div>
            <div className="grid gap-4">
              {[
                { label: 'Total patients', value: stats.totalPatients, icon: <Users size={20} /> },
                { label: 'Today appointments', value: stats.today, icon: <Clock size={20} /> },
                { label: 'Pending tokens', value: stats.pending, icon: <AlertTriangle size={20} /> },
                { label: 'Completed', value: stats.completed, icon: <CheckCircle2 size={20} /> },
                { label: 'Payment requests', value: stats.totalRequests, icon: <Activity size={20} /> },
                { label: 'Pending confirmations', value: stats.pendingRequests, icon: <FileText size={20} /> },
                { label: 'Confirmed payments', value: stats.confirmedPayments, icon: <HeartPulse size={20} /> },
              ].map((card) => (
                <div key={card.label} className="flex items-center gap-4 rounded-3xl bg-slate-50 p-5 shadow-sm dark:bg-slate-950">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand">{card.icon}</span>
                  <div>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">{card.value}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{card.label}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-[1.8rem] bg-slate-50 p-6 dark:bg-slate-950">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Payment setup</p>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Consultation fee</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">₹{profile?.consultationFee || 300}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">UPI ID</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">{profile?.upiId || 'Not configured'}</p>
                </div>
                {profile?.qrImage && (
                  <div className="rounded-3xl bg-white p-4 dark:bg-slate-900">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">QR Code</p>
                    <img src={profile.qrImage} alt="Doctor QR" className="mt-3 h-40 w-full rounded-3xl object-contain" />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => window.location.assign('/doctor-onboarding')}
                  className="w-full rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
                >
                  Edit payment settings
                </button>
              </div>
            </div>
          </div>
        </aside>

        <main className="space-y-6">
          <section className="rounded-[2rem] bg-white p-8 shadow-xl shadow-slate-900/5 dark:bg-slate-900 dark:shadow-slate-950/40">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-brand">Today's patients</p>
                <h2 className="mt-3 text-2xl font-semibold text-slate-900 dark:text-slate-100">Appointment queue</h2>
              </div>
              <div className="rounded-full bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 dark:bg-slate-950 dark:text-slate-200">{appointments.length} sessions today</div>
            </div>

            {appointments.length === 0 ? (
              <div className="rounded-[1.8rem] border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">
                No appointments scheduled for today.
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div key={appointment._id} className="rounded-[1.8rem] border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950">
                    <div className="grid gap-4 xl:grid-cols-[1.5fr_0.7fr] xl:items-center">
                      <div>
                        <p className="text-xl font-semibold text-slate-900 dark:text-slate-100">{appointment?.patient?.user?.name || appointment?.patient?.name || 'Unknown'}</p>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Token #{appointment?.tokenNumber || appointment?.token || '—'}</p>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{appointment?.appointmentDate ? new Date(appointment.appointmentDate).toLocaleDateString() : '—'} • {appointment?.appointmentTime || appointment?.timeSlot || '—'}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className={`rounded-full px-4 py-2 text-sm font-semibold ${statusStyles[appointment.status] || 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-100'}`}>
                          {appointment.status}
                        </span>
                        <button onClick={() => handleStatus(appointment._id, 'confirmed')} className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600">
                          Confirm
                        </button>
                        <button onClick={() => handleStatus(appointment._id, 'cancelled')} className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600">
                          Reject
                        </button>
                        <button onClick={() => handleStatus(appointment._id, 'completed')} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700">
                          Complete
                        </button>
                      </div>
                    </div>
                    <div className="mt-5 grid gap-4 md:grid-cols-3">
                      <div className="rounded-3xl bg-white p-4 dark:bg-slate-900">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Patient priority</p>
                        <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">{appointment.priority || 'Standard'}</p>
                      </div>
                      <div className="rounded-3xl bg-white p-4 dark:bg-slate-900">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Patient phone</p>
                        <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">{appointment.patient.phone || 'N/A'}</p>
                      </div>
                      <div className="rounded-3xl bg-white p-4 dark:bg-slate-900">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Payment</p>
                        <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">{appointment.paymentStatus || 'Pending'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-[2rem] bg-white p-8 shadow-xl shadow-slate-900/5 dark:bg-slate-900 dark:shadow-slate-950/40">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-brand">Payment requests</p>
                <h2 className="mt-3 text-2xl font-semibold text-slate-900 dark:text-slate-100">Verify payments</h2>
              </div>
              <span className="rounded-full bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 dark:bg-slate-950 dark:text-slate-200">{paymentRequests.length} requests</span>
            </div>

            {paymentRequests.length === 0 ? (
              <div className="rounded-[1.8rem] border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">
                No payment requests yet. Patients will see the QR details and submit proof after booking.
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {paymentRequests.map((payment) => (
                  <div key={payment._id} className="rounded-[1.8rem] border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950">
                    <div className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr] xl:items-start">
                      <div>
                        <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">{payment?.patientId?.user?.name || 'Patient'}</p>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Appointment: {payment?.appointmentId?.appointmentDate ? new Date(payment.appointmentId.appointmentDate).toLocaleDateString() : 'TBD'} • {payment?.appointmentId?.appointmentTime || payment?.appointmentId?.timeSlot || 'TBD'}</p>
                        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Amount requested: ₹{payment.amount}</p>
                        <div className="mt-4">
                          <PaymentStatusBadge paymentStatus={payment.paymentStatus} tokenStatus={payment.tokenStatus} />
                        </div>
                      </div>
                      <div className="space-y-4">
                        {payment.paymentProofUrl ? (
                          <div className="rounded-3xl bg-white p-4 dark:bg-slate-900">
                            <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Payment proof</p>
                            <img src={payment.paymentProofUrl} alt="Payment proof" className="mt-4 h-56 w-full rounded-3xl object-contain" />
                          </div>
                        ) : (
                          <div className="rounded-3xl bg-blue-50 p-4 text-sm text-blue-800 dark:bg-blue-900/20 dark:text-blue-200">
                            Waiting for proof upload from patient.
                          </div>
                        )}
                        <div className="flex flex-wrap gap-3">
                          <button
                            type="button"
                            disabled={actionProcessing || payment.paymentStatus !== 'proof_uploaded'}
                            onClick={() => handleConfirmPayment(payment._id)}
                            className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                          >
                            Confirm payment
                          </button>
                          <button
                            type="button"
                            disabled={actionProcessing || payment.paymentStatus !== 'proof_uploaded'}
                            onClick={() => handleRejectPayment(payment._id)}
                            className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
                          >
                            Reject payment
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-[2rem] bg-white p-8 shadow-xl shadow-slate-900/5 dark:bg-slate-900 dark:shadow-slate-950/40">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-brand">Patient history</p>
                <h2 className="mt-3 text-2xl font-semibold text-slate-900 dark:text-slate-100">Recent visits</h2>
              </div>
              <span className="rounded-full bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 dark:bg-slate-950 dark:text-slate-200">{appointments.length} recent</span>
            </div>

            <div className="mt-6 overflow-hidden rounded-[1.8rem] border border-slate-200 dark:border-slate-700">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                <thead className="bg-slate-100 text-left dark:bg-slate-950">
                  <tr>
                    <th className="px-6 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400">Patient</th>
                    <th className="px-6 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400">Token</th>
                    <th className="px-6 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400">Date</th>
                    <th className="px-6 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-700 dark:bg-slate-950">
                  {appointments.slice(0, 6).map((appointment) => (
                    <tr key={appointment._id}>
                      <td className="px-6 py-4 text-sm text-slate-900 dark:text-slate-100">{appointment?.patient?.user?.name || appointment?.patient?.name || 'Unknown'}</td>
                      <td className="px-6 py-4 text-sm text-slate-900 dark:text-slate-100">#{appointment?.tokenNumber || appointment?.token || '—'}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{appointment?.appointmentDate ? new Date(appointment.appointmentDate).toLocaleDateString() : '—'}</td>
                      <td className="px-6 py-4">
                        <span className={`rounded-full px-3 py-1 text-sm font-semibold ${statusStyles[appointment.status] || 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-100'}`}>
                          {appointment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default DoctorDashboard;
