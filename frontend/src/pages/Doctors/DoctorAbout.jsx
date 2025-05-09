import { formatDate } from '../../utils/formatDate';
import React from 'react';
import { formatDoctorName } from '../../utils/formatDoctorName';

const DoctorAbout = ({ doctor }) => {
  return (
    <div>
        <div>
            <h3 className='text-[20px] leading-[30px] text-headingColor font-semibold flex items-center gap-2'>
                About Of
                <span className='text-irisBlueColor font-bold text-[24px] leading-9'>
                    {doctor?.name ? formatDoctorName(doctor.name) : 'Doctor'}
                </span>
            </h3>
            <p className="text__para">
                {doctor?.bio || 'No bio information available for this doctor.'}
            </p>
        </div>

        <div className='mt-12'>
            <h3 className='text-[20px] leading-[30px] text-headingColor font-semibold'>
                Education
            </h3>
            <ul className='pt-4 md:p-5'>
                {doctor?.qualifications && doctor.qualifications.length > 0 ? (
                    doctor.qualifications.map((edu, index) => (
                        <li key={index} className='flex flex-col sm:flex-row sm:justify-between sm:items-end md:gap-5 mb-[30px]'>
                            <div>
                                <span className='text-irisBlueColor text-[15px] leading-6 font-semibold'>
                                    {edu.startDate && formatDate(edu.startDate)} - {edu.endDate ? formatDate(edu.endDate) : 'Present'}
                                </span>
                                <p className='text-[16px] leading-6 font-medium text-textColor'>
                                    {edu.degree}
                                </p>
                            </div>
                            <p className='text-[14px] leading-5 font-medium text-textColor'>
                                {edu.institution}
                            </p>
                        </li>
                    ))
                ) : (
                    <li className='flex flex-col sm:flex-row sm:justify-between sm:items-end md:gap-5 mb-[30px]'>
                        <div>
                            <span className='text-irisBlueColor text-[15px] leading-6 font-semibold'>
                                {formatDate('06-04-2010')} - {formatDate('12-04-2017')}
                            </span>
                            <p className='text-[16px] leading-6 font-medium text-textColor'>
                                PhD in {doctor?.specialization || 'Medicine'}
                            </p>
                        </div>
                        <p className='text-[14px] leading-5 font-medium text-textColor'>
                            Medical University
                        </p>
                    </li>
                )}
            </ul>
        </div>

        <div className='mt-12'>
            <h3 className='text-[20px] leading-[30px] text-headingColor font-semibold'>
                Experience
            </h3>
            <ul className='grid sm:grid-cols-2 gap-[30px] pt-4 md:p-5'>
                {doctor?.experiences && doctor.experiences.length > 0 ? (
                    doctor.experiences.map((exp, index) => (
                        <li key={index} className='p-4 rounded bg-[#fff9ea]'>
                            <span className='text-yellowColor text-[15px] leading-6 font-semibold'>
                                {exp.startDate && formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Present'}
                            </span>
                            <p className='text-[16px] leading-6 font-medium text-textColor'>
                                {exp.position}
                            </p>
                            <p className='text-[16px] leading-6 font-medium text-textColor'>
                                {exp.hospital}
                            </p>
                        </li>
                    ))
                ) : (
                    <li className='p-4 rounded bg-[#fff9ea] col-span-2'>
                        <p className='text-[16px] leading-6 font-medium text-textColor'>
                            {doctor?.specialization || 'Medical'} Specialist with {doctor?.yearsOfExperience || 'several'} years of experience
                        </p>
                    </li>
                )}
            </ul>
        </div>

        {doctor?.specialization && (
            <div className='mt-12'>
                <h3 className='text-[20px] leading-[30px] text-headingColor font-semibold'>
                    Specialization
                </h3>
                <p className='text__para'>
                    {doctor.specialization}
                </p>
            </div>
        )}

        {doctor?.about && (
            <div className='mt-12'>
                <h3 className='text-[20px] leading-[30px] text-headingColor font-semibold'>
                    Additional Information
                </h3>
                <p className='text__para'>
                    {doctor.about}
                </p>
            </div>
        )}
    </div>
  );
};

export default DoctorAbout;