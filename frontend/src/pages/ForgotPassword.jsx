import { useState } from "react";
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import HashLoader from 'react-spinners/HashLoader';

import loginImg from '../assets/images/login-Img.svg';
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate email
    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Simulate API call (since this is a static page without backend integration)
    setIsLoading(true);
    
    // Simulate network delay
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      toast.success('Password reset instructions sent to your email');
    }, 1500);
  };

  return (
    <section className="px-5 xl:px-0">
      <div className="max-w-[1170px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 my-4 lg:my-0">
          {/* image box */}
          <div className="hidden lg:block bg-primaryColor rounded-l-lg">
            <figure className="rounded-l-lg flex items-center justify-center h-full p-8">
              <img src={loginImg} alt="Password reset illustration" className="w-full h-auto max-h-[400px] object-contain" />
            </figure>
          </div>
          
          {/* Forgot Password Form */}
          <div className="rounded-lg lg:rounded-l-none lg:rounded-r-lg lg:pl-16 py-10 px-5 sm:px-8 shadow-md bg-white">
            <div className="mb-5">
              <Link to="/login" className="flex items-center text-primaryColor hover:underline">
                <FaArrowLeft className="mr-2" /> Back to Login
              </Link>
            </div>
            
            <h3 className="text-headingColor text-[22px] leading-9 font-bold mb-10">
              Forgot Your <span className="text-primaryColor">Password?</span>
            </h3>
            
            {!isSubmitted ? (
              <>
                <p className="text-textColor mb-6">
                  Enter your email address below and we'll send you instructions to reset your password.
                </p>
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-5 relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                      <FaEnvelope />
                    </span>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full py-3 pl-10 pr-4 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor"
                      required
                    />
                  </div>
                  
                  <div className="mt-7">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-3 flex items-center justify-center"
                    >
                      {isLoading ? <HashLoader size={25} color="#ffffff" /> : 'Reset Password'}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-center">
                <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-6">
                  <p className="font-medium">Email Sent!</p>
                  <p className="text-sm mt-1">Check your inbox for password reset instructions.</p>
                </div>
                
                <p className="text-textColor mb-4">
                  We've sent an email to <span className="font-medium">{email}</span> with instructions to reset your password.
                </p>
                
                <p className="text-textColor text-sm mb-6">
                  If you don't see the email in your inbox, please check your spam folder.
                </p>
                
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setEmail('');
                  }}
                  className="text-primaryColor hover:underline"
                >
                  Try with a different email
                </button>
              </div>
            )}
            
            <p className="mt-5 text-textColor text-center">
              Remember your password?
              <Link to='/login' className='text-primaryColor font-medium ml-1'>
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
