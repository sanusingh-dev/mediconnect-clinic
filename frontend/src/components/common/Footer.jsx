const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white py-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 text-slate-600 md:flex-row md:items-center md:justify-between">
        <p>© 2026 Mediconnect. Built for modern clinic management.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-brand">Privacy</a>
          <a href="#" className="hover:text-brand">Terms</a>
          <a href="#" className="hover:text-brand">Support</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
