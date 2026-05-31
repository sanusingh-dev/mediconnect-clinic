import { useState, useContext, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Moon, Sun, User, Settings, LogOut, LayoutGrid } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const auth = useContext(AuthContext) ?? { user: null, logout: () => {} };
  const user = auth.user || null;
  const logout = auth.logout || (() => {});
  const themeContext = useContext(ThemeContext) ?? { theme: 'light', toggleTheme: () => {} };
  const { theme, toggleTheme } = themeContext;
  const navigate = useNavigate();
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const dashboardPath = user?.role === 'doctor'
    ? '/doctor-dashboard'
    : user?.role === 'admin'
    ? '/admin'
    : user
    ? '/patient'
    : '/auth';

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Doctors', path: '/doctors' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-xl shadow-sm transition dark:border-slate-800 dark:bg-slate-950/95">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link to="/" className="flex items-center gap-3 text-2xl font-semibold text-brand dark:text-white">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-brand/10 text-brand">M</span>
          Mediconnect
        </Link>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 shadow-sm transition hover:border-brand hover:bg-brand/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 shadow-sm transition hover:border-brand hover:bg-brand/10 md:hidden dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            aria-label="Toggle navigation"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className={`w-full transition-all duration-300 ${open ? 'block' : 'hidden'} md:block md:w-auto`}>
          <ul className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `inline-flex rounded-2xl px-4 py-2 text-sm font-medium transition ${
                      isActive ? 'bg-brand text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white'
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
                  className={({ isActive }) =>
                    `inline-flex rounded-2xl px-4 py-2 text-sm font-medium transition ${
                      isActive ? 'bg-brand text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white'
                    }`
                  }
                  onClick={() => setOpen(false)}
                >
                  My Tokens
                </NavLink>
              </li>
            )}
            {user ? (
              <li className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setProfileOpen((prev) => !prev)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-700 shadow-sm transition hover:border-brand hover:bg-brand/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  aria-label="Open profile menu"
                >
                  <User size={18} />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-3 w-56 rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-900/10 dark:border-slate-700 dark:bg-slate-900">
                    <Link to="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800">
                      <User size={16} /> My Profile
                    </Link>
                    <Link to={dashboardPath} onClick={() => setProfileOpen(false)} className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800">
                      <LayoutGrid size={16} /> Dashboard
                    </Link>
                    <Link to="/settings" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800">
                      <Settings size={16} /> Settings
                    </Link>
                    <button onClick={handleLogout} className="mt-3 flex w-full items-center gap-3 rounded-2xl bg-slate-50 px-3 py-3 text-sm text-slate-700 transition hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </li>
            ) : (
              <li>
                <Link
                  to="/auth"
                  className="inline-flex rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-600"
                  onClick={() => setOpen(false)}
                >
                  Login / Register
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
