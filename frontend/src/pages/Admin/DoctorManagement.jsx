import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { adminService } from '../../services/api';
import { toast } from 'react-toastify';
import HashLoader from 'react-spinners/HashLoader';
import defaultAvatar from '../../assets/images/avatar-icon.png';
import { FaSearch, FaFilter, FaCheck, FaTimes, FaTrash } from 'react-icons/fa';

const DoctorManagement = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Get filter from URL query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const filterParam = params.get('filter');
    if (filterParam) {
      setFilter(filterParam);
    }
  }, [location.search]);

  // Fetch doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const result = await adminService.getAllDoctors();

        if (result.success) {
          setDoctors(result.data);
        } else {
          toast.error(result.message || 'Failed to fetch doctors');
        }
      } catch (error) {
        toast.error('Failed to fetch doctors. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Filter and search doctors
  const filteredDoctors = doctors.filter(doctor => {
    // Filter by status
    if (filter === 'pending' && doctor.isApproved !== 'pending') return false;
    if (filter === 'approved' && doctor.isApproved !== 'approved') return false;
    if (filter === 'rejected' && doctor.isApproved !== 'cancelled') return false;

    // Search by name or specialization
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        doctor.name.toLowerCase().includes(searchLower) ||
        (doctor.specialization && doctor.specialization.toLowerCase().includes(searchLower))
      );
    }

    return true;
  });

  // Handle doctor status update
  const handleStatusUpdate = async (doctorId, status) => {
    try {
      setLoading(true);

      const result = await adminService.updateDoctorStatus(doctorId, { status });

      if (result.success) {
        toast.success(`Doctor ${status === 'approved' ? 'approved' : 'rejected'} successfully`);

        // Update the doctor in the local state
        setDoctors(prevDoctors =>
          prevDoctors.map(doctor =>
            doctor._id === doctorId ? { ...doctor, isApproved: status } : doctor
          )
        );

        setShowModal(false);
      } else {
        toast.error(result.message || `Failed to ${status} doctor`);
      }
    } catch (error) {
      toast.error(`Failed to ${status} doctor. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  // Handle filter change
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    navigate(`/admin/doctors${newFilter !== 'all' ? `?filter=${newFilter}` : ''}`);
  };

  // Handle doctor deletion
  const handleDeleteDoctor = async (doctorId) => {
    try {
      setLoading(true);

      const result = await adminService.deleteDoctor(doctorId);

      if (result.success) {
        toast.success('Doctor deleted successfully');

        // Remove the doctor from the local state
        setDoctors(prevDoctors => prevDoctors.filter(doctor => doctor._id !== doctorId));

        setShowModal(false);
        setConfirmDelete(false);
      } else {
        toast.error(result.message || 'Failed to delete doctor');
      }
    } catch (error) {
      toast.error('Failed to delete doctor. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && doctors.length === 0) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <HashLoader size={45} color="#0067FF" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Doctor Management</h1>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search doctors..."
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
              Filter: {filter === 'all' ? 'All' : filter === 'pending' ? 'Pending' : filter === 'approved' ? 'Approved' : 'Rejected'}
            </button>

            <div id="filterDropdown" className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg hidden z-10">
              <div className="py-1">
                <button
                  onClick={() => handleFilterChange('all')}
                  className={`block px-4 py-2 text-sm w-full text-left ${filter === 'all' ? 'bg-gray-100' : ''}`}
                >
                  All Doctors
                </button>
                <button
                  onClick={() => handleFilterChange('pending')}
                  className={`block px-4 py-2 text-sm w-full text-left ${filter === 'pending' ? 'bg-gray-100' : ''}`}
                >
                  Pending Approval
                </button>
                <button
                  onClick={() => handleFilterChange('approved')}
                  className={`block px-4 py-2 text-sm w-full text-left ${filter === 'approved' ? 'bg-gray-100' : ''}`}
                >
                  Approved
                </button>
                <button
                  onClick={() => handleFilterChange('rejected')}
                  className={`block px-4 py-2 text-sm w-full text-left ${filter === 'rejected' ? 'bg-gray-100' : ''}`}
                >
                  Rejected
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {filteredDoctors.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500">No doctors found matching your criteria</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doctor
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Specialization
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
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
                {filteredDoctors.map((doctor) => (
                  <tr key={doctor._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={doctor.photo || defaultAvatar}
                            alt={doctor.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {doctor.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {doctor.gender}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{doctor.specialization || 'Not specified'}</div>
                      <div className="text-sm text-gray-500">Fee: {doctor.ticketPrice || 0} TND</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{doctor.email}</div>
                      <div className="text-sm text-gray-500">{doctor.phone || 'No phone'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${doctor.isApproved === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          doctor.isApproved === 'approved' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'}`}
                      >
                        {doctor.isApproved === 'pending' ? 'Pending' :
                         doctor.isApproved === 'approved' ? 'Approved' : 'Rejected'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedDoctor(doctor);
                          setShowModal(true);
                        }}
                        className="text-primaryColor hover:text-blue-800 mr-3"
                      >
                        View Details
                      </button>

                      {doctor.isApproved === 'pending' ? (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(doctor._id, 'approved')}
                            className="text-green-600 hover:text-green-800 mr-3"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(doctor._id, 'cancelled')}
                            className="text-red-600 hover:text-red-800"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedDoctor(doctor);
                            setConfirmDelete(true);
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Doctor Details Modal */}
      {showModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-bold text-gray-800">Doctor Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <img
                    src={selectedDoctor.photo || defaultAvatar}
                    alt={selectedDoctor.name}
                    className="w-full h-auto rounded-lg object-cover"
                  />

                  <div className="mt-4">
                    <h3 className="font-semibold text-gray-800">Status</h3>
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${selectedDoctor.isApproved === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        selectedDoctor.isApproved === 'approved' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'}`}
                    >
                      {selectedDoctor.isApproved === 'pending' ? 'Pending' :
                       selectedDoctor.isApproved === 'approved' ? 'Approved' : 'Rejected'}
                    </span>
                  </div>

                  {selectedDoctor.isApproved === 'pending' ? (
                    <div className="mt-4 flex space-x-2">
                      <button
                        onClick={() => handleStatusUpdate(selectedDoctor._id, 'approved')}
                        className="flex-1 bg-green-500 text-white py-2 rounded-md hover:bg-green-600 flex items-center justify-center"
                      >
                        <FaCheck className="mr-1" /> Approve
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(selectedDoctor._id, 'cancelled')}
                        className="flex-1 bg-red-500 text-white py-2 rounded-md hover:bg-red-600 flex items-center justify-center"
                      >
                        <FaTimes className="mr-1" /> Reject
                      </button>
                    </div>
                  ) : (
                    <div className="mt-4">
                      <button
                        onClick={() => {
                          setShowModal(false);
                          setConfirmDelete(true);
                        }}
                        className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 flex items-center justify-center"
                      >
                        <FaTrash className="mr-1" /> Delete Doctor
                      </button>
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <h3 className="font-semibold text-gray-800 mb-2">Personal Information</h3>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="text-gray-800">{selectedDoctor.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-gray-800">{selectedDoctor.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="text-gray-800">{selectedDoctor.phone || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Gender</p>
                      <p className="text-gray-800">{selectedDoctor.gender || 'Not specified'}</p>
                    </div>
                  </div>

                  <h3 className="font-semibold text-gray-800 mb-2">Professional Information</h3>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-500">Specialization</p>
                      <p className="text-gray-800">{selectedDoctor.specialization || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Fee</p>
                      <p className="text-gray-800">{selectedDoctor.ticketPrice || 0} TND</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-gray-500">Bio</p>
                      <p className="text-gray-800">{selectedDoctor.bio || 'No bio provided'}</p>
                    </div>
                  </div>

                  <h3 className="font-semibold text-gray-800 mb-2">Experience & Education</h3>
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">Experience</p>
                    {selectedDoctor.experiences && selectedDoctor.experiences.length > 0 ? (
                      <ul className="list-disc pl-5">
                        {selectedDoctor.experiences.map((exp, index) => (
                          <li key={index} className="text-gray-800">
                            {exp.position} at {exp.hospital} ({exp.startDate} - {exp.endDate || 'Present'})
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-800">No experience information provided</p>
                    )}
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-500">Education</p>
                    {selectedDoctor.qualifications && selectedDoctor.qualifications.length > 0 ? (
                      <ul className="list-disc pl-5">
                        {selectedDoctor.qualifications.map((edu, index) => (
                          <li key={index} className="text-gray-800">
                            {edu.degree} from {edu.university} ({edu.startDate} - {edu.endDate || 'Present'})
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-800">No education information provided</p>
                    )}
                  </div>

                  <div className="mb-6">
                    <p className="text-sm text-gray-500">Available Time Slots</p>
                    {selectedDoctor.timeSlots && selectedDoctor.timeSlots.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                        {selectedDoctor.timeSlots.map((slot, index) => (
                          <div key={index} className="bg-gray-100 p-2 rounded">
                            <p className="font-medium">{slot.day}</p>
                            <p className="text-sm">{slot.startTime} - {slot.endTime}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-800">No time slots provided</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {confirmDelete && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Confirm Deletion</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the doctor <span className="font-semibold">{selectedDoctor.name}</span>? This action cannot be undone.
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteDoctor(selectedDoctor._id)}
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

export default DoctorManagement;
