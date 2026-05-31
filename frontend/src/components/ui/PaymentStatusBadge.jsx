const PaymentStatusBadge = ({ paymentStatus, tokenStatus }) => {
  const paymentStyles = {
    pending: 'bg-orange-100 text-orange-700 border border-orange-300',
    proof_uploaded: 'bg-blue-100 text-blue-700 border border-blue-300',
    confirmed: 'bg-emerald-100 text-emerald-700 border border-emerald-300',
    rejected: 'bg-red-100 text-red-700 border border-red-300',
  };

  const tokenStyles = {
    pending: 'bg-yellow-100 text-yellow-700 border border-yellow-300',
    confirmed: 'bg-green-100 text-green-700 border border-green-300',
    completed: 'bg-blue-100 text-blue-700 border border-blue-300',
    cancelled: 'bg-gray-100 text-gray-700 border border-gray-300',
  };

  const paymentLabels = {
    pending: 'Pending Payment',
    proof_uploaded: 'Payment Uploaded',
    confirmed: 'Payment Confirmed',
    rejected: 'Payment Rejected',
  };

  const tokenLabels = {
    pending: 'Token Pending',
    confirmed: 'Token Confirmed',
    completed: 'Token Completed',
    cancelled: 'Token Cancelled',
  };

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
      {paymentStatus && (
        <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${paymentStyles[paymentStatus] || paymentStyles.pending}`}>
          {paymentLabels[paymentStatus] || 'Unknown'}
        </span>
      )}
      {tokenStatus && (
        <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${tokenStyles[tokenStatus] || tokenStyles.pending}`}>
          {tokenLabels[tokenStatus] || 'Unknown'}
        </span>
      )}
    </div>
  );
};

export default PaymentStatusBadge;
