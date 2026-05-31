import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Clock, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';
import { getPendingPaymentRequestsService, confirmPaymentService, rejectPaymentService } from '../services/paymentService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import PaymentStatusBadge from '../components/ui/PaymentStatusBadge';

const PaymentVerification = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const response = await getPendingPaymentRequestsService();
      setPayments(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = async (paymentId) => {
    setIsProcessing(true);
    try {
      await confirmPaymentService(paymentId);
      toast.success('Payment confirmed and token generated!');
      loadPayments();
      setSelectedPayment(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to confirm payment');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectPayment = async (paymentId) => {
    if (!rejectionReason.trim()) {
      toast.error('Please enter a rejection reason');
      return;
    }

    setIsProcessing(true);
    try {
      await rejectPaymentService(paymentId, rejectionReason);
      toast.error('Payment rejected');
      loadPayments();
      setRejectionReason('');
      setSelectedPayment(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject payment');
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'text-orange-600 dark:text-orange-400',
      proof_uploaded: 'text-blue-600 dark:text-blue-400',
      confirmed: 'text-emerald-600 dark:text-emerald-400',
      rejected: 'text-red-600 dark:text-red-400',
    };
    return colors[status] || 'text-slate-600 dark:text-slate-400';
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) return <LoadingSpinner />;

  const pendingPayments = payments.filter((p) => p.paymentStatus === 'proof_uploaded');
  const confirmedPayments = payments.filter((p) => p.paymentStatus === 'confirmed');
  const rejectedPayments = payments.filter((p) => p.paymentStatus === 'rejected');

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">Payment Verification</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Review patient payment proofs and confirm or reject them
        </p>
      </div>

      {/* Stats */}
      <div className="mb-10 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-orange-50 p-6 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900">
          <Clock size={24} className="mb-2 text-orange-600 dark:text-orange-400" />
          <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Pending Review</p>
          <p className="text-3xl font-bold text-orange-900 dark:text-orange-100 mt-2">{pendingPayments.length}</p>
        </div>

        <div className="rounded-2xl bg-emerald-50 p-6 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900">
          <CheckCircle2 size={24} className="mb-2 text-emerald-600 dark:text-emerald-400" />
          <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Confirmed</p>
          <p className="text-3xl font-bold text-emerald-900 dark:text-emerald-100 mt-2">{confirmedPayments.length}</p>
        </div>

        <div className="rounded-2xl bg-red-50 p-6 dark:bg-red-950/20 border border-red-200 dark:border-red-900">
          <XCircle size={24} className="mb-2 text-red-600 dark:text-red-400" />
          <p className="text-sm font-medium text-red-700 dark:text-red-300">Rejected</p>
          <p className="text-3xl font-bold text-red-900 dark:text-red-100 mt-2">{rejectedPayments.length}</p>
        </div>
      </div>

      {/* Pending Payments */}
      {pendingPayments.length > 0 && (
        <div className="mb-10">
          <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-slate-100">
            Pending Payment Proofs ({pendingPayments.length})
          </h2>
          <div className="space-y-4">
            {pendingPayments.map((payment) => (
              <div
                key={payment._id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {payment?.userId?.name}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                      Amount: ₹{payment.amount}
                    </p>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                      Uploaded: {formatDate(payment.createdAt)}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row">
                    <button
                      onClick={() => setSelectedPayment(payment)}
                      className="inline-flex items-center gap-2 rounded-lg bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
                    >
                      <Eye size={16} />
                      View Proof
                    </button>

                    <button
                      onClick={() => handleConfirmPayment(payment._id)}
                      disabled={isProcessing}
                      className="inline-flex items-center gap-2 rounded-lg bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-200 disabled:opacity-50 dark:bg-emerald-900/30 dark:text-emerald-300 dark:hover:bg-emerald-900/50"
                    >
                      <CheckCircle2 size={16} />
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirmed Payments */}
      {confirmedPayments.length > 0 && (
        <div className="mb-10">
          <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-slate-100">
            Confirmed Payments ({confirmedPayments.length})
          </h2>
          <div className="space-y-4">
            {confirmedPayments.map((payment) => (
              <div
                key={payment._id}
                className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-900 dark:bg-emerald-950/20"
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">
                      {payment?.userId?.name}
                    </h3>
                    <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-300">
                      Token #: {payment.tokenNumber} | Amount: ₹{payment.amount}
                    </p>
                  </div>
                  <span className="inline-flex rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white">
                    ✓ Confirmed
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal for viewing payment proof */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-8 dark:bg-slate-900">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Payment Proof - {selectedPayment?.userId?.name}
              </h2>
              <button
                onClick={() => setSelectedPayment(null)}
                className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            {/* Payment Details */}
            <div className="mb-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Patient Name</p>
                <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
                  {selectedPayment?.userId?.name}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Amount</p>
                <p className="mt-1 text-2xl font-bold text-brand">₹{selectedPayment?.amount}</p>
              </div>
            </div>

            {/* Proof Image */}
            {selectedPayment?.paymentProofUrl && (
              <div className="mb-6">
                <p className="mb-3 text-sm font-medium text-slate-600 dark:text-slate-400">Payment Screenshot</p>
                <img
                  src={selectedPayment.paymentProofUrl}
                  alt="Payment proof"
                  className="max-h-96 w-full rounded-xl object-cover"
                />
              </div>
            )}

            {/* Actions */}
            <div className="space-y-4">
              <button
                onClick={() => handleConfirmPayment(selectedPayment._id)}
                disabled={isProcessing}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
              >
                <CheckCircle2 size={20} />
                {isProcessing ? 'Confirming...' : 'Confirm Payment'}
              </button>

              <div>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Enter rejection reason (optional)..."
                  className="mb-3 w-full rounded-xl border border-slate-300 bg-white p-3 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                  rows="3"
                />
                <button
                  onClick={() => handleRejectPayment(selectedPayment._id)}
                  disabled={isProcessing}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
                >
                  <XCircle size={20} />
                  {isProcessing ? 'Rejecting...' : 'Reject Payment'}
                </button>
              </div>

              <button
                onClick={() => setSelectedPayment(null)}
                className="w-full rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {payments.length === 0 && (
        <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-12 text-center dark:border-slate-700 dark:bg-slate-900/50">
          <Clock size={48} className="mx-auto mb-4 text-slate-400 dark:text-slate-600" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">No payment requests</h3>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Pending payment proofs will appear here
          </p>
        </div>
      )}
    </div>
  );
};

export default PaymentVerification;
