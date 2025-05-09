import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DoctorCard from './DoctorCard';
import { doctorService } from '../../services/api';
import HashLoader from 'react-spinners/HashLoader';
import { toast } from 'react-toastify';
import { BsArrowRight } from 'react-icons/bs';

function HomeDoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        setError('');

        const result = await doctorService.getAllDoctors();

        if (result.success) {
          // Sort doctors by rating (highest first) and take top 6
          const sortedDoctors = result.data
            .sort((a, b) => b.averageRating - a.averageRating)
            .slice(0, 6);

          setDoctors(sortedDoctors);
        } else {
          setError(result.message);
          toast.error(result.message);
        }
      } catch (error) {
        setError('Failed to fetch doctors. Please try again.');
        toast.error('Failed to fetch doctors. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <HashLoader size={45} color="#0067FF" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <h3 className="text-headingColor text-[20px] font-semibold">{error}</h3>
      </div>
    );
  }

  if (doctors.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <h3 className="text-headingColor text-[20px] font-semibold">No doctors found!</h3>
      </div>
    );
  }

  return (
    <>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 lg:gap-[30px] mt-[30px] lg:mt-[55px]'>
        {doctors.map(doctor => (
          <DoctorCard key={doctor._id} doctor={doctor} />
        ))}
      </div>

      <div className="flex justify-center mt-10">
        <Link
          to="/doctors"
          className="btn flex items-center gap-2 bg-primaryColor text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300"
        >
          View All Doctors <BsArrowRight className="ml-1" />
        </Link>
      </div>
    </>
  );
}

export default HomeDoctorList;
