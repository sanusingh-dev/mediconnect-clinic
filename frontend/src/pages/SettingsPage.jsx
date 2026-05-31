import { useState } from 'react';
import { Shield, Bell, UserCheck } from 'lucide-react';

const SettingsPage = () => {
  const [notifications, setNotifications] = useState(true);
  const [secureAccess, setSecureAccess] = useState(false);

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <div className="rounded-[2rem] bg-white p-10 shadow-xl shadow-slate-900/5 dark:bg-slate-900">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-brand">Settings</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-100">Account preferences</h1>
            <p className="mt-3 text-slate-600 dark:text-slate-300">Adjust your experience, security, and notification settings.</p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm dark:bg-slate-800 dark:text-slate-100">
            <Shield size={18} /> Secure account
          </span>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-[1.8rem] border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950">
            <div className="flex items-center gap-4">
              <div className="rounded-3xl bg-brand/10 p-3 text-brand">
                <Bell size={22} />
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-100">Notifications</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Receive updates about bookings and account activity.</p>
              </div>
            </div>
            <label className="mt-6 inline-flex items-center gap-3 rounded-full bg-slate-100 px-4 py-3 text-sm text-slate-700 dark:bg-slate-900 dark:text-slate-300">
              <input type="checkbox" checked={notifications} onChange={() => setNotifications((value) => !value)} />
              Enable notifications
            </label>
          </div>

          <div className="rounded-[1.8rem] border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950">
            <div className="flex items-center gap-4">
              <div className="rounded-3xl bg-brand/10 p-3 text-brand">
                <UserCheck size={22} />
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-100">Account access</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Use two-factor or secure login options for your account.</p>
              </div>
            </div>
            <label className="mt-6 inline-flex items-center gap-3 rounded-full bg-slate-100 px-4 py-3 text-sm text-slate-700 dark:bg-slate-900 dark:text-slate-300">
              <input type="checkbox" checked={secureAccess} onChange={() => setSecureAccess((value) => !value)} />
              Require secure access
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
