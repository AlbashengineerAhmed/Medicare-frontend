import React, { lazy, Suspense } from 'react';
import { Loader } from '../components/UI';

// Lazy load pages
const Home = lazy(() => import("../pages/Home"));
const Services = lazy(() => import("../pages/Services"));
const Login = lazy(() => import("../pages/Login"));
const Signup = lazy(() => import("../pages/Signup"));
const ForgotPassword = lazy(() => import("../pages/ForgotPassword"));
const Contact = lazy(() => import("../pages/Contact"));
const Doctors = lazy(() => import("../pages/Doctors/Doctors"));
const DoctorsDetails = lazy(() => import("../pages/Doctors/DoctorsDetails"));
const UserProfile = lazy(() => import("../pages/UserProfile"));
const DoctorProfile = lazy(() => import("../pages/Doctor/DoctorProfile"));

// Admin pages
const AdminLayout = lazy(() => import("../pages/Admin/AdminLayout"));
const Dashboard = lazy(() => import("../pages/Admin/Dashboard"));
const DoctorManagement = lazy(() => import("../pages/Admin/DoctorManagement"));
const UserManagement = lazy(() => import("../pages/Admin/UserManagement"));
const AppointmentManagement = lazy(() => import("../pages/Admin/AppointmentManagement"));
const DeletionRequests = lazy(() => import("../pages/Admin/DeletionRequests"));

import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Protected route component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { token, role } = useAuth();

  // Get role directly from localStorage for reliability
  const storedRole = localStorage.getItem('role');

  // Use the stored role if available, otherwise fall back to the context role
  const effectiveRole = storedRole || role;

  console.log("Protected Route - Path:", window.location.pathname);
  console.log("Protected Route - Context Role:", role, "Stored Role:", storedRole, "Effective Role:", effectiveRole, "Allowed Roles:", allowedRoles);

  // Special case for doctor profile
  if (window.location.pathname === '/doctor/profile' && storedRole === 'doctor') {
    console.log("Doctor accessing doctor profile - allowing access");
    return children;
  }

  if (!token) {
    console.log("No token, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // Check if the user has a valid role
  if (allowedRoles && !allowedRoles.includes(effectiveRole)) {
    console.log("Role not allowed, redirecting to home");

    // If it's a doctor trying to access their profile but the role check failed
    if (window.location.pathname === '/doctor/profile' && effectiveRole === 'doctor') {
      console.log("Doctor role detected but role check failed - allowing access anyway");
      return children;
    }

    return <Navigate to="/" replace />;
  }

  return children;
};

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader size="lg" />
  </div>
);

// Wrap component with Suspense
const withSuspense = (Component) => (
  <Suspense fallback={<LoadingFallback />}>
    {Component}
  </Suspense>
);

const Routers = () => {
  return (
    <Routes>
      <Route path='/' element={withSuspense(<Home />)} />
      <Route path='/home' element={withSuspense(<Home />)} />
      <Route path='/doctors' element={withSuspense(<Doctors />)} />
      <Route path='/doctors/:id' element={withSuspense(<DoctorsDetails />)} />
      <Route path='/login' element={withSuspense(<Login />)} />
      <Route path='/register' element={withSuspense(<Signup />)} />
      <Route path='/forgot-password' element={withSuspense(<ForgotPassword />)} />
      <Route path='/contact' element={withSuspense(<Contact />)} />
      <Route path='/services' element={withSuspense(<Services />)} />

      {/* Protected routes */}
      <Route
        path='/profile'
        element={
          <ProtectedRoute allowedRoles={['patient']}>
            {withSuspense(<UserProfile />)}
          </ProtectedRoute>
        }
      />

      <Route
        path='/doctor/profile'
        element={
          <ProtectedRoute allowedRoles={['doctor']}>
            {withSuspense(<DoctorProfile />)}
          </ProtectedRoute>
        }
      />

      {/* Admin routes */}
      <Route
        path='/admin'
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            {withSuspense(<AdminLayout />)}
          </ProtectedRoute>
        }
      >
        <Route index element={withSuspense(<Dashboard />)} />
        <Route path='doctors' element={withSuspense(<DoctorManagement />)} />
        <Route path='users' element={withSuspense(<UserManagement />)} />
        <Route path='appointments' element={withSuspense(<AppointmentManagement />)} />
        <Route path='deletion-requests' element={withSuspense(<DeletionRequests />)} />
      </Route>
    </Routes>
  );
};

export default Routers;