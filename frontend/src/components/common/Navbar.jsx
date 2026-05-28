import { useState, useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Doctors', path: '/doctors' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-slate-50/95 backdrop-blur-xl shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link to="/" className="flex items-center gap-3 text-2xl font-semibold text-brand">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-brand/10 text-brand">M</span>
          Mediconnect
        </Link>

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white p-3 text-slate-700 shadow-sm md:hidden"
          aria-label="Toggle navigation"
        >
          {open ? <FiX size={18} /> : <FiMenu size={18} />}
        </button>

        <nav className={`w-full transition-all duration-300 ${open ? 'block' : 'hidden'} md:block md:w-auto`}>
          <ul className="flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `inline-flex rounded-2xl px-4 py-2 text-sm font-medium transition ${
                      isActive ? 'bg-brand text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`
                  }
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
            {user?.role === 'patient' && (
              <li>
                <NavLink
                  to="/my-tokens"
                  className="inline-flex rounded-2xl px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                  onClick={() => setOpen(false)}
                >
                  My Tokens
                </NavLink>
              </li>
            )}
            {user ? (
              <li>
                <button
                  onClick={handleLogout}
                  className="inline-flex rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-600"
                >
                  Logout
                </button>
              </li>
            ) : (
              <li>
                <NavLink
                  to="/auth"
                  className="inline-flex rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-600"
                  onClick={() => setOpen(false)}
                >
                  Login / Register
                </NavLink>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
