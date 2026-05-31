import { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FiSearch, FiStar, FiClock, FiHeart, FiChevronRight } from 'react-icons/fi';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import { getDoctorsPublicService } from '../services/doctorService';
import { bookAppointmentService } from '../services/appointmentService';
import { uploadPaymentProofService } from '../services/paymentService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import QRPaymentCard from '../components/ui/QRPaymentCard';
import PaymentProofUpload from '../components/ui/PaymentProofUpload';
import TokenCard from '../components/ui/TokenCard';

const DoctorsPage = () => {
  const auth = useContext(AuthContext) ?? { user: null };
  const { user } = auth;
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [formData, setFormData] = useState({ doctorId: '', appointmentDate: '', timeSlot: '' });
  const [selectedTime, setSelectedTime] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [loading, setLoading] = useState(true);
  const [showPaymentFlow, setShowPaymentFlow] = useState(false);
  const [bookedAppointment, setBookedAppointment] = useState(null);
  const [paymentProofUploaded, setPaymentProofUploaded] = useState(false);
  const [isUploadingProof, setIsUploadingProof] = useState(false);

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const response = await getDoctorsPublicService();
        setDoctors(response.data);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Unable to load doctors');
      } finally {
        setLoading(false);
      }
    };
    loadDoctors();
  }, []);

  const specialties = useMemo(() => {
    const unique = Array.from(new Set(doctors.map((doctor) => doctor.specialty || 'General')));
    return ['All', ...unique];
  }, [doctors]);

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) => {
      const name = (doctor?.user?.name || doctor?.name || '').toLowerCase();
      const specialty = (doctor?.specialty || '').toLowerCase();
      const q = searchQuery.toLowerCase();
      const matchesSearch = name.includes(q) || specialty.includes(q);
      const matchesSpecialty = selectedSpecialty === 'All' || doctor?.specialty === selectedSpecialty;
      return matchesSearch && matchesSpecialty;
    });
  }, [doctors, searchQuery, selectedSpecialty]);

  const experience = (doctor) => {
    const nameLen = (doctor?.user?.name || doctor?.name || '').length;
    return `${Math.max(5, Math.floor((nameLen % 6) + 5))}+ yrs`;
  };
  const rating = (doctor) => {
    const nameLen = (doctor?.user?.name || doctor?.name || '').length;
    return (4.5 + (nameLen % 5) * 0.1).toFixed(1);
  };

  const formatTime = (date) => {
    if (!date) return '';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTimeChange = (time) => {
    setSelectedTime(time);
    setFormData({ ...formData, timeSlot: time ? formatTime(time) : '' });
  };

  const handleBook = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.info('Please login to get a token');
      navigate('/auth');
      return;
    }

    if (!formData.appointmentDate || !formData.timeSlot) {
      toast.error('Please select both date and time before booking');
      return;
    }

    try {
      const response = await bookAppointmentService(formData);
      setBookedAppointment(response.data);
      setShowPaymentFlow(true);
      toast.success('Appointment created. Please upload payment proof.');
      setSelectedTime(null);
      setFormData({ doctorId: '', appointmentDate: '', timeSlot: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to create token');
    }
  };

  const handlePaymentProofUpload = async (proofData) => {
    setIsUploadingProof(true);
    try {
      await uploadPaymentProofService(bookedAppointment._id, proofData);
      setPaymentProofUploaded(true);
      toast.success('Payment proof uploaded! Doctor will verify shortly.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload payment proof');
    } finally {
      setIsUploadingProof(false);
    }
  };

  const closePaymentFlow = () => {
    setShowPaymentFlow(false);
    setPaymentProofUploaded(false);
    setBookedAppointment(null);
    setSelectedDoctor(null);
  };

  const selectDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setFormData({ doctorId: doctor._id, appointmentDate: '', timeSlot: '' });
  };

  const formatImage = (doctor) => doctor.photo || 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=800&q=80';

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-6 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="animate-pulse rounded-3xl bg-white p-6 shadow-sm">
              <div className="h-44 rounded-3xl bg-slate-200" />
              <div className="mt-4 space-y-3">
                <div className="h-5 w-3/4 rounded-full bg-slate-200" />
                <div className="h-4 w-1/2 rounded-full bg-slate-200" />
                <div className="grid gap-2">
                  <div className="h-3 rounded-full bg-slate-200" />
                  <div className="h-3 rounded-full bg-slate-200" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <section className="rounded-[2rem] bg-slate-950 p-10 text-white shadow-2xl shadow-slate-900/20">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Available doctors</p>
            <h1 className="text-4xl font-semibold">Find trusted doctors and book appointment tokens instantly.</h1>
            <p className="text-slate-300">Search by specialty, preview availability, and reserve a time slot with a modern patient experience.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl bg-white/10 p-6">
              <p className="text-xl font-semibold">{doctors.length}</p>
              <p className="mt-2 text-sm text-slate-300">Doctors listed</p>
            </div>
            <div className="rounded-3xl bg-white/10 p-6">
              <p className="text-xl font-semibold">{doctors.filter((doc) => doc.availableSlots?.length > 0).length}</p>
              <p className="mt-2 text-sm text-slate-300">Available today</p>
            </div>
            <div className="rounded-3xl bg-white/10 p-6">
              <p className="text-xl font-semibold">95%</p>
              <p className="mt-2 text-sm text-slate-300">Patient satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2rem] bg-white p-8 shadow-xl shadow-slate-900/5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-brand">Search doctors</p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-900">Search by name or specialization</h2>
            </div>
            <div className="inline-flex overflow-hidden rounded-full border border-slate-200 bg-slate-50">
              {specialties.slice(0, 6).map((specialty) => (
                <button
                  key={specialty}
                  type="button"
                  onClick={() => setSelectedSpecialty(specialty)}
                  className={`px-4 py-2 text-sm font-medium transition ${
                    selectedSpecialty === specialty ? 'bg-brand text-white' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {specialty}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="relative rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm">
              <FiSearch className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search doctors"
                className="w-full rounded-3xl border-none bg-transparent pl-11 text-slate-900 outline-none"
              />
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
              <p className="text-sm font-medium text-slate-900">Filter</p>
              <p className="mt-2 text-sm text-slate-500">Showing {filteredDoctors.length} doctors</p>
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {filteredDoctors.length === 0 ? (
              <div className="col-span-full rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-600">
                No doctors found. Try broadening your search or clear the filters.
              </div>
            ) : (
              filteredDoctors.map((doctor, index) => (
                <div key={doctor._id} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                  <div className="flex items-center gap-4">
                    <img src={formatImage(doctor)} alt={doctor?.user?.name || doctor?.name || 'Doctor'} className="h-16 w-16 rounded-3xl object-cover" />
                    <div>
                      <p className="text-lg font-semibold text-slate-900">Dr. {doctor?.user?.name || doctor?.name || 'Unknown'}</p>
                      <p className="text-sm text-slate-500">{doctor.specialty}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-600">
                    <span className="rounded-full bg-white px-3 py-1 shadow-sm">{experience(doctor)} experience</span>
                    <span className="rounded-full bg-white px-3 py-1 shadow-sm">Rating {rating(doctor)}</span>
                    <span className="rounded-full bg-white px-3 py-1 shadow-sm">{doctor.availableSlots?.length ? 'Available' : 'Limited'}</span>
                  </div>
                  <p className="mt-4 text-slate-600 line-clamp-3">{doctor.bio || 'Highly respected clinician with a strong patient focus and responsive availability.'}</p>
                  <div className="mt-5 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-slate-500">Consultation Fee</p>
                      <p className="text-lg font-semibold text-slate-900">₹{doctor.consultationFee || doctor.fees || 300}</p>
                    </div>
                    <button
                      onClick={() => selectDoctor(doctor)}
                      className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
                    >
                      Book token <FiChevronRight />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <aside className="rounded-[2rem] bg-slate-50 p-8 shadow-xl shadow-slate-900/5">
          <div className="rounded-[2rem] bg-gradient-to-br from-brand to-sky-500 p-8 text-white shadow-2xl shadow-brand/20">
            <h2 className="text-2xl font-semibold">Book your token</h2>
            <p className="mt-3 text-slate-100">Select a doctor, choose a date, and confirm your appointment slot.</p>
            <div className="mt-8 space-y-4 rounded-3xl bg-white/10 p-6">
              <div className="flex items-center justify-between text-sm text-slate-200">
                <span>Fast booking</span>
                <span>Secure</span>
              </div>
              <div className="rounded-3xl bg-slate-900/10 p-4 text-sm text-slate-100">
                If you already selected a doctor, the booking form appears below.
              </div>
              <div className="grid gap-3">
                <div className="rounded-3xl bg-white/10 p-4">
                  <p className="text-slate-200 text-sm">Available doctors</p>
                  <p className="mt-2 text-xl font-semibold">{filteredDoctors.length}</p>
                </div>
                <div className="rounded-3xl bg-white/10 p-4">
                  <p className="text-slate-200 text-sm">Patient satisfaction</p>
                  <p className="mt-2 text-xl font-semibold">95%</p>
                </div>
              </div>
            </div>
          </div>

          {selectedDoctor && (
            <section className="mt-8 rounded-[1.5rem] bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-900">Book with Dr. {selectedDoctor?.user?.name || selectedDoctor?.name || 'Unknown'}</h3>
              <form onSubmit={handleBook} className="mt-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">Appointment date</label>
                  <input type="date" name="appointmentDate" value={formData.appointmentDate} onChange={handleChange} required className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 p-3" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Appointment time</label>
                  <DatePicker
                    selected={selectedTime}
                    onChange={handleTimeChange}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={30}
                    timeCaption="Time"
                    dateFormat="h:mm aa"
                    placeholderText="Select time"
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-slate-900"
                    readOnly
                    required
                  />
                </div>
                <button type="submit" className="w-full rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand/20 transition hover:bg-blue-600">
                  Confirm token
                </button>
                <button type="button" onClick={() => setSelectedDoctor(null)} className="w-full rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
                  Cancel selection
                </button>
              </form>
            </section>
          )}
        </aside>
      </section>

      <section className="mt-12 grid gap-6 lg:grid-cols-3">
        {[
          { title: 'Seamless booking', description: 'Visual booking flow built for patient ease.' },
          { title: 'Doctor visibility', description: 'See ratings, availability, and consultation fees clearly.' },
          { title: 'Modern token system', description: 'Generate and track tokens like a real clinic platform.' },
        ].map((item) => (
          <div key={item.title} className="rounded-[2rem] bg-white p-8 shadow-xl shadow-slate-900/5">
            <p className="text-sm uppercase tracking-[0.3em] text-brand">{item.title}</p>
            <p className="mt-4 text-slate-600">{item.description}</p>
          </div>
        ))}
      </section>

      {/* Payment Flow Modal */}
      {showPaymentFlow && bookedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-8 dark:bg-slate-900">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Complete Your Booking</h2>
              <button
                onClick={closePaymentFlow}
                className="inline-flex items-center justify-center rounded-full w-10 h-10 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={24} />
              </button>
            </div>

            {!paymentProofUploaded ? (
              <div className="grid gap-8 lg:grid-cols-2">
                <QRPaymentCard 
                  doctor={selectedDoctor}
                  amount={selectedDoctor?.consultationFee || 300}
                />
                <PaymentProofUpload 
                  onUpload={handlePaymentProofUpload}
                  isLoading={isUploadingProof}
                />
              </div>
            ) : (
              <div className="max-w-2xl mx-auto">
                <TokenCard
                  payment={{
                    amount: selectedDoctor?.consultationFee || 300,
                    paymentStatus: 'proof_uploaded',
                    tokenStatus: 'pending',
                  }}
                  doctor={selectedDoctor}
                  patient={user}
                  appointment={bookedAppointment}
                />
                
                <button
                  onClick={closePaymentFlow}
                  className="mt-6 w-full inline-flex items-center justify-center rounded-xl bg-brand px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
                >
                  Go to My Tokens
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorsPage;
