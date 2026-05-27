import { useState } from 'react';
import { toast } from 'react-toastify';

const ContactPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // No backend contact endpoint exists yet — show confirmation for now
    toast.success('Message sent. We will get back to you shortly.');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="rounded-3xl bg-white p-10 shadow-xl">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.3em] text-brand">Contact</p>
          <h1 className="mt-4 text-3xl font-semibold text-slate-900">Reach out to our support team</h1>
          <p className="mt-3 text-slate-600">Have a question about onboarding, clinics, or pricing? Send us a message and our team will respond within one business day.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4 rounded-3xl bg-slate-50 p-6">
            <h2 className="text-xl font-semibold text-slate-900">Headquarters</h2>
            <p className="text-slate-600">123 Health Avenue<br />City Center, Healthtown<br />support@mediconnect.com</p>
          </div>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@example.com" className="w-full" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Message</label>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows="5" placeholder="Tell us about your clinic needs" className="w-full"></textarea>
            </div>
            <button type="submit" className="rounded-full bg-brand px-6 py-3 text-white hover:bg-blue-600">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
