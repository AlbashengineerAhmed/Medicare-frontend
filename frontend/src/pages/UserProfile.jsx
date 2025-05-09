import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { userService, appointmentService, deletionRequestService } from '../services/api';
import HashLoader from 'react-spinners/HashLoader';
import defaultAvatar from '../assets/images/avatar-icon.png';
import { formatDate } from '../utils/formatDate';
import { formatDoctorName } from '../utils/formatDoctorName';
import PasswordUpdateForm from '../components/Profile/PasswordUpdateForm';
import {
  FaUser,
  FaCalendarAlt,
  FaEnvelope,
  FaPhone,
  FaIdCard,
  FaVenusMars,
  FaTint,
  FaImage,
  FaSave,
  FaTrash,
  FaLock,
  FaCheck,
  FaTimes,
  FaStethoscope,
  FaClock,
  FaKey
} from 'react-icons/fa';

const UserProfile = () => {
  const navigate = useNavigate();
  const { user, token, dispatch } = useAuth();
  const [activeTab, setActiveTab] = useState('settings');
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    photo: null,
    gender: '',
    bloodType: '',
    phone: '',
  });

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    // Redirect doctors to doctor profile
    if (user?.role === 'doctor') {
      navigate('/doctor/profile');
      return;
    }

    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        photo: user.photo || null,
        gender: user.gender || '',
        bloodType: user.bloodType || '',
        phone: user.phone || '',
      });

      if (user.photo) {
        setPreviewURL(user.photo);
      }
    }

    if (activeTab === 'appointments') {
      fetchAppointments();
    }
  }, [user, token, navigate, activeTab]);

  const fetchAppointments = async () => {
    try {
      setLoadingAppointments(true);

      const result = await appointmentService.getPatientAppointments();

      if (result.success) {
        setAppointments(result.data);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to fetch appointments. Please try again.');
    } finally {
      setLoadingAppointments(false);
    }
  };

  const handleInputChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileInputChange = async event => {
    const file = event.target.files[0];

    if (file) {
      setSelectedFile(file);
      setFormData({ ...formData, photo: file });

      // Create preview URL
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setPreviewURL(reader.result);
      };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user._id) {
      toast.error('User information not available');
      return;
    }

    try {
      setLoading(true);

      const result = await userService.updateProfile(user._id, formData);

      if (result.success) {
        dispatch({
          type: 'UPDATE_USER',
          payload: result.data,
        });

        toast.success('Profile updated successfully!');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const [showDeletionModal, setShowDeletionModal] = useState(false);
  const [deletionReason, setDeletionReason] = useState('');
  const [deletionRequestStatus, setDeletionRequestStatus] = useState(null);

  // Check if user has a pending deletion request
  useEffect(() => {
    const checkDeletionRequestStatus = async () => {
      if (user?._id) {
        try {
          const result = await deletionRequestService.getDeletionRequestStatus();
          if (result.success) {
            setDeletionRequestStatus(result.data);
          }
        } catch (error) {
          console.error("Error checking deletion request status:", error);
        }
      }
    };

    checkDeletionRequestStatus();
  }, [user]);

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to request account deletion? This will need admin approval.')) {
      try {
        setLoading(true);

        const result = await userService.deleteProfile(user._id);

        if (result.success && result.requiresApproval) {
          setShowDeletionModal(true);
        } else if (result.success) {
          dispatch({ type: 'LOGOUT' });
          toast.success('Account deleted successfully!');
          navigate('/');
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        toast.error('Failed to process deletion request. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmitDeletionRequest = async () => {
    if (!deletionReason.trim()) {
      toast.error('Please provide a reason for account deletion');
      return;
    }

    try {
      setLoading(true);

      const result = await deletionRequestService.createDeletionRequest({
        reason: deletionReason
      });

      if (result.success) {
        toast.success('Deletion request submitted successfully. An admin will review your request.');
        setShowDeletionModal(false);
        setDeletionRequestStatus(result.data);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to submit deletion request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        setLoading(true);

        const result = await appointmentService.deleteAppointment(appointmentId);

        if (result.success) {
          toast.success('Appointment cancelled successfully!');
          fetchAppointments();
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        toast.error('Failed to cancel appointment. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
    <section className="pt-0">
      {/* Patient Dashboard Header */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 py-8 mb-8 shadow-sm">
        <div className="container">
          <div className="max-w-[1170px] px-5 mx-auto">
            <div className="flex items-center gap-3">
              <div className="bg-primaryColor p-3 rounded-full shadow-md">
                <FaUser className="text-white text-2xl" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-headingColor">Patient Dashboard</h2>
                <p className="text-textColor mt-1">Manage your profile, appointments, and medical information</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="max-w-[1170px] px-5 mx-auto">
          <div className="grid md:grid-cols-3 gap-10">
            <div className="md:col-span-1">
              <div className="shadow-lg p-3 lg:p-5 rounded-lg bg-white border border-gray-100">
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <figure className="w-[130px] h-[130px] rounded-full border-4 border-solid border-primaryColor shadow-lg overflow-hidden">
                      <img
                        src={previewURL || user?.photo || defaultAvatar}
                        alt=""
                        className="w-full h-full rounded-full object-cover"
                      />
                    </figure>
                    <div className="absolute -bottom-2 right-0 bg-primaryColor text-white p-2 rounded-full shadow-md">
                      <FaUser className="text-lg" />
                    </div>
                  </div>
                </div>

                <div className="text-center mt-6">
                  <h3 className="text-[22px] leading-[30px] text-headingColor font-bold">
                    {user?.name}
                  </h3>
                  <div className="flex items-center justify-center mt-2 gap-1">
                    <FaIdCard className="text-primaryColor" />
                    <p className="text-primaryColor text-[16px] leading-6 font-medium">
                      Patient
                    </p>
                  </div>
                  <div className="flex items-center justify-center mt-2 gap-1 text-gray-500">
                    <FaEnvelope className="text-gray-400" />
                    <p className="text-gray-500 text-[14px] leading-6">
                      {user?.email}
                    </p>
                  </div>
                  {user?.phone && (
                    <div className="flex items-center justify-center mt-1 gap-1 text-gray-500">
                      <FaPhone className="text-gray-400" />
                      <p className="text-gray-500 text-[14px] leading-6">
                        {user?.phone}
                      </p>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-100 my-4 pt-4">
                  <div className="flex justify-around text-center">
                    <div className="px-2">
                      <h4 className="text-2xl font-bold text-primaryColor">{appointments?.length || 0}</h4>
                      <p className="text-xs text-gray-500">Appointments</p>
                    </div>
                    <div className="px-2 border-l border-r border-gray-100">
                      <h4 className="text-2xl font-bold text-primaryColor">{user?.bloodType || '-'}</h4>
                      <p className="text-xs text-gray-500">Blood Type</p>
                    </div>
                    <div className="px-2">
                      <h4 className="text-2xl font-bold text-primaryColor">{user?.gender || '-'}</h4>
                      <p className="text-xs text-gray-500">Gender</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`${
                      activeTab === 'settings'
                        ? 'bg-primaryColor text-white shadow-md'
                        : 'bg-gray-50 text-headingColor hover:bg-gray-100'
                    } w-full px-2 py-3 text-[16px] leading-7 rounded-lg mb-3 flex items-center justify-start pl-4 transition-all duration-200`}
                  >
                    <div className={`${activeTab === 'settings' ? 'bg-blue-600' : 'bg-blue-100'} p-2 rounded-md mr-3`}>
                      <FaUser className={`${activeTab === 'settings' ? 'text-white' : 'text-primaryColor'} text-lg`} />
                    </div>
                    Profile Settings
                  </button>
                  <button
                    onClick={() => setActiveTab('password')}
                    className={`${
                      activeTab === 'password'
                        ? 'bg-primaryColor text-white shadow-md'
                        : 'bg-gray-50 text-headingColor hover:bg-gray-100'
                    } w-full px-2 py-3 text-[16px] leading-7 rounded-lg mb-3 flex items-center justify-start pl-4 transition-all duration-200`}
                  >
                    <div className={`${activeTab === 'password' ? 'bg-blue-600' : 'bg-blue-100'} p-2 rounded-md mr-3`}>
                      <FaKey className={`${activeTab === 'password' ? 'text-white' : 'text-primaryColor'} text-lg`} />
                    </div>
                    Change Password
                  </button>
                  <button
                    onClick={() => setActiveTab('appointments')}
                    className={`${
                      activeTab === 'appointments'
                        ? 'bg-primaryColor text-white shadow-md'
                        : 'bg-gray-50 text-headingColor hover:bg-gray-100'
                    } w-full px-2 py-3 text-[16px] leading-7 rounded-lg mb-3 flex items-center justify-start pl-4 transition-all duration-200`}
                  >
                    <div className={`${activeTab === 'appointments' ? 'bg-blue-600' : 'bg-blue-100'} p-2 rounded-md mr-3`}>
                      <FaCalendarAlt className={`${activeTab === 'appointments' ? 'text-white' : 'text-primaryColor'} text-lg`} />
                    </div>
                    My Appointments
                  </button>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="shadow-lg p-3 lg:p-5 rounded-lg border border-gray-100 bg-white">
                {activeTab === 'settings' && (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-blue-100 p-3 rounded-full">
                        <FaUser className="text-primaryColor text-xl" />
                      </div>
                      <h3 className="text-[22px] leading-[30px] text-headingColor font-bold">
                        Profile Settings
                      </h3>
                    </div>

                    <form className="py-4 md:py-0" onSubmit={handleSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="mb-4">
                          <label className="text-headingColor font-semibold mb-2 flex items-center gap-2">
                            <FaUser className="text-primaryColor" /> Full Name
                          </label>
                          <input
                            type="text"
                            placeholder="John Doe"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-solid border-[#0066ff61] focus:outline-none focus:border-primaryColor text-[16px] leading-7 text-headingColor rounded-lg bg-gray-50"
                            required
                          />
                        </div>

                        <div className="mb-4">
                          <label className="text-headingColor font-semibold mb-2 flex items-center gap-2">
                            <FaEnvelope className="text-primaryColor" /> Email Address
                          </label>
                          <input
                            type="email"
                            placeholder="example@email.com"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-solid border-[#0066ff61] focus:outline-none focus:border-primaryColor text-[16px] leading-7 text-headingColor rounded-lg bg-gray-50"
                            required
                            disabled
                          />
                        </div>
                      </div>

                      {/* Password field removed - now handled by PasswordUpdateForm */}

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-2">
                        <div className="mb-4">
                          <label className="text-headingColor font-semibold mb-2 flex items-center gap-2">
                            <FaPhone className="text-primaryColor" /> Phone Number
                          </label>
                          <input
                            type="tel"
                            placeholder="+1 (555) 123-4567"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-solid border-[#0066ff61] focus:outline-none focus:border-primaryColor text-[16px] leading-7 text-headingColor rounded-lg bg-gray-50"
                          />
                        </div>

                        <div className="mb-4">
                          <label className="text-headingColor font-semibold mb-2 flex items-center gap-2">
                            <FaVenusMars className="text-primaryColor" /> Gender
                          </label>
                          <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-solid border-[#0066ff61] focus:outline-none focus:border-primaryColor text-[16px] leading-7 text-headingColor rounded-lg bg-gray-50"
                          >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                          </select>
                        </div>

                        <div className="mb-4">
                          <label className="text-headingColor font-semibold mb-2 flex items-center gap-2">
                            <FaTint className="text-primaryColor" /> Blood Type
                          </label>
                          <input
                            type="text"
                            placeholder="e.g., A+, B-, O+"
                            name="bloodType"
                            value={formData.bloodType}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-solid border-[#0066ff61] focus:outline-none focus:border-primaryColor text-[16px] leading-7 text-headingColor rounded-lg bg-gray-50"
                          />
                        </div>
                      </div>

                      <div className="mb-4 mt-2">
                        <label className="text-headingColor font-semibold mb-2 flex items-center gap-2">
                          <FaImage className="text-primaryColor" /> Profile Photo
                        </label>
                        <div className="flex items-center gap-4">
                          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primaryColor">
                            <img
                              src={previewURL || user?.photo || defaultAvatar}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <input
                              type="file"
                              name="photo"
                              onChange={handleFileInputChange}
                              accept=".jpg,.jpeg,.png"
                              className="w-full px-4 py-3 border border-dashed border-[#0066ff61] focus:outline-none focus:border-primaryColor text-[16px] leading-7 text-headingColor rounded-lg bg-gray-50"
                            />
                            <p className="text-sm text-gray-500 mt-1">Recommended: Square image, at least 300x300px</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 flex items-center justify-between gap-4">
                        <button
                          type="submit"
                          disabled={loading}
                          className="w-1/2 bg-primaryColor text-white text-[16px] leading-[30px] rounded-lg px-6 py-3 flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors shadow-md"
                        >
                          {loading ? (
                            <div className="flex items-center gap-3">
                              <HashLoader size={25} color="#ffffff" />
                              <span>Updating...</span>
                            </div>
                          ) : (
                            <>
                              <FaSave className="text-xl" />
                              <span>Update Profile</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={handleDeleteAccount}
                          disabled={loading}
                          className="w-1/2 bg-red-600 text-white text-[16px] leading-[30px] rounded-lg px-6 py-3 flex items-center justify-center gap-2 hover:bg-red-700 transition-colors shadow-md"
                        >
                          <FaTrash className="text-xl" />
                          <span>Delete Account</span>
                        </button>
                      </div>

                      <p className="text-center text-gray-500 text-sm mt-3">
                        Your personal information will be kept private and secure
                      </p>
                    </form>


                  </div>
                )}

                {activeTab === 'password' && (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-blue-100 p-3 rounded-full">
                        <FaKey className="text-primaryColor text-xl" />
                      </div>
                      <h3 className="text-[22px] leading-[30px] text-headingColor font-bold">
                        Change Password
                      </h3>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                      <PasswordUpdateForm />
                    </div>
                  </div>
                )}

                {activeTab === 'appointments' && (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-blue-100 p-3 rounded-full">
                        <FaCalendarAlt className="text-primaryColor text-xl" />
                      </div>
                      <h3 className="text-[22px] leading-[30px] text-headingColor font-bold">
                        My Appointments
                      </h3>
                    </div>

                    {loadingAppointments ? (
                      <div className="flex items-center justify-center h-[200px]">
                        <HashLoader size={45} color="#0067FF" />
                      </div>
                    ) : appointments.length === 0 ? (
                      <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <FaCalendarAlt className="text-gray-300 text-4xl mx-auto mb-3" />
                        <p className="text-gray-500 font-medium">No appointments scheduled</p>
                        <p className="text-gray-400 text-sm mt-1">Book an appointment with a doctor to get started</p>
                      </div>
                    ) : (
                      <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                        <div className="grid grid-cols-1 divide-y divide-gray-200 bg-white">
                          {appointments.map((appointment) => (
                            <div key={appointment._id} className="p-4 sm:p-6">
                              <div className="flex flex-col sm:flex-row justify-between gap-4">
                                {/* Doctor Info */}
                                <div className="flex items-center gap-4">
                                  <div className="relative">
                                    <img
                                      src={appointment.doctor?.photo || defaultAvatar}
                                      alt=""
                                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                                    />
                                    <span className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${
                                      appointment.status === 'pending' ? 'bg-yellow-400' :
                                      appointment.status === 'confirmed' ? 'bg-green-400' :
                                      appointment.status === 'completed' ? 'bg-blue-400' : 'bg-red-400'
                                    }`}></span>
                                  </div>
                                  <div>
                                    <h3 className="text-[18px] font-semibold text-headingColor">
                                      {appointment.doctor?.name ? formatDoctorName(appointment.doctor.name) : ''}
                                    </h3>
                                    <div className="flex items-center gap-2 text-gray-500 mt-1">
                                      <span className="flex items-center gap-1">
                                        <FaStethoscope className="text-gray-400 text-xs" />
                                        {appointment.doctor?.specialization}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Appointment Details */}
                                <div className="flex flex-wrap gap-4 items-center">
                                  <div className="bg-blue-50 px-4 py-2 rounded-lg">
                                    <div className="flex items-center gap-2">
                                      <FaCalendarAlt className="text-primaryColor" />
                                      <span className="font-medium text-gray-700">
                                        {formatDate(appointment.appointmentDate)}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                      <FaClock className="text-primaryColor" />
                                      <span className="text-gray-600">
                                        {appointment.timeSlot}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="flex flex-col items-center">
                                    <span
                                      className={`px-3 py-1 rounded-full text-[14px] font-medium ${
                                        appointment.status === 'pending'
                                          ? 'bg-yellow-100 text-yellow-800'
                                          : appointment.status === 'confirmed'
                                          ? 'bg-green-100 text-green-800'
                                          : appointment.status === 'cancelled'
                                          ? 'bg-red-100 text-red-800'
                                          : 'bg-blue-100 text-blue-800'
                                      }`}
                                    >
                                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                    </span>

                                    <div className="mt-3">
                                      {(appointment.status === 'pending' || appointment.status === 'confirmed') && (
                                        <button
                                          onClick={() => handleCancelAppointment(appointment._id)}
                                          className="bg-red-500 text-white px-3 py-1 rounded-lg text-[14px] hover:bg-red-600 transition-colors flex items-center gap-1"
                                        >
                                          <FaTimes className="text-xs" /> Cancel
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Deletion Request Modal */}
    {showDeletionModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FaTrash className="text-red-500" /> Account Deletion Request
          </h2>
          <p className="text-gray-600 mb-6">
            Your account deletion requires admin approval. Please provide a reason for deleting your account:
          </p>

          <div className="mb-4">
            <textarea
              value={deletionReason}
              onChange={(e) => setDeletionReason(e.target.value)}
              placeholder="Please explain why you want to delete your account..."
              className="w-full px-4 py-3 border border-solid border-[#0066ff61] focus:outline-none focus:border-primaryColor text-[16px] leading-7 text-headingColor rounded-lg bg-gray-50"
              rows={4}
              required
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowDeletionModal(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitDeletionRequest}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center"
              disabled={loading}
            >
              {loading ? <HashLoader size={20} color="#ffffff" /> : (
                <>
                  <FaTrash className="mr-2" /> Submit Request
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Deletion Request Status Banner */}
    {deletionRequestStatus && (
      <div className="fixed bottom-4 right-4 z-40 max-w-md bg-white rounded-lg shadow-lg border border-gray-200 p-4">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-full ${
            deletionRequestStatus.status === 'pending' ? 'bg-yellow-100' :
            deletionRequestStatus.status === 'approved' ? 'bg-green-100' : 'bg-red-100'
          }`}>
            <FaTrash className={`${
              deletionRequestStatus.status === 'pending' ? 'text-yellow-500' :
              deletionRequestStatus.status === 'approved' ? 'text-green-500' : 'text-red-500'
            }`} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Account Deletion Request</h3>
            <p className="text-sm text-gray-600 mt-1">
              Status: <span className={`font-medium ${
                deletionRequestStatus.status === 'pending' ? 'text-yellow-600' :
                deletionRequestStatus.status === 'approved' ? 'text-green-600' : 'text-red-600'
              }`}>
                {deletionRequestStatus.status.charAt(0).toUpperCase() + deletionRequestStatus.status.slice(1)}
              </span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Submitted on: {new Date(deletionRequestStatus.createdAt).toLocaleDateString()}
            </p>
            <button
              onClick={() => setDeletionRequestStatus(null)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default UserProfile;
