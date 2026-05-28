import { useState } from 'react';
import { FiMail, FiMapPin, FiPhone, FiMessageCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';

const ContactPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Message sent. We will get back to you shortly.');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[2rem] bg-white p-10 shadow-xl shadow-slate-900/5">
          <p className="text-sm uppercase tracking-[0.3em] text-brand">Contact support</p>
          <h1 className="mt-4 text-4xl font-semibold text-slate-900">We’re here to help your clinic succeed.</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
            Whether you have questions, need onboarding support, or want to learn more about Mediconnect, our team is ready to support your practice.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div className="rounded-[1.8rem] bg-slate-50 p-6 shadow-sm">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                <FiMail size={20} />
              </div>
              <p className="mt-4 font-semibold text-slate-900">Email</p>
              <p className="mt-2 text-slate-600">support@mediconnect.com</p>
            </div>
            <div className="rounded-[1.8rem] bg-slate-50 p-6 shadow-sm">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                <FiPhone size={20} />
              </div>
              <p className="mt-4 font-semibold text-slate-900">Phone</p>
              <p className="mt-2 text-slate-600">+1 (555) 123-4567</p>
            </div>
          </div>

          <div className="mt-10 rounded-[1.8rem] border border-slate-200 bg-slate-50 p-8">
            <p className="font-semibold text-slate-900">Visit us</p>
            <p className="mt-3 text-slate-600">123 Health Avenue, MedCity, Healthcare District</p>
          </div>
        </section>

        <section className="rounded-[2rem] bg-slate-950 p-10 text-white shadow-2xl shadow-slate-900/20">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-300">Send us a message</p>
            <h2 className="text-3xl font-semibold">Get support or request a demo.</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="rounded-[1.8rem] bg-slate-900/80 p-4 shadow-inner">
                <label className="block text-sm font-semibold text-slate-200">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="mt-3 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-4 text-slate-100 outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
                />
              </div>
              <div className="rounded-[1.8rem] bg-slate-900/80 p-4 shadow-inner">
                <label className="block text-sm font-semibold text-slate-200">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows="6"
                  placeholder="Tell us how we can help you"
                  required
                  className="mt-3 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-4 text-slate-100 outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
                />
              </div>
              <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-brand/30 transition hover:bg-blue-600">
                <FiMessageCircle size={18} /> Send message
              </button>
            </form>

            <div className="rounded-[1.8rem] bg-slate-900/80 p-6 text-slate-300 shadow-inner">
              <p className="font-semibold text-white">Support hours</p>
              <p className="mt-3">Mon–Fri: 9:00 AM — 6:00 PM</p>
              <p className="mt-2">Live chat available during business hours.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ContactPage;
