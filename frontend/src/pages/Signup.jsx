import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import HashLoader from 'react-spinners/HashLoader';

import signupImg from '../assets/images/signup.gif';
import avatar from '../assets/images/doctor-img01.png';

const Signup = () => {
  const navigate = useNavigate();
  const { dispatch, user, isLoading, error } = useAuth();

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    photo: null,
    gender: '',
    role: 'patient',
  });

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({ type: 'CLEAR_ERROR' });
    }
  }, [error, dispatch]);

  const handleInputChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileInputChange = async event => {
    const file = event.target.files[0];

    if (file) {
      try {
        console.log("Selected file:", file);
        setSelectedFile(file);
        setFormData({ ...formData, photo: file });

        // Create preview URL
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          setPreviewURL(reader.result);
        };
      } catch (error) {
        console.error("Error handling file input:", error);
        toast.error("There was an error processing the selected image. Please try another image or register without a photo.");
        // Reset the file input
        setSelectedFile(null);
        setFormData({ ...formData, photo: null });
        setPreviewURL('');
      }
    }
  };

  const submitHandler = async event => {
    event.preventDefault();

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    if (!formData.gender) {
      toast.error('Please select your gender');
      return;
    }

    try {
      dispatch({ type: 'REGISTER_START' });

      // Create a copy of the form data for logging (to avoid circular references)
      const logFormData = { ...formData };
      if (logFormData.photo instanceof File) {
        logFormData.photo = `File: ${logFormData.photo.name}`;
      }
      console.log('Submitting registration form:', logFormData);

      // If there's an issue with the photo, try registering without it
      if (formData.photo instanceof File && formData.photo.size > 5 * 1024 * 1024) {
        toast.warning('Photo is too large. Proceeding without photo.');
        const { photo: _, ...formDataWithoutPhoto } = formData;
        const result = await authService.register({ ...formDataWithoutPhoto, photo: null });
        console.log('Registration response (without photo):', result);
        return result;
      }

      const result = await authService.register(formData);

      console.log('Registration response:', result);

      if (!result.success) {
        const errorMessage = result.message || 'Registration failed. Please try again.';
        toast.error(errorMessage);
        dispatch({ type: 'REGISTER_FAILURE', payload: errorMessage });
        return;
      }

      dispatch({ type: 'REGISTER_SUCCESS' });

      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.message || 'An unexpected error occurred. Please try again.';
      toast.error(errorMessage);
      dispatch({ type: 'REGISTER_FAILURE', payload: errorMessage });
    }
  };

  return (
    <section className='px-5 xl:px-0'>
      <div className='max-w-[1170px] mx-auto'>
        <div className='grid grid-cols-1 lg:grid-cols-2 my-4 lg:my-0'>
          {/* image box */}
          <div className='hidden lg:block bg-primaryColor rounded-l-lg'>
            <figure className='rounded-l-lg flex items-center justify-center h-full p-8'>
              <img src={signupImg} alt="Signup illustration" className='w-full h-auto max-h-[400px] object-contain'/>
            </figure>
          </div>
          {/* Sign Up Form */}
          <div className='rounded-lg lg:rounded-l-none lg:rounded-r-lg lg:pl-16 py-10 px-5 sm:px-8 shadow-md bg-white'>
            <h3 className='text-headingColor text-[22px] leading-9 font-bold mb-10'>
              Create An <span className='text-primaryColor'>Account</span>
            </h3>

          <form onSubmit={submitHandler}>
            <div className="mb-5">
              <input
                type="text"
                placeholder="Full Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
                required
              />
            </div>
            <div className="mb-5">
              <input
                type="email"
                placeholder="Enter Your Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
                required
              />
            </div>
            <div className="mb-5">
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
                required
              />
            </div>
            <div className='mb-5 flex items-center justify-between'>
              <label
                className='text-headingColor font-bold text-[16px] leading-7'
              >
                Are You A:
                <select
                  name='role'
                  value={formData.role}
                  onChange={handleInputChange}
                  className='text-textColor font-semibold text-[15px] leading-7 px-4 py-3 focus:outline-none'
                >
                  <option value="patient">Patient</option>
                  <option value="doctor">Doctor</option>
                </select>
              </label>
              <label
                className='text-headingColor font-bold text-[16px] leading-7'
              >
                Gender:
                <select
                  name='gender'
                  value={formData.gender}
                  onChange={handleInputChange}
                  className='text-textColor font-semibold text-[15px] leading-7 px-4 py-3 focus:outline-none'
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </label>
            </div>
            <div className='mb-5 flex items-center gap-3'>
              {previewURL ? (
                <figure className='w-[60px] h-[60px] rounded-full border-2 border-solid border-primaryColor flex items-center justify-center overflow-hidden'>
                  <img src={previewURL} alt="" className='w-full h-full object-cover rounded-full' />
                </figure>
              ) : (
                <figure className='w-[60px] h-[60px] rounded-full border-2 border-solid border-primaryColor flex items-center justify-center overflow-hidden'>
                  <img src={avatar} alt="" className='w-full h-full object-cover rounded-full' />
                </figure>
              )}
              <div className='relative w-[130px] h-[50px]'>
                <input
                  type="file"
                  name='photo'
                  id='customFile'
                  onChange={handleFileInputChange}
                  accept='.jpg, .jpeg, .png'
                  className='absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer'
                />
                <label
                  htmlFor="customFile"
                  className='absolute top-0 left-0 w-full h-full flex items-center px-[0.75rem] py-[0.375rem]
                  text-[15px] leading-6 overflow-hidden bg-[#0066ff46] text-headingColor font-semibold rounded-lg truncate cursor-pointer'
                >
                  {selectedFile ? selectedFile.name.substring(0, 15) + '...' : 'Upload Photo'}
                </label>
              </div>
            </div>
            <div className="mt-7">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-3 flex items-center justify-center"
              >
                {isLoading ? <HashLoader size={25} color="#ffffff" /> : 'Sign Up'}
              </button>
            </div>
            <p className="mt-5 text-textColor text-center">
              Already have an account?
              <Link to='/login' className='text-primaryColor font-medium ml-1'>
                Login
              </Link>
            </p>
          </form>

          </div>
        </div>
      </div>
    </section>
  )
}

export default Signup