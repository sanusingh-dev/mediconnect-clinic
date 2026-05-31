import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import { updateDoctorProfileService } from '../services/doctorService';

const DoctorOnboarding = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    specialty: '',
    bio: '',
    phone: '',
    location: '',
    consultationFee: 300,
    upiId: '',
    qrImage: '',
  });
  const [qrPreview, setQrPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'consultationFee' ? parseInt(value) || 0 : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size should be less than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setQrPreview(reader.result);
      setFormData((prev) => ({
        ...prev,
        qrImage: reader.result,
      }));
    };
    reader.readAsDataURL(file);
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
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.specialty || !formData.consultationFee || !formData.upiId || !formData.qrImage) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      await updateDoctorProfileService(formData);
      toast.success('Profile setup complete!');
      navigate('/doctor-dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'doctor') {
    navigate('/');
    return null;
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="rounded-3xl bg-white p-10 shadow-xl dark:bg-slate-900">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">Complete Your Profile</h1>
          <p className="mt-3 text-slate-600 dark:text-slate-400">
            Add your professional details and payment information to start accepting patient bookings
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Professional Information */}
          <section>
            <h2 className="mb-6 text-2xl font-semibold text-slate-900 dark:text-slate-100">Professional Information</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Specialty *</label>
                <input
                  type="text"
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleInputChange}
                  placeholder="e.g., Cardiology, General Medicine"
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-500 outline-none focus:border-brand dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+91 XXXXX XXXXX"
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-500 outline-none focus:border-brand dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., Delhi, Mumbai"
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-500 outline-none focus:border-brand dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell patients about your experience and expertise..."
                  rows="4"
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-500 outline-none focus:border-brand dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
            </div>
          </section>

          <hr className="border-slate-200 dark:border-slate-700" />

          {/* Payment Information */}
          <section>
            <h2 className="mb-6 text-2xl font-semibold text-slate-900 dark:text-slate-100">Payment Information</h2>

            <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/30">
              <div className="flex gap-3">
                <AlertCircle size={20} className="flex-shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div>
                  <p className="font-semibold text-amber-900 dark:text-amber-100">QR-Based Payment System</p>
                  <p className="mt-1 text-sm text-amber-800 dark:text-amber-200">
                    Patients will scan your QR code to send payment via UPI. Upload a clear QR code image that links to your UPI ID.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Consultation Fee (₹) *</label>
                <input
                  type="number"
                  name="consultationFee"
                  value={formData.consultationFee}
                  onChange={handleInputChange}
                  min="100"
                  max="10000"
                  step="50"
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-500 outline-none focus:border-brand dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                  required
                />
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Price patients will pay per consultation</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">UPI ID *</label>
                <input
                  type="text"
                  name="upiId"
                  value={formData.upiId}
                  onChange={handleInputChange}
                  placeholder="yourname@upi"
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-500 outline-none focus:border-brand dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                  required
                />
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Your UPI ID for receiving payments</p>
              </div>
            </div>

            {/* QR Code Upload */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Upload QR Code Image *</label>

              {!qrPreview ? (
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
                    Drag and drop your QR code image here
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
                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
                  <img src={qrPreview} alt="QR Code" className="mx-auto max-h-64 rounded-xl" />
                  <button
                    type="button"
                    onClick={() => {
                      setQrPreview(null);
                      setFormData((prev) => ({ ...prev, qrImage: '' }));
                    }}
                    className="mt-4 w-full rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50"
                  >
                    Change QR Code
                  </button>
                </div>
              )}
            </div>
          </section>

          <hr className="border-slate-200 dark:border-slate-700" />

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl bg-brand px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Setting up...' : 'Complete Setup'}
            </button>

            <button
              type="button"
              onClick={() => navigate('/doctor-dashboard')}
              className="flex-1 rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              Skip for now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorOnboarding;
