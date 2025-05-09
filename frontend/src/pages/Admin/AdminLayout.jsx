import { useState, useEffect, useRef } from 'react';
import { useNavigate, Outlet, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { GrDashboard } from 'react-icons/gr';
import { FaUserDoctor, FaUsers, FaCalendarCheck } from 'react-icons/fa6';
import { FaTrash, FaBars, FaTimes } from 'react-icons/fa';
import { BiLogOut } from 'react-icons/bi';
import logo from '../../assets/images/logo.png';
import HashLoader from 'react-spinners/HashLoader';

const AdminLayout = () => {
  const navigate = useNavigate();
  const { user, token, role, dispatch } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  useEffect(() => {
    // Check if user is authenticated and is an admin
    if (!token) {
      toast.error('Please login to access admin dashboard');
      navigate('/login');
      return;
    }

    if (role !== 'admin') {
      toast.error('You are not authorized to access admin dashboard');
      navigate('/');
      return;
    }

    setLoading(false);
  }, [token, role, navigate]);

  // Handle click outside to close sidebar on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarOpen]);

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <HashLoader size={45} color="#0067FF" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Mobile Header */}
      <div className="md:hidden bg-white shadow-md p-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Medicare Logo" className="h-8" />
        </Link>
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium text-gray-600">Admin</span>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200"
          >
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Mobile: Absolute positioned overlay, Desktop: Static sidebar */}
        <div
          ref={sidebarRef}
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 fixed md:static inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out md:shadow-md md:transition-none overflow-y-auto`}
        >
          {/* Sidebar Header - Hidden on mobile as we have the top header */}
          <div className="hidden md:block p-4 border-b">
            <Link to="/">
              <img src={logo} alt="Medicare Logo" className="h-10" />
            </Link>
          </div>
          <div className="p-4">
            <h2 className="text-xl font-semibold text-gray-800">Admin Dashboard</h2>
            <p className="text-sm text-gray-600 mt-1">Welcome, {user?.name}</p>
          </div>
          <nav className="mt-2">
            <Link
              to="/admin"
              className={`flex items-center px-6 py-3 ${
                activeMenu === 'dashboard' ? 'bg-blue-50 text-primaryColor' : 'text-gray-600'
              } hover:bg-blue-50 hover:text-primaryColor transition-colors duration-200`}
              onClick={() => {
                setActiveMenu('dashboard');
                setSidebarOpen(false);
              }}
            >
              <GrDashboard className="mr-3 flex-shrink-0" />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/admin/doctors"
              className={`flex items-center px-6 py-3 ${
                activeMenu === 'doctors' ? 'bg-blue-50 text-primaryColor' : 'text-gray-600'
              } hover:bg-blue-50 hover:text-primaryColor transition-colors duration-200`}
              onClick={() => {
                setActiveMenu('doctors');
                setSidebarOpen(false);
              }}
            >
              <FaUserDoctor className="mr-3 flex-shrink-0" />
              <span>Doctors</span>
            </Link>
            <Link
              to="/admin/users"
              className={`flex items-center px-6 py-3 ${
                activeMenu === 'users' ? 'bg-blue-50 text-primaryColor' : 'text-gray-600'
              } hover:bg-blue-50 hover:text-primaryColor transition-colors duration-200`}
              onClick={() => {
                setActiveMenu('users');
                setSidebarOpen(false);
              }}
            >
              <FaUsers className="mr-3 flex-shrink-0" />
              <span>Users</span>
            </Link>
            <Link
              to="/admin/appointments"
              className={`flex items-center px-6 py-3 ${
                activeMenu === 'appointments' ? 'bg-blue-50 text-primaryColor' : 'text-gray-600'
              } hover:bg-blue-50 hover:text-primaryColor transition-colors duration-200`}
              onClick={() => {
                setActiveMenu('appointments');
                setSidebarOpen(false);
              }}
            >
              <FaCalendarCheck className="mr-3 flex-shrink-0" />
              <span>Appointments</span>
            </Link>
            <Link
              to="/admin/deletion-requests"
              className={`flex items-center px-6 py-3 ${
                activeMenu === 'deletion-requests' ? 'bg-blue-50 text-primaryColor' : 'text-gray-600'
              } hover:bg-blue-50 hover:text-primaryColor transition-colors duration-200`}
              onClick={() => {
                setActiveMenu('deletion-requests');
                setSidebarOpen(false);
              }}
            >
              <FaTrash className="mr-3 flex-shrink-0" />
              <span>Deletion Requests</span>
            </Link>
            <button
              onClick={() => {
                handleLogout();
                setSidebarOpen(false);
              }}
              className="flex items-center px-6 py-3 text-gray-600 hover:bg-red-50 hover:text-red-500 transition-colors duration-200 w-full text-left"
            >
              <BiLogOut className="mr-3 flex-shrink-0" />
              <span>Logout</span>
            </button>
          </nav>
        </div>

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
