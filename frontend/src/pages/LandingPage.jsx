import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <section className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="mb-4 inline-flex rounded-full bg-brand/10 px-4 py-1 text-sm font-semibold uppercase tracking-wide text-brand">
            Clinic Management
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Run your clinic with confidence
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Mediconnect is a full-stack clinic management platform for patients, doctors, and administrators.
            Book appointments, write prescriptions, and monitor revenue all from one modern dashboard.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link to="/auth" className="rounded-full bg-brand px-6 py-3 text-white shadow-sm hover:bg-blue-600">
              Get Started
            </Link>
            <a href="#features" className="rounded-full border border-slate-300 px-6 py-3 text-slate-700 hover:bg-slate-100">
              Explore Features
            </a>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-200">
          <div className="space-y-6">
            <div className="rounded-3xl bg-slate-50 p-6">
              <h2 className="text-xl font-semibold text-slate-900">Smart appointment booking</h2>
              <p className="mt-3 text-slate-600">Patients can view doctor availability and confirm time slots instantly.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-white p-5 shadow-sm">
                <h3 className="font-semibold text-slate-900">Doctor dashboard</h3>
                <p className="mt-2 text-sm text-slate-600">Track today’s patients, update status, and create prescriptions.</p>
              </div>
              <div className="rounded-3xl bg-white p-5 shadow-sm">
                <h3 className="font-semibold text-slate-900">Admin insights</h3>
                <p className="mt-2 text-sm text-slate-600">Monitor users, appointments, and revenue in one place.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mt-20 space-y-8">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-brand">Core Features</p>
          <h2 className="mt-4 text-3xl font-semibold text-slate-900">A complete platform for clinics and hospitals</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900">Patient experience</h3>
            <p className="mt-3 text-slate-600">Book appointments, view history and upload reports with secure patient access.</p>
          </div>
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900">Doctor workflow</h3>
            <p className="mt-3 text-slate-600">See today’s schedule, manage appointments, and write prescriptions quickly.</p>
          </div>
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900">Admin control</h3>
            <p className="mt-3 text-slate-600">Manage doctors and users, track analytics, and review all appointments.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
