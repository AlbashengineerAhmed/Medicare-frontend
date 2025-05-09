import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import defaultDoctorImg from '../../assets/images/doctor-img02.png';
import starIcon from '../../assets/images/Star.png';
import DoctorAbout from './DoctorAbout';
import Feedback from './Feedback';
import SidePanel from './SidePanel';
import { doctorService } from '../../services/api';
import HashLoader from 'react-spinners/HashLoader';
import { toast } from 'react-toastify';
import { formatDoctorName } from '../../utils/formatDoctorName';

const DoctorsDetails = () => {
  const { id } = useParams();
  const [tab, setTab] = useState('about');
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true);
        setError('');

        const result = await doctorService.getDoctorById(id);

        if (result.success) {
          setDoctor(result.data);
        } else {
          setError(result.message);
          toast.error(result.message);
        }
      } catch (error) {
        setError('Failed to fetch doctor details. Please try again.');
        toast.error('Failed to fetch doctor details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  return (
    <section>
      <div className='max-w-[1170px] px-5 mx-auto'>
        {loading ? (
          <div className="flex items-center justify-center h-[400px]">
            <HashLoader size={45} color="#0067FF" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-[400px]">
            <h3 className="text-headingColor text-[20px] font-semibold">{error}</h3>
          </div>
        ) : doctor ? (
          <div className='grid md:grid-cols-3 gap-[50px]'>
            <div className='md:col-span-2'>
              <div className='flex items-center gap-5'>
                <figure className='max-w-[200px] max-h-[200px]'>
                  <img
                    src={doctor.photo || defaultDoctorImg}
                    alt={doctor.name}
                    className='w-full rounded-lg'
                  />
                </figure>
                <div>
                  <span className='bg-[#ccf0f3] text-irisBlueColor py-1 px-6 lg:py-2 lg:px-6 text-[12px] leading-4 lg:text-[16px] lg:leading-7 font-semibold rounded'>
                    {doctor.specialization}
                  </span>
                  <h3 className='text-headingColor text-[22px] leading-9 mt-3 font-bold'>
                    {formatDoctorName(doctor.name)}
                  </h3>
                  <div className='flex items-center gap-[6px]'>
                    <span className='flex items-center gap-[6px] text-[14px] leading-5 lg:text-[16px] lg:leading-7 font-semibold text-headingColor'>
                      <img src={starIcon} alt="rating" /> {doctor.averageRating?.toFixed(1) || '0.0'}
                    </span>
                    <span className='text-[14px] leading-5 lg:text-[16px] lg:leading-7 font-[400] text-textColor'>
                      ({doctor.totalRating || 0})
                    </span>
                  </div>
                  <p className='text__para text-[14px] leading-6 md:text-[15px] lg:max-w-[390px]'>
                    {doctor.bio || 'No bio available'}
                  </p>
                </div>
              </div>

              <div className='mt-[50px] border-b border-solid border-[#0066ff34]'>
                <button
                  onClick={() => setTab('about')}
                  className={`${tab === 'about' && 'border-b border-solid border-primaryColor'} py-2 px-5 mr-5 text-[16px] leading-7 text-headingColor font-semibold`}
                >
                  About
                </button>
                <button
                  onClick={() => setTab('feedback')}
                  className={`${tab === 'feedback' && 'border-b border-solid border-primaryColor'} py-2 px-5 mr-5 text-[16px] leading-7 text-headingColor font-semibold`}
                >
                  Feedback
                </button>
              </div>

              <div className='mt-[50px]'>
                {tab === 'about' && <DoctorAbout doctor={doctor} />}
                {tab === 'feedback' && <Feedback doctor={doctor} />}
              </div>
            </div>

            <div>
              <SidePanel doctor={doctor} />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-[400px]">
            <h3 className="text-headingColor text-[20px] font-semibold">Doctor not found!</h3>
          </div>
        )}
      </div>
    </section>
  );
};

export default DoctorsDetails;