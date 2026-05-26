import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import ContactPage from './pages/ContactPage';
import AuthPage from './pages/AuthPage';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';

const App = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="grow bg-slate-50">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/auth" element={<AuthPage />} />

            <Route element={<ProtectedRoute allowedRoles={[ 'patient' ]} />}>
              <Route path="/patient" element={<PatientDashboard />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={[ 'doctor' ]} />}>
              <Route path="/doctor" element={<DoctorDashboard />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={[ 'admin' ]} />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <ToastContainer position="top-right" theme="colored" />
      </div>
    </AuthProvider>
  );
};

export default App;
