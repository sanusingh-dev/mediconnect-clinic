import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, authLoading } = useContext(AuthContext);

  if (authLoading) {
    return <div className="flex min-h-[calc(100vh-170px)] items-center justify-center"><LoadingSpinner /></div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const fallback = user.role === 'doctor' ? '/doctor-dashboard' : user.role === 'admin' ? '/admin' : '/patient';
    return <Navigate to={fallback} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
