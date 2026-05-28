import { Link } from 'react-router-dom';
import { FiCheckCircle, FiHeart, FiShield, FiTrendingUp, FiUsers, FiClock, FiSmile } from 'react-icons/fi';

const LandingPage = () => {
  return (
    <div className="mx-auto max-w-7xl px-6 pb-20 pt-12">
      <section className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-brand">
            Clinic Intelligence
          </div>
          <div className="space-y-6">
            <h1 className="text-5xl font-semibold tracking-tight text-slate-900 sm:text-6xl">
              Healthcare operations, simplified for every clinic.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              Mediconnect brings patient booking, token management, and provider workflows into one polished healthcare platform built for modern clinics.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Link to="/doctors" className="inline-flex items-center justify-center rounded-full bg-brand px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-brand/20 transition hover:bg-blue-600">
              Find a doctor
            </Link>
            <Link to="/auth" className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-8 py-4 text-sm font-semibold text-slate-900 transition hover:border-brand hover:text-brand">
              Get started
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: 'Global clinics', value: '2,100+' },
              { label: 'Appointments daily', value: '8,900+' },
              { label: 'Patients served', value: '120K+' },
            ].map((item) => (
              <div key={item.label} className="rounded-3xl bg-slate-50 p-6">
                <p className="text-3xl font-semibold text-slate-900">{item.value}</p>
                <p className="mt-2 text-sm text-slate-500">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blue-600 via-sky-500 to-indigo-500 p-8 text-white shadow-2xl shadow-slate-900/10">
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at top left, rgba(255,255,255,0.35), transparent 26%), radial-gradient(circle at bottom right, rgba(255,255,255,0.2), transparent 18%)' }} />
          <div className="relative grid gap-6">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-200">Premium healthcare</p>
              <h2 className="text-4xl font-semibold">All patient flows in one beautiful dashboard.</h2>
              <p className="max-w-xl text-slate-200">Book tokens, manage appointments, and give providers the tools they need to deliver exceptional care.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-white/10 p-5 shadow-inner shadow-slate-900/10">
                <p className="text-2xl font-semibold">Patient first</p>
                <p className="mt-2 text-sm text-slate-100">Modern self-service booking and history tracking.</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-5 shadow-inner shadow-slate-900/10">
                <p className="text-2xl font-semibold">Doctor tools</p>
                <p className="mt-2 text-sm text-slate-100">Fast queue management and appointment workflows.</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-4 text-slate-200">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-white/15 text-xl text-white">❤</span>
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-300">Trusted by clinics</p>
                <p className="text-lg font-semibold">Over 150 hospitals rely on Mediconnect.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-16 rounded-[2rem] bg-white p-8 shadow-xl shadow-slate-900/5">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-brand">Platform highlights</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900">A premium healthcare admin experience.</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { title: 'Smart booking', icon: <FiClock size={20} /> },
              { title: 'Token management', icon: <FiTrendingUp size={20} /> },
              { title: 'Secure reports', icon: <FiShield size={20} /> },
            ].map((feature) => (
              <div key={feature.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand">{feature.icon}</div>
                <p className="mt-4 text-lg font-semibold text-slate-900">{feature.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-16 grid gap-8 lg:grid-cols-3">
        <div className="rounded-[2rem] bg-slate-950 p-10 text-white shadow-2xl shadow-slate-900/20">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Quick overview</p>
          <h2 className="mt-5 text-3xl font-semibold">Designed for modern clinics.</h2>
          <p className="mt-4 text-slate-300">Everything from token creation to doctor follow-up is available in a clean, professional experience.</p>
        </div>
        <div className="space-y-4">
          {[
            { title: 'Easy booking', description: 'Create appointment tokens with a few clicks.' },
            { title: 'Patient history', description: 'Track visits, reports, and prescriptions in one place.' },
            { title: 'Doctor workflow', description: 'Manage appointments, accept requests, and complete visits.' },
          ].map((item) => (
            <div key={item.title} className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-lg font-semibold text-slate-900">{item.title}</p>
              <p className="mt-3 text-slate-600">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-[2rem] bg-white p-10 shadow-xl shadow-slate-900/5">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-brand">Testimonials</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900">Clinics love the simplicity.</h2>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {
              quote: 'Mediconnect transformed our booking flow and made patient check-in seamless.',
              name: 'Dr. Sarah Lee',
              title: 'Clinic Director',
            },
            {
              quote: 'The token system is intuitive, and our patients can manage appointments easily.',
              name: 'Alex Kim',
              title: 'Practice Manager',
            },
            {
              quote: 'Our doctor team now handles visits faster with a polished dashboard experience.',
              name: 'Mina Patel',
              title: 'Head Nurse',
            },
          ].map((item) => (
            <div key={item.name} className="rounded-3xl border border-slate-200 bg-slate-50 p-8">
              <p className="text-slate-700">“{item.quote}”</p>
              <p className="mt-6 font-semibold text-slate-900">{item.name}</p>
              <p className="text-sm text-slate-500">{item.title}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-[2rem] bg-slate-950 p-10 text-white shadow-2xl shadow-slate-900/20">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Frequently asked</p>
            <h2 className="mt-4 text-3xl font-semibold">Everything you need for a modern clinic platform.</h2>
          </div>
          <div className="grid gap-4">
            {[
              { question: 'Can patients book appointments easily?', answer: 'Yes, token creation is fast and guided for every patient.' },
              { question: 'Does it support doctor workflows?', answer: 'Doctors can accept, reject, or complete tokens in a streamlined dashboard.' },
              { question: 'Is the interface mobile friendly?', answer: 'Yes, every page is responsive for tablet and mobile use.' },
            ].map((item) => (
              <div key={item.question} className="rounded-3xl bg-slate-900/90 p-6">
                <p className="font-semibold text-white">{item.question}</p>
                <p className="mt-2 text-slate-300">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
