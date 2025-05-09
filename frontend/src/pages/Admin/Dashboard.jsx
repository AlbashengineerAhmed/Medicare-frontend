import { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import { toast } from 'react-toastify';
import { formatDate } from '../../utils/formatDate';
import HashLoader from 'react-spinners/HashLoader';
import { FaUserMd, FaUsers, FaCalendarCheck, FaSpinner, FaTrash } from 'react-icons/fa';
import defaultAvatar from '../../assets/images/avatar-icon.png';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const result = await adminService.getDashboardStats();

        if (result.success) {
          setStats(result.data);
        } else {
          toast.error(result.message || 'Failed to fetch dashboard statistics');
        }
      } catch (error) {
        toast.error('Failed to fetch dashboard statistics. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <HashLoader size={45} color="#0067FF" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-2 sm:space-y-0">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <div className="text-xs sm:text-sm text-gray-500 bg-white px-2 py-1 sm:px-3 sm:py-2 rounded-lg shadow-sm border border-gray-100 inline-block">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {/* Total Doctors Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-blue-100">
          <div className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-blue-100 rounded-lg">
                <FaUserMd className="text-primaryColor text-lg" />
              </div>
              <h3 className="text-gray-600 text-sm font-medium">Total Doctors</h3>
            </div>
            <div className="mt-4">
              <p className="text-2xl sm:text-3xl font-bold text-gray-800">{stats?.totalDoctors || 0}</p>
            </div>
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm space-y-2 sm:space-y-0">
              <div className="flex items-center">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500 mr-1.5 sm:mr-2 flex-shrink-0"></div>
                <span className="text-gray-600">{stats?.approvedDoctors || 0} Approved</span>
              </div>
              <div className="flex items-center">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500 mr-1.5 sm:mr-2 flex-shrink-0"></div>
                <span className="text-gray-600">{stats?.pendingDoctors || 0} Pending</span>
              </div>
            </div>
          </div>
        </div>

        {/* Total Patients Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-green-100">
          <div className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-green-100 rounded-lg">
                <FaUsers className="text-green-600 text-lg" />
              </div>
              <h3 className="text-gray-600 text-sm font-medium">Total Patients</h3>
            </div>
            <div className="mt-4">
              <p className="text-2xl sm:text-3xl font-bold text-gray-800">{stats?.totalPatients || 0}</p>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Total Appointments Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-purple-100">
          <div className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-purple-100 rounded-lg">
                <FaCalendarCheck className="text-purple-600 text-lg" />
              </div>
              <h3 className="text-gray-600 text-sm font-medium">Total Appointments</h3>
            </div>
            <div className="mt-4">
              <p className="text-2xl sm:text-3xl font-bold text-gray-800">{stats?.totalAppointments || 0}</p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 mr-1.5"></div>
                <span className="text-gray-600">{stats?.appointmentStats?.pending || 0} Pending</span>
              </div>
              <div className="flex items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 mr-1.5"></div>
                <span className="text-gray-600">{stats?.appointmentStats?.confirmed || 0} Confirmed</span>
              </div>
              <div className="flex items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 mr-1.5"></div>
                <span className="text-gray-600">{stats?.appointmentStats?.completed || 0} Completed</span>
              </div>
              <div className="flex items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 mr-1.5"></div>
                <span className="text-gray-600">{stats?.appointmentStats?.cancelled || 0} Cancelled</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Approvals Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-yellow-100">
          <div className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-yellow-100 rounded-lg">
                <FaSpinner className="text-yellow-600 text-lg" />
              </div>
              <h3 className="text-gray-600 text-sm font-medium">Pending Approvals</h3>
            </div>
            <div className="mt-4">
              <p className="text-2xl sm:text-3xl font-bold text-gray-800">{stats?.pendingDoctors || 0}</p>
            </div>
            <div className="mt-4">
              <button
                onClick={() => window.location.href = '/admin/doctors?filter=pending'}
                className="w-full py-2 bg-yellow-50 text-yellow-700 rounded-md text-sm font-medium hover:bg-yellow-100 transition-colors border border-yellow-200"
              >
                View Pending Doctors
              </button>
            </div>
          </div>
        </div>

        {/* Deletion Requests Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-red-100">
          <div className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-red-100 rounded-lg">
                <FaTrash className="text-red-600 text-lg" />
              </div>
              <h3 className="text-gray-600 text-sm font-medium">Deletion Requests</h3>
            </div>
            <div className="mt-4">
              <p className="text-2xl sm:text-3xl font-bold text-gray-800">{stats?.pendingDeletionRequests || 0}</p>
            </div>
            <div className="mt-4">
              <button
                onClick={() => window.location.href = '/admin/deletion-requests'}
                className="w-full py-2 bg-red-50 text-red-700 rounded-md text-sm font-medium hover:bg-red-100 transition-colors border border-red-200"
              >
                View Deletion Requests
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">System Status</h2>
          <div className="space-y-3 sm:space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs sm:text-sm font-medium text-gray-700">Server Health</span>
                <span className="text-xs sm:text-sm font-medium text-green-600">Excellent</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '95%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs sm:text-sm font-medium text-gray-700">Database Performance</span>
                <span className="text-xs sm:text-sm font-medium text-green-600">Good</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs sm:text-sm font-medium text-gray-700">Storage Usage</span>
                <span className="text-xs sm:text-sm font-medium text-yellow-600">Moderate</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            <a href="/admin/doctors?filter=pending" className="flex flex-col items-center justify-center p-2 sm:p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <FaUserMd className="text-primaryColor text-xl sm:text-2xl mb-1 sm:mb-2" />
              <span className="text-xs sm:text-sm font-medium text-gray-700 text-center">Approve Doctors</span>
            </a>
            <a href="/admin/appointments" className="flex flex-col items-center justify-center p-2 sm:p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <FaCalendarCheck className="text-green-600 text-xl sm:text-2xl mb-1 sm:mb-2" />
              <span className="text-xs sm:text-sm font-medium text-gray-700 text-center">Manage Appointments</span>
            </a>
            <a href="/admin/users" className="flex flex-col items-center justify-center p-2 sm:p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              <FaUsers className="text-purple-600 text-xl sm:text-2xl mb-1 sm:mb-2" />
              <span className="text-xs sm:text-sm font-medium text-gray-700 text-center">View Users</span>
            </a>
            <a href="/admin/deletion-requests" className="flex flex-col items-center justify-center p-2 sm:p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
              <FaTrash className="text-red-600 text-xl sm:text-2xl mb-1 sm:mb-2" />
              <span className="text-xs sm:text-sm font-medium text-gray-700 text-center">Deletion Requests</span>
            </a>
          </div>
        </div>
      </div>

      {/* Recent Appointments */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-2 sm:space-y-0">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Recent Appointments</h2>
          <a href="/admin/appointments" className="text-primaryColor hover:text-blue-700 text-xs sm:text-sm font-medium inline-flex items-center">
            View All <span className="hidden sm:inline ml-1">Appointments</span> <span className="ml-1">→</span>
          </a>
        </div>

        {stats?.recentAppointments && stats.recentAppointments.length > 0 ? (
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden border border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Patient
                      </th>
                      <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                        Doctor
                      </th>
                      <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stats.recentAppointments.map((appointment) => (
                      <tr key={appointment._id} className="hover:bg-gray-50">
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10">
                              <img
                                className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover"
                                src={appointment.patient?.photo || defaultAvatar}
                                alt={appointment.patient?.name}
                              />
                            </div>
                            <div className="ml-2 sm:ml-4">
                              <div className="text-xs sm:text-sm font-medium text-gray-900 truncate max-w-[100px] sm:max-w-none">
                                {appointment.patient?.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap hidden sm:table-cell">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10">
                              <img
                                className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover"
                                src={appointment.doctor?.photo || defaultAvatar}
                                alt={appointment.doctor?.name}
                              />
                            </div>
                            <div className="ml-2 sm:ml-4">
                              <div className="text-xs sm:text-sm font-medium text-gray-900">
                                {appointment.doctor?.name}
                              </div>
                              <div className="text-xs text-gray-500 hidden sm:block">
                                {appointment.doctor?.specialization}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                          <div className="text-xs sm:text-sm text-gray-900">
                            {formatDate(appointment.appointmentDate)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {appointment.timeSlot}
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                            ${appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              appointment.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                              appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'}`}
                          >
                            {appointment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <FaCalendarCheck className="text-gray-300 text-3xl mx-auto mb-2" />
            <p className="text-sm font-medium">No recent appointments found</p>
            <p className="text-xs text-gray-400 mt-1">New appointments will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
