import { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import HashLoader from 'react-spinners/HashLoader';

import loginImg from '../assets/images/login-Img.svg';

const Login = () => {
  const navigate = useNavigate();
  const { dispatch, user, isLoading, error } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    if (user) {
      // Redirect based on user role
      if (user.role === 'doctor') {
        navigate('/doctor/profile');
      } else if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch({ type: 'LOGIN_START' });

      const result = await authService.login(formData);

      if (!result.status) {
        const errorMessage = result.message || 'Login failed. Please check your credentials.';
        toast.error(errorMessage);
        dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
        return;
      }

      // Store role directly in localStorage for reliability
      localStorage.setItem('role', result.role);

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: result.data,
          token: result.token,
          role: result.role
        }
      });

      toast.success('Login successful!');

      // Redirect based on user role - using direct window.location for more reliability
      if (result.role === 'doctor') {
        console.log("Redirecting to doctor profile");
        toast.info("Redirecting to your doctor profile...");

        // Force a page reload to ensure clean state
        window.location.replace('/doctor/profile');
      } else if (result.role === 'admin') {
        console.log("Redirecting to admin dashboard");
        toast.info("Redirecting to admin dashboard...");

        // Force a page reload to ensure clean state
        window.location.replace('/admin');
      } else {
        console.log("Redirecting to home");
        toast.info("Redirecting to home page...");

        // Force a page reload to ensure clean state
        window.location.replace('/');
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.message || 'An unexpected error occurred. Please try again.';
      toast.error(errorMessage);
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
    }
  };

  return (
    <section className="px-5 xl:px-0">
      <div className="max-w-[1170px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 my-4 lg:my-0">
          {/* image box */}
          <div className="hidden lg:block bg-primaryColor rounded-l-lg">
            <figure className="rounded-l-lg flex items-center justify-center h-full p-8">
              <img src={loginImg} alt="Login illustration" className="w-full h-auto max-h-[400px] object-contain" />
            </figure>
          </div>
          {/* Login Form */}
          <div className="rounded-lg lg:rounded-l-none lg:rounded-r-lg lg:pl-16 py-10 px-5 sm:px-8 shadow-md bg-white">
            <h3 className="text-headingColor text-[22px] leading-9 font-bold mb-10">
              Hello! <span className="text-primaryColor">Welcome</span> Back
            </h3>
            <form onSubmit={handleSubmit}>
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
                  placeholder="Password Here"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
                  required
                />
              </div>
              <div className="mt-1 mb-5 text-right">
                <Link to="/forgot-password" className="text-sm text-primaryColor hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="mt-7">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-3 flex items-center justify-center">
                  {isLoading ? <HashLoader size={25} color="#ffffff" /> : 'Login'}
                </button>
              </div>
              <p className="mt-5 text-textColor text-center">
                Don&apos;t have an account?
                <Link to='/register' className='text-primaryColor font-medium ml-1'>
                  Register
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;