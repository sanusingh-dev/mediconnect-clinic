import { FiMail, FiPhone, FiGithub, FiYoutube, FiLinkedin } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-slate-100 py-14">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-3">
        <div className="space-y-4">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand/10 text-brand text-lg font-semibold">M</div>
          <p className="max-w-sm text-slate-600">
            Mediconnect helps modern clinics manage appointments, tokens, and patient workflows with a secure, polished care platform.
          </p>
          <div className="flex gap-3 text-slate-600">
            <a href="#" className="rounded-full bg-white p-3 text-slate-700 shadow-sm transition hover:bg-brand hover:text-white">
              <FiGithub size={18} />
            </a>
            <a href="#" className="rounded-full bg-white p-3 text-slate-700 shadow-sm transition hover:bg-brand hover:text-white">
              <FiLinkedin size={18} />
            </a>
            <a href="#" className="rounded-full bg-white p-3 text-slate-700 shadow-sm transition hover:bg-brand hover:text-white">
              <FiYoutube size={18} />
            </a>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-slate-900">Company</h3>
            <ul className="space-y-3 text-slate-600">
              <li><a href="/about" className="hover:text-brand">About</a></li>
              <li><a href="/contact" className="hover:text-brand">Contact</a></li>
              <li><a href="/doctors" className="hover:text-brand">Doctors</a></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-slate-900">Contact</h3>
            <div className="space-y-3 text-slate-600">
              <p className="flex items-center gap-2"><FiMail /> support@mediconnect.com</p>
              <p className="flex items-center gap-2"><FiPhone /> +1 (555) 123-4567</p>
              <p>123 Health Avenue, MedCity</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-brand/5 p-6">
          <p className="text-sm uppercase tracking-[0.28em] text-brand">Newsletter</p>
          <h3 className="mt-4 text-2xl font-semibold text-slate-900">Stay informed on new features</h3>
          <p className="mt-3 text-slate-600">Subscribe for product updates, support tips, and healthcare platform news.</p>
          <form className="mt-6 space-y-3">
            <input type="email" placeholder="Enter your email" className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
            <button type="button" className="inline-flex w-full items-center justify-center rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-600">
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
