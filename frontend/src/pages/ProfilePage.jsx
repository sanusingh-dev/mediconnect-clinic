import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ProfilePage = () => {
  const auth = useContext(AuthContext) ?? { user: null, authLoading: true };
  const { user, authLoading } = auth;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      setLoading(false);
    }
  }, [authLoading]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <div className="rounded-[2rem] bg-white p-10 shadow-xl shadow-slate-900/5 dark:bg-slate-900">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-brand">My profile</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-100">Account overview</h1>
            <p className="mt-3 text-slate-600 dark:text-slate-300">Review your profile details and account role information.</p>
          </div>
          <div className="rounded-full bg-brand/10 px-5 py-3 text-sm font-semibold text-brand">{user?.role || 'Patient'}</div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-[1.8rem] bg-slate-50 p-8 shadow-sm dark:bg-slate-900/80">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Name</p>
            <p className="mt-3 text-xl font-semibold text-slate-900 dark:text-slate-100">{user?.name}</p>
          </div>
          <div className="rounded-[1.8rem] bg-slate-50 p-8 shadow-sm dark:bg-slate-900/80">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Email</p>
            <p className="mt-3 text-xl font-semibold text-slate-900 dark:text-slate-100">{user?.email}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-[1.8rem] bg-slate-50 p-6 shadow-sm dark:bg-slate-900/80">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Status</p>
            <p className="mt-3 text-lg font-semibold text-slate-900 dark:text-slate-100">Active</p>
          </div>
          <div className="rounded-[1.8rem] bg-slate-50 p-6 shadow-sm dark:bg-slate-900/80">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Role</p>
            <p className="mt-3 text-lg font-semibold text-slate-900 dark:text-slate-100">{user?.role}</p>
          </div>
          <div className="rounded-[1.8rem] bg-slate-50 p-6 shadow-sm dark:bg-slate-900/80">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Member since</p>
            <p className="mt-3 text-lg font-semibold text-slate-900 dark:text-slate-100">{new Date(user?.createdAt || Date.now()).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
