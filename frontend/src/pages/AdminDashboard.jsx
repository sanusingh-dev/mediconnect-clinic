import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getAnalyticsService, getUsersService, getAppointmentsService, deleteUserService } from '../services/adminService';
import LoadingSpinner from '../components/common/LoadingSpinner';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [analyticsRes, usersRes, appointmentsRes] = await Promise.all([
          getAnalyticsService(),
          getUsersService({ search, limit: 5 }),
          getAppointmentsService(),
        ]);
        setAnalytics(analyticsRes.data);
        setUsers(usersRes.data.users);
        setAppointments(appointmentsRes.data.slice(0, 5));
      } catch (error) {
        toast.error(error.response?.data?.message || 'Unable to load admin dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [search]);

  const handleRemove = async (id) => {
    try {
      await deleteUserService(id);
      setUsers(users.filter((user) => user._id !== id));
      toast.success('User removed');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="grid gap-6 xl:grid-cols-4">
        {analytics && (
          <> 
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Users</p>
              <p className="mt-4 text-3xl font-semibold text-slate-900">{analytics.users}</p>
            </div>
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Doctors</p>
              <p className="mt-4 text-3xl font-semibold text-slate-900">{analytics.doctors}</p>
            </div>
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Appointments</p>
              <p className="mt-4 text-3xl font-semibold text-slate-900">{analytics.appointments}</p>
            </div>
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Revenue est.</p>
              <p className="mt-4 text-3xl font-semibold text-slate-900">${analytics.revenueEstimate}</p>
            </div>
          </>
        )}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">User management</h2>
              <p className="text-sm text-slate-600">Search by user name to find accounts quickly.</p>
            </div>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users" className="max-w-sm" />
          </div>
          <div className="mt-6 space-y-4">
            {users.length === 0 ? (
              <p className="text-slate-600">No users found.</p>
            ) : (
              users.map((user) => (
                <div key={user._id} className="flex flex-col gap-3 rounded-3xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{user.name}</p>
                    <p className="text-sm text-slate-600">{user.email} • {user.role}</p>
                  </div>
                  <button onClick={() => handleRemove(user._id)} className="rounded-full bg-rose-500 px-4 py-2 text-white hover:bg-rose-600">
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Recent appointments</h2>
          <div className="mt-6 space-y-4">
            {appointments.length === 0 ? (
              <p className="text-slate-600">No recent appointments available.</p>
            ) : (
              appointments.map((appointment) => (
                <div key={appointment._id} className="rounded-3xl border border-slate-200 p-4">
                  <p className="font-semibold text-slate-900">{appointment.patient?.user?.name} with Dr. {appointment.doctor?.user?.name}</p>
                  <p className="text-sm text-slate-600">{new Date(appointment.appointmentDate).toLocaleDateString()} • {appointment.timeSlot}</p>
                  <p className="mt-2 text-sm">Status: <span className="font-semibold">{appointment.status}</span></p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
