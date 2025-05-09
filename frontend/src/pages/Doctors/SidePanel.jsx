
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { appointmentService } from '../../services/api';
import { formatDoctorName } from '../../utils/formatDoctorName';
import HashLoader from 'react-spinners/HashLoader';
import { FaLock } from 'react-icons/fa';

const SidePanel = ({ doctor }) => {
  const navigate = useNavigate();
  const { user, token, role } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [selectedDay, setSelectedDay] = useState('');

  // Default time slots if doctor doesn't have any
  const defaultTimeSlots = [
    { day: 'Monday', slots: ['9:00 AM - 11:30 AM', '1:00 PM - 5:30 PM'] },
    { day: 'Wednesday', slots: ['9:00 AM - 11:30 AM', '1:00 PM - 5:30 PM'] },
    { day: 'Friday', slots: ['9:00 AM - 11:30 AM', '1:00 PM - 5:30 PM'] },
  ];

  // Check if doctor's time slots are in the correct format
  const validateTimeSlots = (doctorTimeSlots) => {
    if (!doctorTimeSlots || !Array.isArray(doctorTimeSlots) || doctorTimeSlots.length === 0) {
      return defaultTimeSlots;
    }

    // Check if the time slots are already in the correct format
    if (doctorTimeSlots[0] && doctorTimeSlots[0].day && Array.isArray(doctorTimeSlots[0].slots)) {
      return doctorTimeSlots;
    }

    // If not, convert from the old format (with start and end)
    const groupedByDay = {};
    doctorTimeSlots.forEach(slot => {
      if (!slot.day || !slot.start || !slot.end) return;

      if (!groupedByDay[slot.day]) {
        groupedByDay[slot.day] = [];
      }
      groupedByDay[slot.day].push(`${slot.start} - ${slot.end}`);
    });

    // Convert to the expected format
    return Object.keys(groupedByDay).map(day => ({
      day,
      slots: groupedByDay[day]
    }));
  };

  // Use doctor's time slots if available, otherwise use default
  const timeSlots = doctor?.timeSlots ? validateTimeSlots(doctor.timeSlots) : defaultTimeSlots;

  const handleBooking = async () => {
    console.log('Booking appointment with:', { token, role, selectedDay, selectedDate, selectedTimeSlot, doctor });

    if (!token) {
      toast.error('Please login to book an appointment');
      navigate('/login');
      return;
    }

    if (role !== 'patient') {
      toast.error('Only patients can book appointments');
      return;
    }

    if (!selectedDate) {
      toast.error('Please select a date');
      return;
    }

    if (!selectedTimeSlot) {
      toast.error('Please select a time slot');
      return;
    }

    if (!doctor || !doctor._id) {
      toast.error('Doctor information is missing');
      console.error('Doctor object is invalid:', doctor);
      return;
    }

    try {
      setLoading(true);

      const appointmentData = {
        doctor: doctor._id,
        appointmentDate: selectedDate,
        timeSlot: selectedTimeSlot,
      };

      console.log('Sending appointment data:', appointmentData);

      const result = await appointmentService.createAppointment(appointmentData);
      console.log('Appointment creation result:', result);

      if (result.success) {
        toast.success('Appointment booked successfully!');
        navigate('/users/profile');
      } else {
        toast.error(result.message || 'Failed to book appointment');
      }
    } catch (error) {
      console.error('Appointment booking error:', error);
      toast.error('Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };



  // Add console logs for debugging
  console.log('Doctor data:', doctor);
  console.log('Time slots after conversion:', timeSlots);

  return (
    <div className='shadow p-3 lg:p-5 rounded-md'>
      <div className="flex items-center justify-between">
        <p className='text__para mt-0 font-semibold'>
          Ticket Price
        </p>
        <span className='text-[16px] leading-7 lg:text-[22px] lg:leading-8 text-headingColor font-bold'>
          {doctor?.ticketPrice || 500} TND
        </span>
      </div>

      <div className='mt-[30px]'>
        <p className='text__para mt-0 font-semibold text-headingColor'>
          Available Time Slots:
        </p>

        {token && role === 'patient' ? (
          <ul className='mt-3'>
            {Array.isArray(timeSlots) && timeSlots.length > 0 ? (
              timeSlots.map((slot, index) => (
                <li key={index} className='flex flex-col mb-2 border-b pb-2'>
                  <div className='flex items-center justify-between'>
                    <p className='text-[15px] leading-6 text-textColor font-semibold'>
                      {slot.day}
                    </p>
                  </div>
                  <div className='flex flex-wrap gap-2 mt-2'>
                    {Array.isArray(slot.slots) && slot.slots.length > 0 ? (
                      slot.slots.map((time, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            // Create a date for the selected day
                            const today = new Date();
                            const dayMap = {
                              'Monday': 1, 'Tuesday': 2, 'Wednesday': 3,
                              'Thursday': 4, 'Friday': 5, 'Saturday': 6, 'Sunday': 0
                            };

                            // Calculate days to add to get to the selected day
                            const currentDay = today.getDay();
                            const targetDay = dayMap[slot.day];
                            let daysToAdd = targetDay - currentDay;

                            // If the day has already passed this week, schedule for next week
                            if (daysToAdd <= 0) {
                              daysToAdd += 7;
                            }

                            const appointmentDate = new Date(today);
                            appointmentDate.setDate(today.getDate() + daysToAdd);

                            const formattedDate = appointmentDate.toISOString().split('T')[0];
                            console.log('Selected date:', formattedDate);
                            setSelectedDate(formattedDate);
                            setSelectedTimeSlot(time);
                            setSelectedDay(slot.day);

                            toast.info(`Selected ${slot.day}, ${time}`);
                          }}
                          className={`text-[12px] leading-4 px-2 py-1 rounded ${
                            selectedTimeSlot === time && selectedDay === slot.day
                              ? 'bg-primaryColor text-white'
                              : 'bg-[#f1f3f5] text-textColor'
                          }`}
                        >
                          {time}
                        </button>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No specific times available for this day</p>
                    )}
                  </div>
                </li>
              ))
            ) : (
              <p className="text-gray-500">No time slots available</p>
            )}
          </ul>
        ) : (
          <div className="bg-blue-50 p-4 rounded-lg mt-3 border border-blue-100 text-center">
            <p className="text-gray-600 mb-2">
              {!token
                ? "Please login to view and select available time slots"
                : "Only patients can book appointments"}
            </p>
            {!token && (
              <button
                onClick={() => navigate('/login')}
                className="bg-primaryColor text-white py-1 px-3 rounded text-sm hover:bg-blue-600 transition-colors"
              >
                Login Now
              </button>
            )}
          </div>
        )}

        {selectedDate && selectedTimeSlot && selectedDay && (
          <div className="mt-4 bg-green-50 p-3 rounded-lg border border-green-100">
            <h4 className="font-semibold text-green-700 text-sm">Selected Appointment:</h4>
            <p className="text-gray-600 text-sm mt-1">
              Day: {selectedDay}
            </p>
            <p className="text-gray-600 text-sm">
              Date: {new Date(selectedDate).toLocaleDateString()}
            </p>
            <p className="text-gray-600 text-sm">
              Time: {selectedTimeSlot}
            </p>
          </div>
        )}
      </div>

      <button
        onClick={handleBooking}
        disabled={loading || !selectedDate || !selectedTimeSlot || !selectedDay || !token || role !== 'patient'}
        className={`w-full rounded-md flex items-center justify-center mt-4 gap-2 py-3 px-2 ${
          (!selectedDate || !selectedTimeSlot || !selectedDay) && token && role === 'patient'
            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
            : token && role === 'patient'
              ? 'btn'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
        }`}
      >
        {loading ? <HashLoader size={25} color="#ffffff" /> : (
          <>
            {!token && <FaLock className="text-sm" />}
            {(!selectedDate || !selectedTimeSlot || !selectedDay) && token && role === 'patient'
              ? "Select a time slot first"
              : "Book Appointment"}
          </>
        )}
      </button>

      {!token ? (
        <p className='text-sm text-gray-500 mt-2 text-center'>
          You need to be logged in to book an appointment
        </p>
      ) : role !== 'patient' ? (
        <p className='text-sm text-gray-500 mt-2 text-center'>
          Only patients can book appointments
        </p>
      ) : !selectedDate || !selectedTimeSlot || !selectedDay ? (
        <p className='text-sm text-gray-500 mt-2 text-center'>
          Please select a date and time slot above
        </p>
      ) : null}
    </div>
  );
};

export default SidePanel;