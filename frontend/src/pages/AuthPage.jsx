
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';

const AuthPage = () => {
  const auth = useContext(AuthContext) ?? { login: async () => {}, register: async () => {}, loading: false };
  const { login, register, loading } = auth;
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [role, setRole] = useState('patient');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    age: '',
    gender: '',
    address: '',
    specialty: '',
    bio: '',
    location: '',
    consultationFee: 300,
    upiId: '',
    qrImage: '',
    availableSlots: '',
  });
  const [qrPreview, setQrPreview] = useState(null);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleQrFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('QR code file must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setQrPreview(reader.result);
      setForm((prev) => ({ ...prev, qrImage: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('📤 Form submitted in', mode, 'mode');

    try {
      let authUser;

      if (mode === 'login') {
        console.log('🔐 Calling login function');
        authUser = await login({ email: form.email, password: form.password });
        toast.success('Login successful');
      } else {
        const payload = {
          name: form.name,
          email: form.email,
          password: form.password,
        };

        if (role === 'patient') {
          payload.phone = form.phone;
          payload.age = form.age;
          payload.gender = form.gender;
          payload.address = form.address;
        }

        if (role === 'doctor') {
          payload.specialty = form.specialty;
          payload.bio = form.bio;
          payload.phone = form.phone;
          payload.location = form.location;
          payload.consultationFee = form.consultationFee;
          payload.upiId = form.upiId;
          payload.qrImage = form.qrImage;
          payload.availableSlots = [
            {
              day: 'Monday',
              slots: ['09:00 AM', '11:00 AM', '02:00 PM'],
            },
          ];
        }

        console.log(`📝 Calling register function for ${role}`);
        authUser = await register(role === 'patient' ? 'patient' : 'doctor', payload);
        toast.success('Registration successful');
      }

      console.log('✅ Auth successful, user role:', authUser?.role);
      const destination = authUser?.role === 'doctor'
        ? '/doctor-dashboard'
        : authUser?.role === 'admin'
        ? '/admin'
        : '/patient';
      console.log('🚀 Navigating to:', destination);
      navigate(destination, { replace: true });
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      console.error('❌ Auth error:', errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-170px)] max-w-4xl items-center justify-center px-6 py-16">
      <div className="w-full rounded-3xl bg-white p-10 shadow-xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">{mode === 'login' ? 'Welcome back' : 'Create an account'}</h1>
            <p className="mt-2 text-slate-600">Secure login for patients, doctors, and administrators.</p>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setMode('login')} className={`rounded-full px-5 py-2 ${mode === 'login' ? 'bg-brand text-white' : 'bg-slate-100 text-slate-700'}`}>
              Login
            </button>
            <button type="button" onClick={() => setMode('register')} className={`rounded-full px-5 py-2 ${mode === 'register' ? 'bg-brand text-white' : 'bg-slate-100 text-slate-700'}`}>
              Register
            </button>
          </div>
        </div>

        {mode === 'register' && (
          <div className="mb-6 rounded-3xl bg-slate-50 p-5 text-sm text-slate-700">
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={() => setRole('patient')} className={`rounded-full px-4 py-2 ${role === 'patient' ? 'bg-brand text-white' : 'bg-white'}`}>
                Patient
              </button>
              <button type="button" onClick={() => setRole('doctor')} className={`rounded-full px-4 py-2 ${role === 'doctor' ? 'bg-brand text-white' : 'bg-white'}`}>
                Doctor
              </button>
            </div>
            <p className="mt-3">Register as a {role} to access your dashboard.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === 'register' && (
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Full name</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="Enter your name" className="w-full" required />
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" className="w-full" required />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Strong password" className="w-full" required />
          </div>

          {mode === 'register' && role === 'patient' && (
            <div className="grid gap-4 md:grid-cols-2">
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" required />
              <input name="age" type="number" value={form.age} onChange={handleChange} placeholder="Age" required />
              <select name="gender" value={form.gender} onChange={handleChange} required>
                <option value="">Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <input name="address" value={form.address} onChange={handleChange} placeholder="Address" required />
            </div>
          )}

          {mode === 'register' && role === 'doctor' && (
            <div className="grid gap-4 md:grid-cols-2">
              <input name="specialty" value={form.specialty} onChange={handleChange} placeholder="Specialty" required />
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" required />
              <input name="location" value={form.location} onChange={handleChange} placeholder="Location" required />
              <input name="bio" value={form.bio} onChange={handleChange} placeholder="Short bio" required />
              <input
                name="consultationFee"
                type="number"
                min="50"
                step="50"
                value={form.consultationFee}
                onChange={handleChange}
                placeholder="Consultation fee"
                required
              />
              <input name="upiId" value={form.upiId} onChange={handleChange} placeholder="UPI ID" required />
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">QR Code Image</label>
                <input type="file" accept="image/*" onChange={handleQrFileChange} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" />
                {qrPreview && <img src={qrPreview} alt="QR preview" className="mt-3 h-40 w-full max-w-xs rounded-3xl object-contain" />}
              </div>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full rounded-full bg-brand px-6 py-3 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? (mode === 'login' ? 'Logging in...' : `Registering as ${role}...`) : (mode === 'login' ? 'Login' : `Register as ${role}`)}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
