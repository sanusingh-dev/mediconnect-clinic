import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ErrorBoundary from './components/common/ErrorBoundary';
import ProtectedRoute from './components/common/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import DoctorsPage from './pages/DoctorsPage';
import ContactPage from './pages/ContactPage';
import AuthPage from './pages/AuthPage';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import DoctorOnboarding from './pages/DoctorOnboarding';
import MyTokens from './pages/MyTokens';
import AdminDashboard from './pages/AdminDashboard';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import NotFound from './pages/NotFound';

const App = () => (
  <AuthProvider>
    <ThemeProvider>
      <ErrorBoundary>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
          <Navbar />
          <main className="grow">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/doctors" element={<DoctorsPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/auth" element={<AuthPage />} />

              <Route element={<ProtectedRoute allowedRoles={[ 'patient' ]} />}>
                <Route path="/patient" element={<PatientDashboard />} />
                <Route path="/my-tokens" element={<MyTokens />} />
              </Route>

              <Route path="/doctor" element={<Navigate to="/doctor-dashboard" replace />} />
              <Route element={<ProtectedRoute allowedRoles={[ 'doctor' ]} />}>
                <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
                <Route path="/doctor-onboarding" element={<DoctorOnboarding />} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={[ 'admin' ]} />}>
                <Route path="/admin" element={<AdminDashboard />} />
              </Route>

              <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <ToastContainer position="top-right" theme="colored" />
        </div>
      </ErrorBoundary>
    </ThemeProvider>
  </AuthProvider>
);

export default App;
