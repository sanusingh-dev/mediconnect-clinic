import { FiActivity, FiShield, FiUsers, FiHeart } from 'react-icons/fi';

const AboutPage = () => {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-6">
          <p className="text-sm uppercase tracking-[0.3em] text-brand">About Mediconnect</p>
          <h1 className="text-4xl font-semibold text-slate-900 sm:text-5xl">A healthcare platform built for today’s clinics and care teams.</h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-600">
            Mediconnect streamlines patient booking, token management, and staff workflows inside one premium clinic dashboard. Designed for speed, reliability, and a polished healthcare experience.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { title: 'Patient-first design', description: 'Intuitive token booking and appointment history for every patient.' },
              { title: 'Doctor productivity', description: 'Clear appointment flow, status controls, and fast token handling.' },
            ].map((item) => (
              <div key={item.title} className="rounded-[2rem] bg-slate-50 p-6 shadow-sm">
                <p className="text-lg font-semibold text-slate-900">{item.title}</p>
                <p className="mt-2 text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[2rem] bg-gradient-to-br from-brand to-sky-500 p-10 text-white shadow-2xl shadow-brand/20">
          <div className="space-y-5">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-200">Our mission</p>
            <h2 className="text-3xl font-semibold">Build trust and efficiency across clinics.</h2>
            <p className="text-slate-200">We empower healthcare teams with a beautiful, secure interface for booking, patient management, and daily operations.</p>
            <div className="grid gap-4 pt-6 sm:grid-cols-2">
              {[
                { icon: <FiUsers />, label: 'Team collaboration' },
                { icon: <FiShield />, label: 'Secure data' },
                { icon: <FiActivity />, label: 'Actionable metrics' },
                { icon: <FiHeart />, label: 'Patient care' },
              ].map((item) => (
                <div key={item.label} className="rounded-3xl bg-white/10 p-5 text-sm">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 text-white">{item.icon}</div>
                  <p className="mt-4 font-semibold">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-16 rounded-[2rem] bg-white p-10 shadow-xl shadow-slate-900/5">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { title: 'Mission', description: 'Help clinics run faster with token booking and appointment management.' },
            { title: 'Vision', description: 'Create polished healthcare workflows that patients and providers love.' },
            { title: 'Values', description: 'Security, clarity, and accessible clinic care for every user.' },
          ].map((item) => (
            <div key={item.title} className="rounded-[1.8rem] border border-slate-200 p-6 shadow-sm">
              <p className="text-lg font-semibold text-slate-900">{item.title}</p>
              <p className="mt-3 text-slate-600">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-[2rem] bg-slate-50 p-10 shadow-xl shadow-slate-900/5">
        <div className="grid gap-6 md:grid-cols-2">
          {[
            { value: '120K+', label: 'Patients served' },
            { value: '2,100+', label: 'Clinics onboarded' },
            { value: '95%', label: 'Patient satisfaction' },
            { value: '24/7', label: 'Support availability' },
          ].map((item) => (
            <div key={item.label} className="rounded-[1.8rem] bg-white p-8 text-center shadow-sm">
              <p className="text-4xl font-semibold text-slate-900">{item.value}</p>
              <p className="mt-3 text-sm text-slate-500">{item.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
