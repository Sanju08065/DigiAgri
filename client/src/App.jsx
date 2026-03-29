import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CropRecommendation from './pages/CropRecommendation';
import Complaints from './pages/Complaints';
import Schemes from './pages/Schemes';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminComplaints from './pages/admin/AdminComplaints';
import AdminSchemes from './pages/admin/AdminSchemes';
import AdminUsers from './pages/admin/AdminUsers';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';

const Spinner = () => (
  <div className="flex items-center justify-center h-screen bg-gray-50">
    <div className="w-10 h-10 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin" />
  </div>
);

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
}

// Redirect already-logged-in users away from /login and /register
function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  return children;
}

export default function App() {
  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 3000, style: { borderRadius: '10px', background: '#333', color: '#fff' } }} />
      <Routes>
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="crops" element={<CropRecommendation />} />
          <Route path="complaints" element={<Complaints />} />
          <Route path="schemes" element={<Schemes />} />
        </Route>
        <Route path="/admin" element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="complaints" element={<AdminComplaints />} />
          <Route path="schemes" element={<AdminSchemes />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}
