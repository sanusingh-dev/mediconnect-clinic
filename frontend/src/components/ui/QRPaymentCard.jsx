import { QrCode, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';

const QRPaymentCard = ({ doctor, amount }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center gap-3 mb-6">
        <QrCode size={24} className="text-brand" />
        <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Payment Details</h3>
      </div>

      <div className="space-y-6">
        {/* Amount Section */}
        <div className="rounded-2xl bg-gradient-to-br from-brand/10 to-blue-100 p-6 dark:from-brand/20 dark:to-blue-900/20">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Consultation Fee</p>
          <p className="mt-2 text-4xl font-bold text-brand">₹{amount}</p>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">One-time payment for consultation</p>
        </div>

        {/* QR Code Section */}
        {doctor?.qrImage && (
          <div className="flex flex-col items-center rounded-2xl bg-slate-50 p-6 dark:bg-slate-950">
            <p className="mb-4 text-sm font-medium text-slate-600 dark:text-slate-300">Scan to Pay</p>
            <img src={doctor.qrImage} alt="QR Code" className="h-48 w-48 rounded-xl border-4 border-white shadow-lg dark:border-slate-800" />
            <p className="mt-4 text-xs text-slate-500 dark:text-slate-400 text-center">Use your UPI app to scan this QR code</p>
          </div>
        )}

        {/* UPI ID Section */}
        {doctor?.upiId && (
          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">UPI ID</p>
            <div className="mt-3 flex items-center justify-between rounded-xl bg-white p-3 dark:bg-slate-800">
              <code className="text-sm font-mono text-slate-900 dark:text-slate-100">{doctor.upiId}</code>
              <button
                onClick={() => copyToClipboard(doctor.upiId)}
                className="inline-flex items-center gap-2 rounded-lg bg-brand/10 px-3 py-2 text-sm font-medium text-brand transition hover:bg-brand/20"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        )}

        {/* Doctor Info */}
        <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Doctor Name</p>
          <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">Dr. {doctor?.user?.name || 'N/A'}</p>
        </div>

        {/* Instructions */}
        <div className="rounded-2xl bg-blue-50 p-4 dark:bg-blue-900/20">
          <p className="text-sm font-medium text-blue-900 dark:text-blue-200">Payment Instructions:</p>
          <ul className="mt-3 space-y-2 text-sm text-blue-800 dark:text-blue-300">
            <li>• Use your UPI app to scan the QR code</li>
            <li>• Or manually enter the UPI ID: {doctor?.upiId}</li>
            <li>• Enter amount: ₹{amount}</li>
            <li>• Complete the payment</li>
            <li>• Upload payment screenshot as proof</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default QRPaymentCard;
