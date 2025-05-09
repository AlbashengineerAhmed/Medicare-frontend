import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { doctorService, appointmentService, deletionRequestService } from '../../services/api';
import HashLoader from 'react-spinners/HashLoader';
import defaultAvatar from '../../assets/images/avatar-icon.png';
import { formatDate } from '../../utils/formatDate';
import { formatDoctorName } from '../../utils/formatDoctorName';
import PasswordUpdateForm from '../../components/Profile/PasswordUpdateForm';
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaCalendarAlt,
  FaUserMd,
  FaClipboardList,
  FaCog,
  FaStethoscope,
  FaEnvelope,
  FaPhone,
  FaUser,
  FaHospital,
  FaGraduationCap,
  FaClock,
  FaInfoCircle,
  FaMoneyBillAlt,
  FaVenusMars,
  FaImage,
  FaFileAlt,
  FaSave,
  FaLock,
  FaCheck,
  FaTimes,
  FaBriefcase,
  FaKey
} from 'react-icons/fa';

const DoctorProfile = () => {
  const navigate = useNavigate();
  const { user, token, dispatch } = useAuth();
  const [activeTab, setActiveTab] = useState('settings');
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState('');
  const [showTimeSlotModal, setShowTimeSlotModal] = useState(false);
  const [showExperienceModal, setShowExperienceModal] = useState(false);
  const [showEducationModal, setShowEducationModal] = useState(false);

  // Basic profile form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    photo: null,
    gender: '',
    phone: '',
    specialization: '',
    ticketPrice: '',
    bio: '',
    about: '',
    timeSlots: [],
    qualifications: [],
    experiences: []
  });

  // Time slot form data
  const [timeSlotData, setTimeSlotData] = useState({
    day: 'Monday',
    startTime: '09:00',
    endTime: '17:00'
  });

  // Experience form data
  const [experienceData, setExperienceData] = useState({
    position: '',
    hospital: '',
    startDate: '',
    endDate: '',
    isCurrentlyWorking: false
  });

  // Education form data
  const [educationData, setEducationData] = useState({
    degree: '',
    university: '',
    startDate: '',
    endDate: '',
    isCurrentlyStudying: false
  });

  useEffect(() => {
    // Log the current state for debugging
    console.log("DoctorProfile - Current state:", { user, token, role: localStorage.getItem('role') });

    // Check if we're on the doctor profile page
    console.log("Current path:", window.location.pathname);

    if (!token) {
      console.log("No token found, redirecting to login");
      navigate('/login');
      return;
    }

    // Get role from localStorage for reliability
    const storedRole = localStorage.getItem('role');
    console.log("Stored role:", storedRole);

    // Special case for doctor profile page
    if (window.location.pathname === '/doctor/profile' && storedRole === 'doctor') {
      console.log("On doctor profile page with doctor role - proceeding");
    } else if (user?.role !== 'doctor' && storedRole !== 'doctor') {
      console.log("Not a doctor, redirecting to profile");
      navigate('/profile');
      return;
    }

    // Fetch doctor data if user object is available
    if (user) {
      console.log("Setting form data from user:", user);
      setFormData({
        name: user.name || '',
        email: user.email || '',
        photo: user.photo || null,
        gender: user.gender || '',
        phone: user.phone || '',
        specialization: user.specialization || '',
        ticketPrice: user.ticketPrice || '',
        bio: user.bio || '',
        about: user.about || '',
        timeSlots: user.timeSlots || [],
        qualifications: user.qualifications || [],
        experiences: user.experiences || []
      });

      if (user.photo) {
        setPreviewURL(user.photo);
      }
    } else {
      console.log("User data not available yet");
    }

    if (activeTab === 'appointments') {
      fetchAppointments();
    }
  }, [user, token, navigate, activeTab]);

  const fetchAppointments = async () => {
    try {
      setLoadingAppointments(true);

      if (!user?._id) {
        toast.error('Doctor ID not available');
        return;
      }

      const result = await appointmentService.getDoctorAppointments(user._id);

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
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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

      const result = await doctorService.updateDoctor(user._id, formData);

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

  // Check if doctor has a pending deletion request
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

        const result = await doctorService.deleteDoctor(user._id);

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

  const handleUpdateAppointmentStatus = async (appointmentId, status) => {
    try {
      setLoading(true);

      const result = await appointmentService.updateAppointmentStatus(appointmentId, status);

      if (result.success) {
        toast.success(`Appointment ${status} successfully!`);
        fetchAppointments();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to update appointment status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Time slot handlers
  const handleTimeSlotInputChange = e => {
    const { name, value } = e.target;
    setTimeSlotData({ ...timeSlotData, [name]: value });
  };

  const handleAddTimeSlot = () => {
    const { day, startTime, endTime } = timeSlotData;

    if (!day || !startTime || !endTime) {
      toast.error('Please fill all time slot fields');
      return;
    }

    // Check if the time slot already exists
    const existingSlot = formData.timeSlots.find(
      slot => slot.day === day && slot.startTime === startTime && slot.endTime === endTime
    );

    if (existingSlot) {
      toast.error('This time slot already exists');
      return;
    }

    // Add the new time slot
    const updatedTimeSlots = [
      ...formData.timeSlots,
      { day, startTime, endTime }
    ];

    setFormData({ ...formData, timeSlots: updatedTimeSlots });
    setShowTimeSlotModal(false);

    // Reset the time slot form
    setTimeSlotData({
      day: 'Monday',
      startTime: '09:00',
      endTime: '17:00'
    });
  };

  const handleRemoveTimeSlot = (index) => {
    const updatedTimeSlots = [...formData.timeSlots];
    updatedTimeSlots.splice(index, 1);
    setFormData({ ...formData, timeSlots: updatedTimeSlots });
  };

  // Experience handlers
  const handleExperienceInputChange = e => {
    const { name, value, type, checked } = e.target;
    setExperienceData({
      ...experienceData,
      [name]: type === 'checkbox' ? checked : value
    });

    if (name === 'isCurrentlyWorking' && checked) {
      setExperienceData(prev => ({ ...prev, endDate: '' }));
    }
  };

  const handleAddExperience = () => {
    const { position, hospital, startDate, endDate, isCurrentlyWorking } = experienceData;

    if (!position || !hospital || !startDate) {
      toast.error('Please fill all required experience fields');
      return;
    }

    // Add the new experience
    const updatedExperiences = [
      ...formData.experiences,
      { position, hospital, startDate, endDate: isCurrentlyWorking ? 'Present' : endDate }
    ];

    setFormData({ ...formData, experiences: updatedExperiences });
    setShowExperienceModal(false);

    // Reset the experience form
    setExperienceData({
      position: '',
      hospital: '',
      startDate: '',
      endDate: '',
      isCurrentlyWorking: false
    });
  };

  const handleRemoveExperience = (index) => {
    const updatedExperiences = [...formData.experiences];
    updatedExperiences.splice(index, 1);
    setFormData({ ...formData, experiences: updatedExperiences });
  };

  // Education handlers
  const handleEducationInputChange = e => {
    const { name, value, type, checked } = e.target;
    setEducationData({
      ...educationData,
      [name]: type === 'checkbox' ? checked : value
    });

    if (name === 'isCurrentlyStudying' && checked) {
      setEducationData(prev => ({ ...prev, endDate: '' }));
    }
  };

  const handleAddEducation = () => {
    const { degree, university, startDate, endDate, isCurrentlyStudying } = educationData;

    if (!degree || !university || !startDate) {
      toast.error('Please fill all required education fields');
      return;
    }

    // Add the new education
    const updatedQualifications = [
      ...formData.qualifications,
      { degree, university, startDate, endDate: isCurrentlyStudying ? 'Present' : endDate }
    ];

    setFormData({ ...formData, qualifications: updatedQualifications });
    setShowEducationModal(false);

    // Reset the education form
    setEducationData({
      degree: '',
      university: '',
      startDate: '',
      endDate: '',
      isCurrentlyStudying: false
    });
  };

  const handleRemoveEducation = (index) => {
    const updatedQualifications = [...formData.qualifications];
    updatedQualifications.splice(index, 1);
    setFormData({ ...formData, qualifications: updatedQualifications });
  };

  return (
    <>
    <section className="pt-0">
      {/* Doctor Dashboard Header */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 py-8 mb-8 shadow-sm">
        <div className="container">
          <div className="max-w-[1170px] px-5 mx-auto">
            <div className="flex items-center gap-3">
              <div className="bg-primaryColor p-3 rounded-full shadow-md">
                <FaUserMd className="text-white text-2xl" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-headingColor">Doctor Dashboard</h2>
                <p className="text-textColor mt-1">Manage your profile, appointments, and professional information</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="max-w-[1170px] px-5 mx-auto">
          <div className="grid md:grid-cols-3 gap-10">
            {/* Sidebar */}
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
                      <FaUserMd className="text-lg" />
                    </div>
                  </div>
                </div>

                <div className="text-center mt-6">
                  <h3 className="text-[22px] leading-[30px] text-headingColor font-bold">
                    {user?.name ? formatDoctorName(user.name) : ''}
                  </h3>
                  <div className="flex items-center justify-center mt-2 gap-1">
                    <FaStethoscope className="text-primaryColor" />
                    <p className="text-primaryColor text-[16px] leading-6 font-medium">
                      {user?.specialization || 'Specialization not set'}
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

                <div className="border-t border-gray-100 my-4 pt-2">
                  <div className="flex justify-around text-center">
                    <div className="px-2">
                      <h4 className="text-2xl font-bold text-primaryColor">{formData.timeSlots?.length || 0}</h4>
                      <p className="text-xs text-gray-500">Time Slots</p>
                    </div>
                    <div className="px-2 border-l border-r border-gray-100">
                      <h4 className="text-2xl font-bold text-primaryColor">{appointments?.length || 0}</h4>
                      <p className="text-xs text-gray-500">Appointments</p>
                    </div>
                    <div className="px-2">
                      <h4 className="text-2xl font-bold text-primaryColor">{formData.experiences?.length || 0}</h4>
                      <p className="text-xs text-gray-500">Experiences</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 md:mt-8">
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`${
                      activeTab === 'settings'
                        ? 'bg-primaryColor text-white shadow-md'
                        : 'bg-gray-50 text-headingColor hover:bg-gray-100'
                    } w-full px-2 py-3 text-[16px] leading-7 rounded-md mb-3 flex items-center justify-start pl-4 transition-all duration-200`}
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
                    } w-full px-2 py-3 text-[16px] leading-7 rounded-md mb-3 flex items-center justify-start pl-4 transition-all duration-200`}
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
                    } w-full px-2 py-3 text-[16px] leading-7 rounded-md mb-3 flex items-center justify-start pl-4 transition-all duration-200`}
                  >
                    <div className={`${activeTab === 'appointments' ? 'bg-blue-600' : 'bg-blue-100'} p-2 rounded-md mr-3`}>
                      <FaCalendarAlt className={`${activeTab === 'appointments' ? 'text-white' : 'text-primaryColor'} text-lg`} />
                    </div>
                    Appointments
                  </button>
                  <button
                    onClick={() => setActiveTab('timeSlots')}
                    className={`${
                      activeTab === 'timeSlots'
                        ? 'bg-primaryColor text-white shadow-md'
                        : 'bg-gray-50 text-headingColor hover:bg-gray-100'
                    } w-full px-2 py-3 text-[16px] leading-7 rounded-md mb-3 flex items-center justify-start pl-4 transition-all duration-200`}
                  >
                    <div className={`${activeTab === 'timeSlots' ? 'bg-blue-600' : 'bg-blue-100'} p-2 rounded-md mr-3`}>
                      <FaClock className={`${activeTab === 'timeSlots' ? 'text-white' : 'text-primaryColor'} text-lg`} />
                    </div>
                    Time Slots
                  </button>
                  <button
                    onClick={() => setActiveTab('professional')}
                    className={`${
                      activeTab === 'professional'
                        ? 'bg-primaryColor text-white shadow-md'
                        : 'bg-gray-50 text-headingColor hover:bg-gray-100'
                    } w-full px-2 py-3 text-[16px] leading-7 rounded-md mb-3 flex items-center justify-start pl-4 transition-all duration-200`}
                  >
                    <div className={`${activeTab === 'professional' ? 'bg-blue-600' : 'bg-blue-100'} p-2 rounded-md mr-3`}>
                      <FaGraduationCap className={`${activeTab === 'professional' ? 'text-white' : 'text-primaryColor'} text-lg`} />
                    </div>
                    Professional Info
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="md:col-span-2">
              <div className="shadow-lg p-3 lg:p-5 rounded-lg border border-gray-100 bg-white">
                {/* Settings Tab */}
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
                      <div className="mb-5">
                        <input
                          type="text"
                          placeholder="Full Name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor"
                          required
                        />
                      </div>

                      <div className="mb-5">
                        <input
                          type="email"
                          placeholder="Email Address"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor"
                          required
                          disabled
                        />
                      </div>



                      <div className="mb-5">
                        <input
                          type="tel"
                          placeholder="Phone Number"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor"
                        />
                      </div>

                      <div className="mb-5">
                        <label className="text-headingColor font-bold text-[16px] leading-7">
                          Gender:
                          <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                            className="text-textColor font-semibold text-[15px] leading-7 px-4 py-3 focus:outline-none"
                          >
                            <option value="">Select</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                          </select>
                        </label>
                      </div>

                      <div className="mb-5 flex items-center gap-3">
                        {previewURL ? (
                          <figure className="w-[60px] h-[60px] rounded-full border-2 border-solid border-primaryColor flex items-center justify-center overflow-hidden">
                            <img src={previewURL} alt="" className="w-full h-full object-cover rounded-full" />
                          </figure>
                        ) : (
                          <figure className="w-[60px] h-[60px] rounded-full border-2 border-solid border-primaryColor flex items-center justify-center overflow-hidden">
                            <img src={user?.photo || defaultAvatar} alt="" className="w-full h-full object-cover rounded-full" />
                          </figure>
                        )}
                        <div className="relative w-[130px] h-[50px]">
                          <input
                            type="file"
                            name="photo"
                            id="customFile"
                            onChange={handleFileInputChange}
                            accept=".jpg, .jpeg, .png"
                            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <label
                            htmlFor="customFile"
                            className="absolute top-0 left-0 w-full h-full flex items-center px-[0.75rem] py-[0.375rem] text-[15px] leading-6 overflow-hidden bg-[#0066ff46] text-headingColor font-semibold rounded-lg truncate cursor-pointer"
                          >
                            {selectedFile ? selectedFile.name.substring(0, 15) + '...' : 'Upload Photo'}
                          </label>
                        </div>
                      </div>

                      <div className="mt-7 flex items-center justify-between gap-3">
                        <button
                          type="submit"
                          disabled={loading}
                          className="w-1/2 bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-3 flex items-center justify-center"
                        >
                          {loading ? <HashLoader size={25} color="#ffffff" /> : 'Update Profile'}
                        </button>

                        <button
                          type="button"
                          onClick={handleDeleteAccount}
                          disabled={loading}
                          className="w-1/2 bg-red-600 text-white text-[18px] leading-[30px] rounded-lg px-4 py-3"
                        >
                          Delete Account
                        </button>
                      </div>
                    </form>


                  </div>
                )}

                {/* Password Tab */}
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

                {/* Appointments Tab */}
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
                        <p className="text-gray-500 font-medium">No appointments yet</p>
                        <p className="text-gray-400 text-sm mt-1">When patients book appointments with you, they will appear here.</p>
                      </div>
                    ) : (
                      <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                        <div className="grid grid-cols-1 divide-y divide-gray-200 bg-white">
                          {appointments.map((appointment) => (
                            <div key={appointment._id} className="p-4 sm:p-6">
                              <div className="flex flex-col sm:flex-row justify-between gap-4">
                                {/* Patient Info */}
                                <div className="flex items-center gap-4">
                                  <div className="relative">
                                    <img
                                      src={appointment.patient?.photo || defaultAvatar}
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
                                      {appointment.patient?.name}
                                    </h3>
                                    <div className="flex items-center gap-2 text-gray-500 mt-1">
                                      <span className="flex items-center gap-1">
                                        <FaUser className="text-gray-400 text-xs" />
                                        {appointment.patient?.gender}
                                      </span>
                                      {appointment.patient?.phone && (
                                        <span className="flex items-center gap-1">
                                          <FaPhone className="text-gray-400 text-xs" />
                                          {appointment.patient?.phone}
                                        </span>
                                      )}
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
                                      {appointment.status === 'pending' && (
                                        <div className="flex gap-2">
                                          <button
                                            onClick={() => handleUpdateAppointmentStatus(appointment._id, 'confirmed')}
                                            className="bg-green-500 text-white px-3 py-1 rounded-lg text-[14px] hover:bg-green-600 transition-colors flex items-center gap-1"
                                          >
                                            <FaCheck className="text-xs" /> Confirm
                                          </button>
                                          <button
                                            onClick={() => handleUpdateAppointmentStatus(appointment._id, 'cancelled')}
                                            className="bg-red-500 text-white px-3 py-1 rounded-lg text-[14px] hover:bg-red-600 transition-colors flex items-center gap-1"
                                          >
                                            <FaTimes className="text-xs" /> Cancel
                                          </button>
                                        </div>
                                      )}
                                      {appointment.status === 'confirmed' && (
                                        <button
                                          onClick={() => handleUpdateAppointmentStatus(appointment._id, 'completed')}
                                          className="bg-blue-500 text-white px-3 py-1 rounded-lg text-[14px] hover:bg-blue-600 transition-colors flex items-center gap-1"
                                        >
                                          <FaCheck className="text-xs" /> Complete
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

              {/* Time Slots Tab */}
              {activeTab === 'timeSlots' && (
                <div className="shadow-lg p-3 lg:p-5 rounded-lg border border-gray-100 bg-white">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <FaClock className="text-primaryColor text-xl" />
                    </div>
                    <h3 className="text-[22px] leading-[30px] text-headingColor font-bold">
                      My Time Slots
                    </h3>
                  </div>

                  <div className="mb-5">
                    <button
                      onClick={() => setShowTimeSlotModal(true)}
                      className="bg-primaryColor text-white py-2 px-5 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-colors shadow-md"
                    >
                      <div className="bg-blue-600 p-1 rounded-full">
                        <FaPlus className="text-white text-sm" />
                      </div>
                      <span className="font-medium">Add Time Slot</span>
                    </button>
                  </div>

                  {formData.timeSlots.length === 0 ? (
                    <div className="shadow-lg p-3 lg:p-5 rounded-lg border border-gray-100 bg-white">
                      <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <FaClock className="text-gray-300 text-4xl mx-auto mb-3" />
                        <p className="text-gray-500 font-medium">No time slots added yet.</p>
                        <p className="text-gray-400 text-sm mt-1">Click the button above to add your first time slot.</p>
                      </div>

                      <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                        <h4 className="text-primaryColor font-semibold flex items-center gap-2 mb-2">
                          <FaInfoCircle /> Why add time slots?
                        </h4>
                        <p className="text-gray-700 text-sm">
                          Setting your available time slots helps patients know when they can book appointments with you.
                          This improves your scheduling efficiency and patient satisfaction.
                        </p>
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="bg-white p-3 rounded-lg border border-blue-100">
                            <h5 className="font-medium text-headingColor">Example Time Slots:</h5>
                            <ul className="mt-2 text-sm text-gray-600 space-y-1">
                              <li>• Monday: 9:00 AM - 5:00 PM</li>
                              <li>• Wednesday: 10:00 AM - 6:00 PM</li>
                              <li>• Friday: 8:00 AM - 2:00 PM</li>
                            </ul>
                          </div>
                          <div className="bg-white p-3 rounded-lg border border-blue-100">
                            <h5 className="font-medium text-headingColor">Benefits:</h5>
                            <ul className="mt-2 text-sm text-gray-600 space-y-1">
                              <li>• Better patient scheduling</li>
                              <li>• Reduced scheduling conflicts</li>
                              <li>• Improved practice management</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {formData.timeSlots.map((slot, index) => (
                        <div key={index} className="bg-blue-50 p-4 rounded-lg shadow-sm border border-blue-100 flex justify-between items-center hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-3">
                            <div className="bg-primaryColor p-2 rounded-full text-white">
                              <FaClock />
                            </div>
                            <div>
                              <h4 className="text-[16px] leading-6 text-headingColor font-semibold">
                                {slot.day}
                              </h4>
                              <p className="text-[14px] text-primaryColor font-medium">
                                {slot.startTime} - {slot.endTime}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveTimeSlot(index)}
                            className="bg-red-100 p-2 rounded-full text-red-600 hover:bg-red-200 transition-colors"
                            title="Remove time slot"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Time Slot Modal */}
                  {showTimeSlotModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                      <div className="bg-white rounded-lg p-6 w-[90%] max-w-[500px] shadow-xl">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-3">
                            <div className="bg-blue-100 p-2 rounded-full">
                              <FaClock className="text-primaryColor text-xl" />
                            </div>
                            <h3 className="text-[20px] leading-[30px] text-headingColor font-bold">
                              Add Time Slot
                            </h3>
                          </div>
                          <button
                            onClick={() => setShowTimeSlotModal(false)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            ✕
                          </button>
                        </div>

                        <div className="mb-5">
                          <label className="text-headingColor font-semibold mb-2 flex items-center gap-2">
                            <FaCalendarAlt className="text-primaryColor" /> Day of Week
                          </label>
                          <select
                            name="day"
                            value={timeSlotData.day}
                            onChange={handleTimeSlotInputChange}
                            className="w-full px-4 py-3 border border-solid border-[#0066ff61] focus:outline-none focus:border-primaryColor text-[16px] leading-7 text-headingColor rounded-lg bg-gray-50"
                          >
                            <option value="Monday">Monday</option>
                            <option value="Tuesday">Tuesday</option>
                            <option value="Wednesday">Wednesday</option>
                            <option value="Thursday">Thursday</option>
                            <option value="Friday">Friday</option>
                            <option value="Saturday">Saturday</option>
                            <option value="Sunday">Sunday</option>
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="mb-5">
                            <label className="text-headingColor font-semibold mb-2 flex items-center gap-2">
                              <FaClock className="text-primaryColor" /> Start Time
                            </label>
                            <input
                              type="time"
                              name="startTime"
                              value={timeSlotData.startTime}
                              onChange={handleTimeSlotInputChange}
                              className="w-full px-4 py-3 border border-solid border-[#0066ff61] focus:outline-none focus:border-primaryColor text-[16px] leading-7 text-headingColor rounded-lg bg-gray-50"
                            />
                          </div>

                          <div className="mb-5">
                            <label className="text-headingColor font-semibold mb-2 flex items-center gap-2">
                              <FaClock className="text-primaryColor" /> End Time
                            </label>
                            <input
                              type="time"
                              name="endTime"
                              value={timeSlotData.endTime}
                              onChange={handleTimeSlotInputChange}
                              className="w-full px-4 py-3 border border-solid border-[#0066ff61] focus:outline-none focus:border-primaryColor text-[16px] leading-7 text-headingColor rounded-lg bg-gray-50"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                          <button
                            onClick={() => setShowTimeSlotModal(false)}
                            className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleAddTimeSlot}
                            className="bg-primaryColor text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center gap-2"
                          >
                            <FaPlus className="text-sm" /> Add Slot
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Professional Info Tab */}
              {activeTab === 'professional' && (
                <div className="shadow-lg p-3 lg:p-5 rounded-lg border border-gray-100 bg-white">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <FaGraduationCap className="text-primaryColor text-xl" />
                    </div>
                    <h3 className="text-[22px] leading-[30px] text-headingColor font-bold">
                      Professional Information
                    </h3>
                  </div>

                  {/* About Section */}
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="bg-blue-50 p-2 rounded-full">
                        <FaInfoCircle className="text-primaryColor" />
                      </div>
                      <h4 className="text-[18px] leading-7 text-headingColor font-semibold">
                        About & Bio
                      </h4>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label className="text-headingColor font-semibold mb-2 flex items-center gap-2">
                            <FaStethoscope className="text-primaryColor" /> Specialization
                          </label>
                          <input
                            type="text"
                            name="specialization"
                            value={formData.specialization}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-solid border-[#0066ff61] focus:outline-none focus:border-primaryColor text-[16px] leading-7 text-headingColor rounded-lg bg-gray-50"
                            placeholder="e.g. Cardiology, Neurology"
                          />
                        </div>

                        <div>
                          <label className="text-headingColor font-semibold mb-2 flex items-center gap-2">
                            <FaMoneyBillAlt className="text-primaryColor" /> Consultation Fee
                          </label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                            <input
                              type="number"
                              name="ticketPrice"
                              value={formData.ticketPrice}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 pl-8 border border-solid border-[#0066ff61] focus:outline-none focus:border-primaryColor text-[16px] leading-7 text-headingColor rounded-lg bg-gray-50"
                              placeholder="100"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mb-6">
                        <label className="text-headingColor font-semibold mb-2 flex items-center gap-2">
                          <FaInfoCircle className="text-primaryColor" /> Short Bio (max 50 characters)
                        </label>
                        <input
                          type="text"
                          name="bio"
                          value={formData.bio}
                          onChange={handleInputChange}
                          maxLength={50}
                          className="w-full px-4 py-3 border border-solid border-[#0066ff61] focus:outline-none focus:border-primaryColor text-[16px] leading-7 text-headingColor rounded-lg bg-gray-50"
                          placeholder="Brief professional bio shown on your profile card"
                        />
                        <div className="text-right text-xs text-gray-500 mt-1">
                          {formData.bio?.length || 0}/50 characters
                        </div>
                      </div>

                      <div>
                        <label className="text-headingColor font-semibold mb-2 flex items-center gap-2">
                          <FaFileAlt className="text-primaryColor" /> Detailed About Me
                        </label>
                        <textarea
                          name="about"
                          value={formData.about}
                          onChange={handleInputChange}
                          rows={5}
                          className="w-full px-4 py-3 border border-solid border-[#0066ff61] focus:outline-none focus:border-primaryColor text-[16px] leading-7 text-headingColor rounded-lg bg-gray-50"
                          placeholder="Detailed information about your professional background, approach to patient care, and areas of expertise"
                        />
                      </div>

                      <div className="mt-6 flex justify-end">
                        <button
                          onClick={handleSubmit}
                          className="bg-primaryColor text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                        >
                          <FaSave /> Save Changes
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Education Section */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="bg-blue-50 p-2 rounded-full">
                          <FaGraduationCap className="text-primaryColor" />
                        </div>
                        <h4 className="text-[18px] leading-7 text-headingColor font-semibold">
                          Education & Qualifications
                        </h4>
                      </div>
                      <button
                        onClick={() => setShowEducationModal(true)}
                        className="bg-primaryColor text-white py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-colors shadow-sm"
                      >
                        <div className="bg-blue-600 p-1 rounded-full">
                          <FaPlus className="text-white text-xs" />
                        </div>
                        <span className="font-medium">Add Qualification</span>
                      </button>
                    </div>

                    {formData.qualifications.length === 0 ? (
                      <div className="shadow-lg p-3 lg:p-5 rounded-lg border border-gray-100 bg-white">
                        <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                          <FaGraduationCap className="text-gray-300 text-4xl mx-auto mb-3" />
                          <p className="text-gray-500 font-medium">No education details added yet</p>
                          <p className="text-gray-400 text-sm mt-1">Add your degrees and qualifications to build trust with patients</p>
                        </div>

                        <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                          <h4 className="text-primaryColor font-semibold flex items-center gap-2 mb-2">
                            <FaInfoCircle /> Why add education details?
                          </h4>
                          <p className="text-gray-700 text-sm">
                            Your educational background helps establish your credibility and expertise.
                            Patients are more likely to trust doctors with strong academic credentials.
                          </p>
                          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="bg-white p-3 rounded-lg border border-blue-100">
                              <h5 className="font-medium text-headingColor">Example Qualifications:</h5>
                              <ul className="mt-2 text-sm text-gray-600 space-y-1">
                                <li>• MD, Harvard Medical School</li>
                                <li>• Residency, Johns Hopkins Hospital</li>
                                <li>• Board Certification in Cardiology</li>
                              </ul>
                            </div>
                            <div className="bg-white p-3 rounded-lg border border-blue-100">
                              <h5 className="font-medium text-headingColor">Benefits:</h5>
                              <ul className="mt-2 text-sm text-gray-600 space-y-1">
                                <li>• Increased patient trust</li>
                                <li>• Professional credibility</li>
                                <li>• Highlight your expertise</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {formData.qualifications.map((edu, index) => (
                          <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex justify-between items-start hover:shadow-md transition-shadow">
                            <div className="flex gap-3">
                              <div className="bg-blue-50 p-2 rounded-full h-fit">
                                <FaGraduationCap className="text-primaryColor" />
                              </div>
                              <div>
                                <h5 className="text-[16px] leading-6 text-headingColor font-semibold">
                                  {edu.degree}
                                </h5>
                                <p className="text-[14px] text-primaryColor font-medium mt-1">
                                  {edu.university}
                                </p>
                                <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                                  <FaCalendarAlt className="text-gray-400 text-xs" />
                                  <span>{edu.startDate} - {edu.endDate}</span>
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => handleRemoveEducation(index)}
                              className="bg-red-100 p-2 rounded-full text-red-600 hover:bg-red-200 transition-colors"
                              title="Remove education"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Experience Section */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="bg-blue-50 p-2 rounded-full">
                          <FaBriefcase className="text-primaryColor" />
                        </div>
                        <h4 className="text-[18px] leading-7 text-headingColor font-semibold">
                          Professional Experience
                        </h4>
                      </div>
                      <button
                        onClick={() => setShowExperienceModal(true)}
                        className="bg-primaryColor text-white py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-colors shadow-sm"
                      >
                        <div className="bg-blue-600 p-1 rounded-full">
                          <FaPlus className="text-white text-xs" />
                        </div>
                        <span className="font-medium">Add Experience</span>
                      </button>
                    </div>

                    {formData.experiences.length === 0 ? (
                      <div className="shadow-lg p-3 lg:p-5 rounded-lg border border-gray-100 bg-white">
                        <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                          <FaBriefcase className="text-gray-300 text-4xl mx-auto mb-3" />
                          <p className="text-gray-500 font-medium">No experience details added yet</p>
                          <p className="text-gray-400 text-sm mt-1">Add your work experience to showcase your professional journey</p>
                        </div>

                        <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                          <h4 className="text-primaryColor font-semibold flex items-center gap-2 mb-2">
                            <FaInfoCircle /> Why add professional experience?
                          </h4>
                          <p className="text-gray-700 text-sm">
                            Your professional experience demonstrates your practical expertise and career progression.
                            Patients value doctors with relevant clinical experience in their field.
                          </p>
                          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="bg-white p-3 rounded-lg border border-blue-100">
                              <h5 className="font-medium text-headingColor">Example Experience:</h5>
                              <ul className="mt-2 text-sm text-gray-600 space-y-1">
                                <li>• Senior Cardiologist, City Hospital</li>
                                <li>• Resident Physician, University Medical Center</li>
                                <li>• Medical Director, Heart Clinic</li>
                              </ul>
                            </div>
                            <div className="bg-white p-3 rounded-lg border border-blue-100">
                              <h5 className="font-medium text-headingColor">Benefits:</h5>
                              <ul className="mt-2 text-sm text-gray-600 space-y-1">
                                <li>• Showcase your expertise</li>
                                <li>• Demonstrate career progression</li>
                                <li>• Build patient confidence</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {formData.experiences.map((exp, index) => (
                          <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex justify-between items-start hover:shadow-md transition-shadow">
                            <div className="flex gap-3">
                              <div className="bg-blue-50 p-2 rounded-full h-fit">
                                <FaHospital className="text-primaryColor" />
                              </div>
                              <div>
                                <h5 className="text-[16px] leading-6 text-headingColor font-semibold">
                                  {exp.position}
                                </h5>
                                <p className="text-[14px] text-primaryColor font-medium mt-1">
                                  {exp.hospital}
                                </p>
                                <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                                  <FaCalendarAlt className="text-gray-400 text-xs" />
                                  <span>
                                    {exp.startDate} - {exp.isCurrentlyWorking ? 'Present' : exp.endDate}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => handleRemoveExperience(index)}
                              className="bg-red-100 p-2 rounded-full text-red-600 hover:bg-red-200 transition-colors"
                              title="Remove experience"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Save Button */}
                  <div className="mt-8">
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="w-full bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-6 py-4 flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors shadow-md"
                    >
                      {loading ? (
                        <div className="flex items-center gap-3">
                          <HashLoader size={25} color="#ffffff" />
                          <span>Saving Changes...</span>
                        </div>
                      ) : (
                        <>
                          <FaSave className="text-xl" />
                          <span>Save All Changes</span>
                        </>
                      )}
                    </button>
                    <p className="text-center text-gray-500 text-sm mt-3">
                      All your profile information will be saved securely
                    </p>
                  </div>

                  {/* Education Modal */}
                  {showEducationModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                      <div className="bg-white rounded-lg p-6 w-[90%] max-w-[500px] shadow-xl">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-3">
                            <div className="bg-blue-100 p-2 rounded-full">
                              <FaGraduationCap className="text-primaryColor text-xl" />
                            </div>
                            <h3 className="text-[20px] leading-[30px] text-headingColor font-bold">
                              Add Education
                            </h3>
                          </div>
                          <button
                            onClick={() => setShowEducationModal(false)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            ✕
                          </button>
                        </div>

                        <div className="mb-5">
                          <label className="text-headingColor font-semibold mb-2 flex items-center gap-2">
                            <FaGraduationCap className="text-primaryColor" /> Degree/Certification
                          </label>
                          <input
                            type="text"
                            name="degree"
                            value={educationData.degree}
                            onChange={handleEducationInputChange}
                            className="w-full px-4 py-3 border border-solid border-[#0066ff61] focus:outline-none focus:border-primaryColor text-[16px] leading-7 text-headingColor rounded-lg bg-gray-50"
                            placeholder="e.g. MD, MBBS, PhD"
                          />
                        </div>

                        <div className="mb-5">
                          <label className="text-headingColor font-semibold mb-2 flex items-center gap-2">
                            <FaHospital className="text-primaryColor" /> University/Institution
                          </label>
                          <input
                            type="text"
                            name="university"
                            value={educationData.university}
                            onChange={handleEducationInputChange}
                            className="w-full px-4 py-3 border border-solid border-[#0066ff61] focus:outline-none focus:border-primaryColor text-[16px] leading-7 text-headingColor rounded-lg bg-gray-50"
                            placeholder="University or institution name"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="mb-5">
                            <label className="text-headingColor font-semibold mb-2 flex items-center gap-2">
                              <FaCalendarAlt className="text-primaryColor" /> Start Date
                            </label>
                            <input
                              type="date"
                              name="startDate"
                              value={educationData.startDate}
                              onChange={handleEducationInputChange}
                              className="w-full px-4 py-3 border border-solid border-[#0066ff61] focus:outline-none focus:border-primaryColor text-[16px] leading-7 text-headingColor rounded-lg bg-gray-50"
                            />
                          </div>

                          <div className="mb-5">
                            {!educationData.isCurrentlyStudying ? (
                              <>
                                <label className="text-headingColor font-semibold mb-2 flex items-center gap-2">
                                  <FaCalendarAlt className="text-primaryColor" /> End Date
                                </label>
                                <input
                                  type="date"
                                  name="endDate"
                                  value={educationData.endDate}
                                  onChange={handleEducationInputChange}
                                  className="w-full px-4 py-3 border border-solid border-[#0066ff61] focus:outline-none focus:border-primaryColor text-[16px] leading-7 text-headingColor rounded-lg bg-gray-50"
                                />
                              </>
                            ) : (
                              <div className="h-full flex items-end pb-3">
                                <span className="text-primaryColor font-medium">Currently Studying</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="mb-5">
                          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                            <input
                              type="checkbox"
                              id="isCurrentlyStudying"
                              name="isCurrentlyStudying"
                              checked={educationData.isCurrentlyStudying}
                              onChange={handleEducationInputChange}
                              className="w-5 h-5 accent-primaryColor"
                            />
                            <label htmlFor="isCurrentlyStudying" className="text-headingColor font-medium">
                              I am currently studying here
                            </label>
                          </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                          <button
                            onClick={() => setShowEducationModal(false)}
                            className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleAddEducation}
                            className="bg-primaryColor text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center gap-2"
                          >
                            <FaPlus className="text-sm" /> Add Education
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Experience Modal */}
                  {showExperienceModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                      <div className="bg-white rounded-lg p-6 w-[90%] max-w-[500px] shadow-xl">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-3">
                            <div className="bg-blue-100 p-2 rounded-full">
                              <FaBriefcase className="text-primaryColor text-xl" />
                            </div>
                            <h3 className="text-[20px] leading-[30px] text-headingColor font-bold">
                              Add Professional Experience
                            </h3>
                          </div>
                          <button
                            onClick={() => setShowExperienceModal(false)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            ✕
                          </button>
                        </div>

                        <div className="mb-5">
                          <label className="text-headingColor font-semibold mb-2 flex items-center gap-2">
                            <FaUserMd className="text-primaryColor" /> Position/Title
                          </label>
                          <input
                            type="text"
                            name="position"
                            value={experienceData.position}
                            onChange={handleExperienceInputChange}
                            className="w-full px-4 py-3 border border-solid border-[#0066ff61] focus:outline-none focus:border-primaryColor text-[16px] leading-7 text-headingColor rounded-lg bg-gray-50"
                            placeholder="e.g. Senior Cardiologist, Medical Director"
                          />
                        </div>

                        <div className="mb-5">
                          <label className="text-headingColor font-semibold mb-2 flex items-center gap-2">
                            <FaHospital className="text-primaryColor" /> Hospital/Clinic
                          </label>
                          <input
                            type="text"
                            name="hospital"
                            value={experienceData.hospital}
                            onChange={handleExperienceInputChange}
                            className="w-full px-4 py-3 border border-solid border-[#0066ff61] focus:outline-none focus:border-primaryColor text-[16px] leading-7 text-headingColor rounded-lg bg-gray-50"
                            placeholder="Name of hospital, clinic or medical facility"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="mb-5">
                            <label className="text-headingColor font-semibold mb-2 flex items-center gap-2">
                              <FaCalendarAlt className="text-primaryColor" /> Start Date
                            </label>
                            <input
                              type="date"
                              name="startDate"
                              value={experienceData.startDate}
                              onChange={handleExperienceInputChange}
                              className="w-full px-4 py-3 border border-solid border-[#0066ff61] focus:outline-none focus:border-primaryColor text-[16px] leading-7 text-headingColor rounded-lg bg-gray-50"
                            />
                          </div>

                          <div className="mb-5">
                            {!experienceData.isCurrentlyWorking ? (
                              <>
                                <label className="text-headingColor font-semibold mb-2 flex items-center gap-2">
                                  <FaCalendarAlt className="text-primaryColor" /> End Date
                                </label>
                                <input
                                  type="date"
                                  name="endDate"
                                  value={experienceData.endDate}
                                  onChange={handleExperienceInputChange}
                                  className="w-full px-4 py-3 border border-solid border-[#0066ff61] focus:outline-none focus:border-primaryColor text-[16px] leading-7 text-headingColor rounded-lg bg-gray-50"
                                />
                              </>
                            ) : (
                              <div className="h-full flex items-end pb-3">
                                <span className="text-primaryColor font-medium">Currently Working</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="mb-5">
                          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                            <input
                              type="checkbox"
                              id="isCurrentlyWorking"
                              name="isCurrentlyWorking"
                              checked={experienceData.isCurrentlyWorking}
                              onChange={handleExperienceInputChange}
                              className="w-5 h-5 accent-primaryColor"
                            />
                            <label htmlFor="isCurrentlyWorking" className="text-headingColor font-medium">
                              I am currently working here
                            </label>
                          </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                          <button
                            onClick={() => setShowExperienceModal(false)}
                            className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleAddExperience}
                            className="bg-primaryColor text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center gap-2"
                          >
                            <FaPlus className="text-sm" /> Add Experience
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
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

export default DoctorProfile;
