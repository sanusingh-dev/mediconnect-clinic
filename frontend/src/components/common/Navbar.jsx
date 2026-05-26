import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-xl font-semibold text-brand">
          Mediconnect
        </Link>

        <nav className="flex items-center gap-4 text-sm text-slate-700">
          <NavLink to="/" className="hover:text-brand">Home</NavLink>
          <NavLink to="/" className="hover:text-brand">Doctors</NavLink>
          <NavLink to="/" className="hover:text-brand">About</NavLink>
          <NavLink to="/contact" className="hover:text-brand">Contact</NavLink>
          {!user && <NavLink to="/auth" className="text-brand font-medium">Login / Register</NavLink>}
          {user && (
            <button onClick={handleLogout} className="rounded-full bg-brand px-4 py-2 text-white hover:bg-blue-600">
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
