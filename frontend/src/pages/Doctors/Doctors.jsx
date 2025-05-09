import { useState, useEffect } from 'react';
import DoctorCard from './../../components/Doctors/DoctorCard';
import Testimonial from '../../components/Testimonial/Testimonial';
import { doctorService } from '../../services/api';
import HashLoader from 'react-spinners/HashLoader';
import { toast } from 'react-toastify';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async (query = '') => {
    try {
      setLoading(true);
      setError('');

      const result = await doctorService.getAllDoctors(query);

      if (result.success) {
        setDoctors(result.data);
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

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDoctors(searchTerm);
  };

  return (
    <>
      {/* Search Section */}
      <section className='bg-[#fff9ea]'>
        <div className="container text-center">
          <h2 className="heading">
            Find A Doctor
          </h2>
          <form onSubmit={handleSearch} className='max-w-[570px] mt-[30px] mx-auto bg-[#0066ff2c] rounded-md flex items-center justify-between'>
            <input
              type="search"
              placeholder='Search Doctor by Name or Specialization'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='py-4 pl-4 pr-2 bg-transparent w-full focus:outline-none cursor-pointer placeholder:text-textColor'
            />
            <button type="submit" className="btn mt-0 rounded-[0px] rounded-r-md">
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Doctors Section */}
      <section>
        <div className="container">
          {loading ? (
            <div className="flex items-center justify-center h-[300px]">
              <HashLoader size={45} color="#0067FF" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-[300px]">
              <h3 className="text-headingColor text-[20px] font-semibold">{error}</h3>
            </div>
          ) : doctors.length === 0 ? (
            <div className="flex items-center justify-center h-[300px]">
              <h3 className="text-headingColor text-[20px] font-semibold">No doctors found!</h3>
            </div>
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
              {doctors.map((doctor) => (
                <DoctorCard key={doctor._id} doctor={doctor} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section>
        <div className="container">
          <div className='xl:w-[470px] mx-auto'>
            <h2 className='heading text-center'>What Our Patients Say</h2>
            <p className='text__para text-center'>
              World-Class Care For Everyone. Our Health System Offers Unmatched,
              Expert Health Care.
            </p>
          </div>

          <Testimonial/>
        </div>
      </section>
    </>
  );
};

export default Doctors;