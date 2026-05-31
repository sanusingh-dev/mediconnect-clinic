import { useEffect, useState } from 'react';
import { Clipboard, Clock, CheckCircle, XCircle, Download, CreditCard } from 'lucide-react';
import { toast } from 'react-toastify';
import QRCode from 'react-qr-code';
import { myAppointmentsService } from '../services/appointmentService';
import { getPatientPaymentHistoryService } from '../services/paymentService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import PaymentStatusBadge from '../components/ui/PaymentStatusBadge';

const MyTokens = () => {
  const [tokens, setTokens] = useState([]);
  const [payments, setPayments] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTokens = async () => {
      try {
        const [tokensRes, paymentsRes] = await Promise.all([
          myAppointmentsService(),
          getPatientPaymentHistoryService(),
        ]);
        setTokens(tokensRes.data);
        
        // Create a map of appointment IDs to payments
        const paymentMap = {};
        paymentsRes.data.forEach((payment) => {
          if (payment.appointmentId) {
            paymentMap[payment.appointmentId._id] = payment;
          }
        });
        setPayments(paymentMap);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Unable to load tokens');
      } finally {
        setLoading(false);
      }
    };
    loadTokens();
  }, []);

  const downloadReceipt = (token) => {
    const content = `Mediconnect Appointment Receipt\n\nToken: ${token.tokenNumber || token.token}\nPatient: ${token.patient?.user?.name || 'N/A'}\nDoctor: ${token.doctor?.user?.name || token.doctor?.name || 'N/A'}\nDate: ${token?.appointmentDate ? new Date(token.appointmentDate).toLocaleDateString() : 'N/A'}\nTime: ${token.appointmentTime || token.timeSlot || 'N/A'}\nStatus: ${token.status || 'N/A'}\nAppointment ID: ${token._id || 'N/A'}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `token-receipt-${token.tokenNumber || token.token || token._id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const statusStyles = {
    confirmed: 'bg-sky-100 text-sky-700',
    pending: 'bg-amber-100 text-amber-700',
    rejected: 'bg-red-100 text-red-700',
    cancelled: 'bg-red-100 text-red-700',
    completed: 'bg-blue-100 text-blue-700',
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="rounded-[2rem] bg-white p-8 shadow-xl shadow-slate-900/5 dark:bg-slate-900 dark:shadow-slate-950/40">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-brand">My Tokens</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-100">Appointment receipts and verification</h1>
            <p className="mt-3 text-slate-600 dark:text-slate-400">See confirmed tokens with proof cards and download your appointment receipt instantly.</p>
          </div>
          <div className="rounded-full bg-brand/10 px-5 py-3 text-sm font-semibold text-brand shadow-sm">{tokens.length} tokens</div>
        </div>
      </div>

      <div className="mt-8 grid gap-6">
        {tokens.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">
            <p className="text-xl font-semibold text-slate-900 dark:text-white">No tokens yet</p>
            <p className="mt-2">Visit the Doctors page to request a new token and secure your appointment.</p>
          </div>
        ) : (
          tokens.map((token) => (
            <div key={token._id} className="rounded-[2rem] bg-white p-8 shadow-xl shadow-slate-900/5 dark:bg-slate-900 dark:shadow-slate-950/40">
              <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-brand">Token #{token.tokenNumber || token.token}</p>
                  <h2 className="mt-3 text-2xl font-semibold text-slate-900 dark:text-slate-100">Dr. {token.doctor?.user?.name || token.doctor?.name}</h2>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{token.doctor?.specialty || 'General Medicine'}</p>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-3xl bg-slate-50 p-5 dark:bg-slate-950">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Appointment</p>
                      <p className="mt-3 text-lg font-semibold text-slate-900 dark:text-slate-100">{new Date(token.appointmentDate).toLocaleDateString()}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{token.appointmentTime || token.timeSlot}</p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-5 dark:bg-slate-950">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Appointment Status</p>
                      <span className={`mt-3 inline-flex rounded-full px-4 py-2 text-sm font-semibold ${statusStyles[token.status] || 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-100'}`}>
                        {token.status || 'pending'}
                      </span>
                    </div>
                  </div>

                  {payments[token._id] && (
                    <div className="mt-6 rounded-3xl bg-gradient-to-br from-blue-50 to-blue-100 p-5 dark:from-blue-950/30 dark:to-blue-900/30">
                      <p className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-blue-700 dark:text-blue-300 font-semibold">
                        <CreditCard size={16} />
                        Payment Status
                      </p>
                      <div className="mt-4">
                        <PaymentStatusBadge 
                          paymentStatus={payments[token._id]?.paymentStatus}
                          tokenStatus={payments[token._id]?.tokenStatus}
                        />
                      </div>
                      <p className="mt-3 text-sm font-medium text-blue-900 dark:text-blue-100">
                        Amount: ₹{payments[token._id]?.amount || 0}
                      </p>
                      {payments[token._id]?.paymentProofUrl && (
                        <div className="mt-4 rounded-3xl bg-white p-4 dark:bg-slate-900">
                          <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Uploaded payment proof</p>
                          <img src={payments[token._id]?.paymentProofUrl} alt="Payment proof" className="mt-3 h-48 w-full rounded-3xl object-contain" />
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-6 grid gap-4 sm:grid-cols-3 text-sm text-slate-600 dark:text-slate-400">
                    <div className="rounded-3xl bg-slate-50 p-5 dark:bg-slate-950">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Appointment ID</p>
                      <p className="mt-3 font-semibold text-slate-900 dark:text-slate-100">{token._id ? token._id.slice(-8).toUpperCase() : 'N/A'}</p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-5 dark:bg-slate-950">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Patient</p>
                      <p className="mt-3 font-semibold text-slate-900 dark:text-slate-100">{token.patient?.user?.name || token.patient?.name || 'N/A'}</p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-5 dark:bg-slate-950">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Receipt</p>
                      <button onClick={() => downloadReceipt(token)} className="mt-3 inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600">
                        <Download size={16} /> Download
                      </button>
                    </div>
                  </div>
                </div>

                <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-950">
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Appointment QR code</p>
                    <div className="mt-6 flex items-center justify-center rounded-[1.5rem] bg-white p-4 dark:bg-slate-900">
                    <QRCode value={token?._id ? `mediconnect://appointment/${token._id}` : 'mediconnect://appointment/unknown'} size={140} bgColor="transparent" fgColor="#1d4ed8" />
                  </div>
                  <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">Scan to verify this appointment on clinic check-in.</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyTokens;
