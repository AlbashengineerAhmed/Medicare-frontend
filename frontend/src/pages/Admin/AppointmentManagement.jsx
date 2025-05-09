import { useState, useEffect } from 'react';
import { adminService, appointmentService } from '../../services/api';
import { toast } from 'react-toastify';
import { formatDate } from '../../utils/formatDate';
import HashLoader from 'react-spinners/HashLoader';
import defaultAvatar from '../../assets/images/avatar-icon.png';
import { FaSearch, FaFilter, FaCalendarAlt, FaCheck, FaTimes, FaTrash } from 'react-icons/fa';

const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Fetch all appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);

        // We need to create an admin endpoint to get all appointments
        // For now, we'll use a mock implementation
        const result = await adminService.getAllAppointments();

        if (result.success) {
          setAppointments(result.data);
        } else {
          toast.error(result.message || 'Failed to fetch appointments');
        }
      } catch (error) {
        toast.error('Failed to fetch appointments. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Filter appointments by status and search term
  const filteredAppointments = appointments.filter(appointment => {
    // Filter by status
    if (filter !== 'all' && appointment.status !== filter) {
      return false;
    }

    // Search by patient or doctor name
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        (appointment.patient?.name && appointment.patient.name.toLowerCase().includes(searchLower)) ||
        (appointment.doctor?.name && appointment.doctor.name.toLowerCase().includes(searchLower))
      );
    }

    return true;
  });

  // Handle appointment status update
  const handleStatusUpdate = async (appointmentId, status) => {
    try {
      setLoading(true);

      const result = await adminService.updateAppointmentStatus(appointmentId, status);

      if (result.success) {
        toast.success(`Appointment ${status} successfully`);

        // Update the appointment in the local state
        setAppointments(prevAppointments =>
          prevAppointments.map(appointment =>
            appointment._id === appointmentId ? { ...appointment, status } : appointment
          )
        );

        setShowModal(false);
      } else {
        toast.error(result.message || `Failed to update appointment status`);
      }
    } catch (error) {
      toast.error('Failed to update appointment status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle appointment deletion
  const handleDeleteAppointment = async (appointmentId) => {
    try {
      setLoading(true);

      const result = await adminService.deleteAppointment(appointmentId);

      if (result.success) {
        toast.success('Appointment deleted successfully');

        // Remove the appointment from the local state
        setAppointments(prevAppointments =>
          prevAppointments.filter(appointment => appointment._id !== appointmentId)
        );

        setShowModal(false);
        setConfirmDelete(false);
      } else {
        toast.error(result.message || 'Failed to delete appointment');
      }
    } catch (error) {
      toast.error('Failed to delete appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && appointments.length === 0) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <HashLoader size={45} color="#0067FF" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Appointment Management</h1>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search appointments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primaryColor"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>

          <div className="relative">
            <button
              className="flex items-center px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
              onClick={() => document.getElementById('filterDropdown').classList.toggle('hidden')}
            >
              <FaFilter className="mr-2" />
              Filter: {filter === 'all' ? 'All' : filter}
            </button>

            <div id="filterDropdown" className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg hidden z-10">
              <div className="py-1">
                <button
                  onClick={() => setFilter('all')}
                  className={`block px-4 py-2 text-sm w-full text-left ${filter === 'all' ? 'bg-gray-100' : ''}`}
                >
                  All Appointments
                </button>
                <button
                  onClick={() => setFilter('pending')}
                  className={`block px-4 py-2 text-sm w-full text-left ${filter === 'pending' ? 'bg-gray-100' : ''}`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setFilter('confirmed')}
                  className={`block px-4 py-2 text-sm w-full text-left ${filter === 'confirmed' ? 'bg-gray-100' : ''}`}
                >
                  Confirmed
                </button>
                <button
                  onClick={() => setFilter('completed')}
                  className={`block px-4 py-2 text-sm w-full text-left ${filter === 'completed' ? 'bg-gray-100' : ''}`}
                >
                  Completed
                </button>
                <button
                  onClick={() => setFilter('cancelled')}
                  className={`block px-4 py-2 text-sm w-full text-left ${filter === 'cancelled' ? 'bg-gray-100' : ''}`}
                >
                  Cancelled
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {filteredAppointments.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500">No appointments found matching your criteria</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doctor
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAppointments.map((appointment) => (
                  <tr key={appointment._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={appointment.patient?.photo || defaultAvatar}
                            alt={appointment.patient?.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {appointment.patient?.name || 'Unknown Patient'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {appointment.patient?.email || 'No email'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={appointment.doctor?.photo || defaultAvatar}
                            alt={appointment.doctor?.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {appointment.doctor?.name || 'Unknown Doctor'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {appointment.doctor?.specialization || 'No specialization'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(appointment.appointmentDate)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {appointment.timeSlot}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          appointment.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                          appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'}`}
                      >
                        {appointment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedAppointment(appointment);
                          setShowModal(true);
                        }}
                        className="text-primaryColor hover:text-blue-800 mr-3"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => {
                          setSelectedAppointment(appointment);
                          setConfirmDelete(true);
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Appointment Details Modal */}
      {showModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-bold text-gray-800">Appointment Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <FaCalendarAlt className="text-primaryColor mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Appointment Date & Time</p>
                      <p className="text-gray-800">
                        {formatDate(selectedAppointment.appointmentDate)} at {selectedAppointment.timeSlot}
                      </p>
                    </div>
                  </div>

                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${selectedAppointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      selectedAppointment.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                      selectedAppointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'}`}
                  >
                    {selectedAppointment.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-2">Patient Information</h3>
                    <div className="flex items-center mb-3">
                      <img
                        className="h-10 w-10 rounded-full object-cover mr-3"
                        src={selectedAppointment.patient?.photo || defaultAvatar}
                        alt={selectedAppointment.patient?.name}
                      />
                      <div>
                        <p className="text-gray-800 font-medium">{selectedAppointment.patient?.name || 'Unknown Patient'}</p>
                        <p className="text-sm text-gray-500">{selectedAppointment.patient?.email || 'No email'}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-gray-800 mb-2">{selectedAppointment.patient?.phone || 'Not provided'}</p>
                    <p className="text-sm text-gray-500">Gender</p>
                    <p className="text-gray-800">{selectedAppointment.patient?.gender || 'Not specified'}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-2">Doctor Information</h3>
                    <div className="flex items-center mb-3">
                      <img
                        className="h-10 w-10 rounded-full object-cover mr-3"
                        src={selectedAppointment.doctor?.photo || defaultAvatar}
                        alt={selectedAppointment.doctor?.name}
                      />
                      <div>
                        <p className="text-gray-800 font-medium">{selectedAppointment.doctor?.name || 'Unknown Doctor'}</p>
                        <p className="text-sm text-gray-500">{selectedAppointment.doctor?.specialization || 'No specialization'}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">Fee</p>
                    <p className="text-gray-800 mb-2">{selectedAppointment.fee || 0} TND</p>
                    <p className="text-sm text-gray-500">Payment Status</p>
                    <p className="text-gray-800">{selectedAppointment.isPaid ? 'Paid' : 'Not Paid'}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-2">Medical Information</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Symptoms</p>
                    <p className="text-gray-800 mb-3">{selectedAppointment.symptoms || 'No symptoms provided'}</p>
                    <p className="text-sm text-gray-500">Medical History</p>
                    <p className="text-gray-800 mb-3">{selectedAppointment.medicalHistory || 'No medical history provided'}</p>
                    <p className="text-sm text-gray-500">Prescription</p>
                    <p className="text-gray-800 mb-3">{selectedAppointment.prescription || 'No prescription provided'}</p>
                    <p className="text-sm text-gray-500">Notes</p>
                    <p className="text-gray-800">{selectedAppointment.notes || 'No notes provided'}</p>
                  </div>
                </div>

                {selectedAppointment.status === 'pending' && (
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleStatusUpdate(selectedAppointment._id, 'confirmed')}
                      className="flex-1 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 flex items-center justify-center"
                    >
                      <FaCheck className="mr-1" /> Confirm
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(selectedAppointment._id, 'cancelled')}
                      className="flex-1 bg-red-500 text-white py-2 rounded-md hover:bg-red-600 flex items-center justify-center"
                    >
                      <FaTimes className="mr-1" /> Cancel
                    </button>
                  </div>
                )}

                {selectedAppointment.status === 'confirmed' && (
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleStatusUpdate(selectedAppointment._id, 'completed')}
                      className="flex-1 bg-green-500 text-white py-2 rounded-md hover:bg-green-600 flex items-center justify-center"
                    >
                      <FaCheck className="mr-1" /> Mark as Completed
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(selectedAppointment._id, 'cancelled')}
                      className="flex-1 bg-red-500 text-white py-2 rounded-md hover:bg-red-600 flex items-center justify-center"
                    >
                      <FaTimes className="mr-1" /> Cancel
                    </button>
                  </div>
                )}

                <div className="mt-4">
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setConfirmDelete(true);
                    }}
                    className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 flex items-center justify-center"
                  >
                    <FaTrash className="mr-1" /> Delete Appointment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {confirmDelete && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Confirm Deletion</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this appointment? This action cannot be undone.
            </p>
            <div className="mb-4 bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500">Appointment Details:</p>
              <p className="text-gray-800">
                <strong>Patient:</strong> {selectedAppointment.patient?.name || 'Unknown Patient'}
              </p>
              <p className="text-gray-800">
                <strong>Doctor:</strong> {selectedAppointment.doctor?.name || 'Unknown Doctor'}
              </p>
              <p className="text-gray-800">
                <strong>Date:</strong> {formatDate(selectedAppointment.appointmentDate)} at {selectedAppointment.timeSlot}
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteAppointment(selectedAppointment._id)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center"
                disabled={loading}
              >
                {loading ? <HashLoader size={20} color="#ffffff" /> : (
                  <>
                    <FaTrash className="mr-2" /> Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentManagement;
