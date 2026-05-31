import { Ticket, Calendar, Clock, User, CheckCircle2 } from 'lucide-react';
import PaymentStatusBadge from './PaymentStatusBadge';

const TokenCard = ({ payment, doctor, patient, appointment }) => {
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50 p-8 shadow-lg dark:border-emerald-900 dark:from-emerald-950 dark:to-green-950">
      <div className="flex items-center gap-3 mb-6">
        <Ticket size={28} className="text-emerald-600 dark:text-emerald-400" />
        <div>
          <h2 className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">Token #{payment?.tokenNumber}</h2>
          <p className="text-sm text-emerald-700 dark:text-emerald-300">Appointment Confirmed</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Patient Details */}
        <div className="rounded-2xl bg-white p-5 dark:bg-slate-800">
          <p className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400">
            <User size={16} />
            Patient Name
          </p>
          <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
            {patient?.user?.name || 'N/A'}
          </p>
        </div>

        {/* Doctor Details */}
        <div className="rounded-2xl bg-white p-5 dark:bg-slate-800">
          <p className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400">
            <User size={16} />
            Doctor Name
          </p>
          <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
            Dr. {doctor?.user?.name || 'N/A'}
          </p>
        </div>

        {/* Appointment Date */}
        <div className="rounded-2xl bg-white p-5 dark:bg-slate-800">
          <p className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400">
            <Calendar size={16} />
            Appointment Date
          </p>
          <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
            {formatDate(appointment?.appointmentDate)}
          </p>
        </div>

        {/* Appointment Time */}
        <div className="rounded-2xl bg-white p-5 dark:bg-slate-800">
          <p className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400">
            <Clock size={16} />
            Appointment Time
          </p>
          <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
            {appointment?.appointmentTime || 'N/A'}
          </p>
        </div>

        {/* Payment Amount */}
        <div className="rounded-2xl bg-white p-5 dark:bg-slate-800">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Amount Paid</p>
          <p className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            ₹{payment?.amount || 0}
          </p>
        </div>

        {/* Status */}
        <div className="rounded-2xl bg-white p-5 dark:bg-slate-800">
          <p className="mb-3 text-sm font-medium text-slate-600 dark:text-slate-400">Status</p>
          <PaymentStatusBadge
            paymentStatus={payment?.paymentStatus}
            tokenStatus={payment?.tokenStatus}
          />
        </div>
      </div>

      {/* Confirmation Note */}
      <div className="mt-6 rounded-2xl bg-white p-5 border-l-4 border-emerald-500 dark:bg-slate-800">
        <div className="flex items-start gap-3">
          <CheckCircle2 size={20} className="mt-0.5 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
          <div>
            <p className="font-semibold text-slate-900 dark:text-slate-100">
              Your appointment has been confirmed!
            </p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Please arrive 10 minutes before your scheduled appointment time. Keep your token number handy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenCard;
