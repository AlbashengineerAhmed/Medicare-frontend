/* eslint-disable react/prop-types */
import React from 'react';
import starIcon from '../../assets/images/Star.png';
import { Link } from 'react-router-dom';
import { BsArrowRight } from 'react-icons/bs';
import defaultDoctorImg from '../../assets/images/doctor-img01.png';
import { formatDoctorName } from '../../utils/formatDoctorName';

function DoctorCard({ doctor }) {
  // Extract doctor data with fallback values
  const {
    _id,
    name,
    specialization,
    averageRating = 0,
    totalRating = 0,
    photo,
    appointments = [],
    hospital = 'Medicare Hospital'
  } = doctor;

  return (
    <div className='p-3 lg:p-5'>
      <div className='relative h-[220px] rounded-t-md bg-[#f5f5f5] overflow-hidden'>
        <img
          src={photo || defaultDoctorImg}
          className='absolute top-0 left-0 w-full h-full object-cover'
          style={{ objectPosition: 'center 20%' }}
          alt={name}
        />
      </div>
      <h2 className='text-[18px] leading-[30px] lg:text-[26px] lg:leading-9 text-headingColor font-[700] mt-3 lg:mt-5'>
        {formatDoctorName(name)}
      </h2>
      <div className='mt-2 lg:mt-4 flex items-center justify-between'>
        <span className='bg-[#CCF0F3] text-irisBlueColor py-1 px-2 lg:py-2 lg:px-6 text-[12px] leading-4 lg:text-[16px] lg:leading-7 font-semibold rounded'>
          {specialization}
        </span>
        <div className='flex items-center gap-[6px]'>
          <span className='flex items-center gap-[6px] text-[14px] leading-6 lg:text-[16px] lg:leading-7 font-semibold text-headingColor'>
            <img src={starIcon} alt="rating" />
            {averageRating.toFixed(1)}
          </span>
          <span className='text-[14px] leading-6 lg:text-[16px] lg:leading-7 font-[400] text-textColor'>
            ({totalRating})
          </span>
        </div>
      </div>

      <div className='mt-[18px] lg:mt-5 flex items-center justify-between'>
        <div>
          <h3 className='text-[16px] leading-7 lg:text-[18px] lg:leading-[30px] font-semibold text-headingColor'>
            + {appointments.length} Patients
          </h3>
          <p className='text-[14px] leading-6 font-[400] text-textColor'>
            At {hospital}
          </p>
        </div>

        <Link
          to={`/doctors/${_id}`}
          className='w-[44px] h-[44px] rounded-full border border-solid border-[#181A1E] flex items-center group hover:bg-primaryColor hover:border-none justify-center'
        >
          <BsArrowRight className='group-hover:text-white w-6 h-5'/>
        </Link>
      </div>
    </div>
  );
}

export default DoctorCard;