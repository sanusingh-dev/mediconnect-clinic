import { useState } from 'react';
import { Upload, X, Check } from 'lucide-react';
import { toast } from 'react-toastify';

const PaymentProofUpload = ({ onUpload, isLoading = false }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const processFile = (selectedFile) => {
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error('File size should be less than 5MB');
      return;
    }

    if (!selectedFile.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    setFile(selectedFile);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      processFile(droppedFile);
    }
  };

  const handleUpload = async () => {
    if (!preview) {
      toast.error('Please select a file first');
      return;
    }

    onUpload(preview);
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center gap-3 mb-6">
        <Upload size={24} className="text-brand" />
        <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Upload Payment Proof</h3>
      </div>

      {!preview ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`rounded-2xl border-2 border-dashed p-8 text-center transition ${
            dragActive
              ? 'border-brand bg-brand/5 dark:bg-brand/10'
              : 'border-slate-300 dark:border-slate-600'
          }`}
        >
          <Upload size={32} className="mx-auto mb-3 text-slate-400 dark:text-slate-500" />
          <p className="mb-2 text-sm font-medium text-slate-900 dark:text-slate-100">
            Drag and drop your payment screenshot here
          </p>
          <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">or</p>
          <label className="inline-flex cursor-pointer rounded-lg bg-brand/10 px-4 py-2 text-sm font-medium text-brand transition hover:bg-brand/20">
            Browse Files
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
            Maximum file size: 5MB. Supported formats: JPG, PNG, GIF
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
            <img
              src={preview}
              alt="Payment proof"
              className="max-h-64 w-full rounded-xl object-cover"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={clearFile}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <X size={18} />
              Clear
            </button>

            <button
              onClick={handleUpload}
              disabled={isLoading}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Uploading...
                </>
              ) : (
                <>
                  <Check size={18} />
                  Upload Proof
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentProofUpload;
