import { useEffect, useState } from 'react';
import { FiClipboard, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { myAppointmentsService } from '../services/appointmentService';
import LoadingSpinner from '../components/common/LoadingSpinner';

const MyTokens = () => {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTokens = async () => {
      try {
        const response = await myAppointmentsService();
        setTokens(response.data);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Unable to load tokens');
      } finally {
        setLoading(false);
      }
    };
    loadTokens();
  }, []);

  const statusStyles = {
    confirmed: 'bg-sky-100 text-sky-700',
    pending: 'bg-amber-100 text-amber-700',
    cancelled: 'bg-red-100 text-red-700',
    completed: 'bg-emerald-100 text-emerald-700',
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="rounded-[2rem] bg-white p-8 shadow-xl shadow-slate-900/5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-brand">My Tokens</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">Your appointment token history</h1>
            <p className="mt-3 text-slate-600">Review all your active and past tokens in one modern dashboard.</p>
          </div>
          <div className="rounded-full bg-brand/10 px-5 py-3 text-sm font-semibold text-brand shadow-sm">{tokens.length} tokens</div>
        </div>
      </div>

      <div className="mt-8 grid gap-6">
        {tokens.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-600">
            <p className="text-xl font-semibold text-slate-900">No tokens yet</p>
            <p className="mt-2">Visit the Doctors page to request a new token and secure your appointment.</p>
          </div>
        ) : (
          tokens.map((token) => (
            <div key={token._id} className="rounded-[2rem] bg-white p-8 shadow-xl shadow-slate-900/5">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-brand">Token #{token.tokenNumber || token.token}</p>
                  <h2 className="mt-3 text-2xl font-semibold text-slate-900">Dr. {token.doctor?.user?.name || token.doctor?.name}</h2>
                  <p className="mt-2 text-sm text-slate-500">{token.doctor?.specialty || 'General Medicine'}</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${statusStyles[token.status] || 'bg-slate-100 text-slate-700'}`}>
                    {token.status === 'confirmed' ? <FiCheckCircle /> : token.status === 'cancelled' ? <FiXCircle /> : <FiClock />} {token.status}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-4 py-2 text-sm text-slate-700">
                    <FiClock /> {new Date(token.appointmentDate).toLocaleDateString()} • {token.appointmentTime || token.timeSlot}
                  </span>
                </div>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-3 text-sm text-slate-600">
                <div className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Doctor</p>
                  <p className="mt-2 font-semibold text-slate-900">{token.doctor?.user?.name}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Payment</p>
                  <p className="mt-2 font-semibold text-slate-900">{token.paymentStatus || 'Pending'}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Clinic</p>
                  <p className="mt-2 font-semibold text-slate-900">Mediconnect Care</p>
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
