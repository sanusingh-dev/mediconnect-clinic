import { useEffect, useMemo, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FiSearch, FiClipboard, FiCheckCircle, FiUploadCloud, FiFileText, FiShield, FiHeart } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { getDoctorsPublicService } from '../services/doctorService';
import { bookAppointmentService } from '../services/appointmentService';
import { getPatientAppointmentsService, uploadReportService, getPatientPrescriptionsService, getPatientProfileService } from '../services/patientService';
import LoadingSpinner from '../components/common/LoadingSpinner';

const PatientDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({ doctorId: '', appointmentDate: '', timeSlot: '' });
  const [selectedTime, setSelectedTime] = useState(null);
  const [reportData, setReportData] = useState({ filename: '', url: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [doctorRes, appointmentRes, prescriptionRes, profileRes] = await Promise.all([
          getDoctorsPublicService(),
          getPatientAppointmentsService(),
          getPatientPrescriptionsService(),
          getPatientProfileService(),
        ]);
        setDoctors(doctorRes.data);
        setAppointments(appointmentRes.data);
        setPrescriptions(prescriptionRes.data);
        setProfile(profileRes.data);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Unable to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) =>
      doctor.user.name.toLowerCase().includes(searchQuery.toLowerCase()) || doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [doctors, searchQuery]);

  const stats = useMemo(() => {
    const completed = appointments.filter((item) => item.status === 'completed').length;
    const pending = appointments.filter((item) => item.status === 'pending').length;
    return {
      total: appointments.length,
      completed,
      pending,
      reports: reportData.filename ? 1 : 0,
    };
  }, [appointments, reportData.filename]);

  const formatTime = (date) => {
    if (!date) return '';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleTimeChange = (time) => {
    setSelectedTime(time);
    setFormData({ ...formData, timeSlot: time ? formatTime(time) : '' });
  };

  const handleBook = async (event) => {
    event.preventDefault();
    if (!formData.doctorId || !formData.appointmentDate || !formData.timeSlot) {
      toast.error('Please choose a doctor, date, and time before booking.');
      return;
    }

    try {
      const response = await bookAppointmentService(formData);
      setAppointments((prev) => [response.data, ...prev]);
      toast.success('Appointment booked successfully');
      setFormData({ doctorId: '', appointmentDate: '', timeSlot: '' });
      setSelectedTime(null);
      setSearchQuery('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    }
  };

  const handleReport = async (event) => {
    event.preventDefault();
    if (!reportData.filename || !reportData.url) {
      toast.error('Please provide both a report name and URL before uploading.');
      return;
    }

    try {
      await uploadReportService(reportData);
      toast.success('Report uploaded');
      setReportData({ filename: '', url: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
    }
  };

  const handleDrag = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.type === 'dragenter' || event.type === 'dragover') {
      setDragActive(true);
    } else if (event.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      const file = event.dataTransfer.files[0];
      setReportData({ filename: file.name, url: URL.createObjectURL(file) });
      toast.success('Report file selected. Submit to save the entry.');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
        <section className="rounded-[2rem] bg-white p-8 shadow-xl shadow-slate-900/5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-brand">Patient center</p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-900">Your patient dashboard</h1>
              <p className="mt-3 text-slate-600">Manage appointments, upload reports, and stay on top of your tokens with a premium healthcare experience.</p>
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-slate-50 px-6 py-4 text-sm font-semibold text-slate-900 shadow-sm">
              {profile?.user?.name}
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: 'Total appointments', value: stats.total, icon: <FiClipboard size={20} /> },
              { label: 'Completed visits', value: stats.completed, icon: <FiCheckCircle size={20} /> },
              { label: 'Pending tokens', value: stats.pending, icon: <FiClock size={20} /> },
              { label: 'Uploaded reports', value: stats.reports, icon: <FiUploadCloud size={20} /> },
            ].map((card) => (
              <div key={card.label} className="rounded-[1.8rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
                <div className="flex items-center gap-3 text-brand">{card.icon}</div>
                <p className="mt-4 text-3xl font-semibold text-slate-900">{card.value}</p>
                <p className="mt-2 text-sm text-slate-500">{card.label}</p>
              </div>
            ))}
          </div>
        </section>

        <aside className="rounded-[2rem] bg-brand/5 p-8 shadow-xl shadow-brand/10">
          <div className="rounded-[2rem] bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.3em] text-brand">Quick actions</p>
            <h2 className="mt-3 text-xl font-semibold text-slate-900">Book a new appointment</h2>
            <div className="mt-6 space-y-4">
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-sm text-slate-600">Select a doctor and secure your token with a date and time.</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-sm text-slate-600">Upload reports and keep medical documents accessible.</p>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1.35fr_0.9fr]">
        <div className="rounded-[2rem] bg-white p-8 shadow-xl shadow-slate-900/5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-brand">Book appointment</p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-900">Choose doctor, date, and time</h2>
            </div>
            <div className="flex items-center gap-3 rounded-3xl bg-slate-50 px-4 py-3 text-sm text-slate-700 shadow-sm">
              <FiSearch />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search doctors"
                className="w-full bg-transparent text-slate-900 outline-none"
              />
            </div>
          </div>

          <form onSubmit={handleBook} className="mt-8 grid gap-5">
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Doctor</label>
                <select name="doctorId" value={formData.doctorId} onChange={handleChange} required className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900">
                  <option value="">Select doctor</option>
                  {filteredDoctors.map((doctor) => (
                    <option key={doctor._id} value={doctor._id}>
                      Dr. {doctor.user.name} • {doctor.specialty}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Appointment date</label>
                <input name="appointmentDate" type="date" value={formData.appointmentDate} onChange={handleChange} required className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900" />
              </div>
            </div>
            <div className="space-y-2 lg:max-w-md">
              <label className="text-sm font-semibold text-slate-700">Time slot</label>
              <DatePicker
                selected={selectedTime}
                onChange={handleTimeChange}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={30}
                timeCaption="Time"
                dateFormat="h:mm aa"
                placeholderText="Select time"
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900"
                readOnly
                required
              />
            </div>
            <button type="submit" className="w-full rounded-full bg-brand px-6 py-4 text-base font-semibold text-white shadow-lg shadow-brand/20 transition hover:bg-blue-600">
              Reserve appointment
            </button>
          </form>
        </div>

        <aside className="rounded-[2rem] bg-white p-8 shadow-xl shadow-slate-900/5">
          <div className="rounded-3xl bg-slate-50 p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-brand">Quick summary</p>
            <div className="mt-6 grid gap-4">
              <div className="flex items-center justify-between rounded-3xl bg-white px-5 py-4 shadow-sm">
                <div>
                  <p className="text-sm text-slate-500">Upcoming</p>
                  <p className="mt-2 text-xl font-semibold text-slate-900">{appointments.filter((item) => item.status === 'pending').length}</p>
                </div>
                <FiHourglass />
              </div>
              <div className="flex items-center justify-between rounded-3xl bg-white px-5 py-4 shadow-sm">
                <div>
                  <p className="text-sm text-slate-500">Doctors</p>
                  <p className="mt-2 text-xl font-semibold text-slate-900">{doctors.length}</p>
                </div>
                <FiHeart />
              </div>
            </div>
          </div>
        </aside>
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-2">
        <div className="rounded-[2rem] bg-white p-8 shadow-xl shadow-slate-900/5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-brand">Appointment history</p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-900">Recent bookings</h2>
            </div>
            <span className="rounded-full bg-brand/10 px-4 py-2 text-sm font-semibold text-brand">{appointments.length} total</span>
          </div>

          <div className="mt-6 space-y-4">
            {appointments.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-600">
                No appointments yet. Book your first token above.
              </div>
            ) : (
              appointments.slice(0, 6).map((appointment) => (
                <div key={appointment._id} className="rounded-3xl border border-slate-200 p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-lg font-semibold text-slate-900">Dr. {appointment.doctor.user.name}</p>
                      <p className="text-sm text-slate-500">{appointment.doctor.specialty}</p>
                    </div>
                    <span className="rounded-full bg-brand/10 px-4 py-2 text-sm font-semibold text-brand">{appointment.status}</span>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3 text-sm text-slate-600">
                    <p>{new Date(appointment.appointmentDate).toLocaleDateString()}</p>
                    <p>{appointment.timeSlot}</p>
                    <p>Token {appointment.tokenNumber || appointment.token}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-[2rem] bg-white p-8 shadow-xl shadow-slate-900/5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-brand">Reports</p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-900">Upload medical documents</h2>
            </div>
            <FiFileText className="text-brand" size={27} />
          </div>

          <form onSubmit={handleReport} className="mt-8 space-y-5">
            <div
              className={`rounded-[1.8rem] border border-dashed p-8 text-center transition ${
                dragActive ? 'border-brand bg-slate-50' : 'border-slate-200 bg-slate-50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <p className="text-sm text-slate-700">Drag and drop a report file here to prefill details.</p>
            </div>
            <div className="grid gap-4">
              <input
                type="text"
                name="filename"
                value={reportData.filename}
                onChange={(e) => setReportData({ ...reportData, filename: e.target.value })}
                placeholder="Report title"
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4"
              />
              <input
                type="text"
                name="url"
                value={reportData.url}
                onChange={(e) => setReportData({ ...reportData, url: e.target.value })}
                placeholder="File URL or storage link"
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4"
              />
            </div>
            <button type="submit" className="w-full rounded-full bg-brand px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-brand/20 transition hover:bg-blue-600">
              Save report
            </button>
          </form>

          {reportData.filename && (
            <div className="mt-6 rounded-3xl bg-slate-50 p-5 text-slate-700 shadow-sm">
              <p className="font-semibold">Preview</p>
              <p className="mt-2 text-sm">{reportData.filename}</p>
            </div>
          )}

          <div className="mt-8 space-y-4 rounded-[1.8rem] bg-slate-50 p-6">
            <div className="flex items-center gap-3 text-brand">
              <FiShield size={20} /> <span className="font-semibold">Secure storage</span>
            </div>
            <p className="text-sm text-slate-600">Your medical documents are recorded safely within the patient dashboard experience.</p>
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-[2rem] bg-white p-8 shadow-xl shadow-slate-900/5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-brand">Prescriptions</p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-900">Recent medication notes</h2>
          </div>
          <span className="rounded-full bg-brand/10 px-4 py-2 text-sm font-semibold text-brand">{prescriptions.length} items</span>
        </div>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {prescriptions.length === 0 ? (
            <div className="col-span-full rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-600">
              No prescriptions available yet.
            </div>
          ) : (
            prescriptions.slice(0, 4).map((prescription) => (
              <div key={prescription._id} className="rounded-3xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-slate-900">Dr. {prescription.doctor.user.name}</p>
                  <span className="rounded-full bg-brand/10 px-3 py-1 text-sm font-semibold text-brand">New</span>
                </div>
                <p className="mt-4 text-sm text-slate-600">{prescription.instructions || 'Prescription details are available after consultation.'}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default PatientDashboard;
