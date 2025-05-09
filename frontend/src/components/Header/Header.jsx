import { useEffect, useRef, useState } from 'react';
import logo from '../../assets/images/logo.png';
import userImg from '../../assets/images/avatar-icon.png';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { BiMenu } from 'react-icons/bi';
import { FaUser, FaSignOutAlt, FaUserMd } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const navLinks = [
  {
    path: '/home',
    display: 'Home'
  },
  {
    path: '/doctors',
    display: 'Find a Doctor'
  },
  {
    path: '/services',
    display: 'Services'
  },
  {
    path: '/contact',
    display: 'Contact'
  },
];

const Header = () => {
  const headerRef = useRef(null);
  const menuRef = useRef(null);
  const { user, token, role, dispatch } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Check user authentication status
  useEffect(() => {
    // Authentication state is tracked via context
  }, [user, token, role]);

  const handleStickyHeader = () => {
    window.addEventListener('scroll', () => {
      if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
        headerRef.current.classList.add('sticky__header');
      } else {
        headerRef.current.classList.remove('sticky__header');
      }
    });
  };

  useEffect(() => {
    handleStickyHeader();

    return () => window.removeEventListener('scroll', handleStickyHeader);
  }, []);

  const toggleMenu = () => {
    if (menuRef.current) {
      menuRef.current.classList.toggle('show__menu');
    }
  };

  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    toast.success('Logged out successfully!');
    setIsDropdownOpen(false);
  };

  return (
    <header className="header flex items-center" ref={headerRef}>
      <div className="container">
        <div className="flex items-center justify-between py-2">
          <div>
            <Link to="/">
              <img src={logo} alt="Medicare Logo" />
            </Link>
          </div>
          <div className="navigation" ref={menuRef}>
            <div className="flex justify-between items-center px-4 py-2 md:hidden">
              <Link to="/" onClick={toggleMenu}>
                <img src={logo} alt="Medicare Logo" className="h-10" />
              </Link>
              <button
                className="text-2xl text-headingColor"
                onClick={toggleMenu}
              >
                ✕
              </button>
            </div>
            <ul className="menu flex items-center gap-8">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <NavLink
                    to={link.path}
                    className={navClass =>
                      navClass.isActive
                        ? "text-primaryColor text-[16px] leading-7 font-[600] px-4 py-2 rounded-md bg-blue-50"
                        : "text-textColor text-[16px] leading-7 font-[500] hover:text-primaryColor hover:bg-gray-50 px-4 py-2 rounded-md transition-all duration-300"
                    }
                    onClick={toggleMenu}
                  >
                    {link.display}
                  </NavLink>
                </li>
              ))}

              {/* Add login button for mobile */}
              {!token && (
                <li className="md:hidden">
                  <Link
                    to="/login"
                    className="bg-primaryColor text-white text-[16px] leading-7 font-[600] px-4 py-2 rounded-full"
                    onClick={toggleMenu}
                  >
                    Login
                  </Link>
                </li>
              )}
            </ul>
          </div>
          <div className='flex items-center gap-4'>
            {token ? (
              <div className='relative' ref={dropdownRef}>
                <div
                  onClick={toggleDropdown}
                  className='flex items-center gap-2 cursor-pointer hover:bg-gray-50 py-1 px-2 rounded-full transition-colors duration-200 min-w-[150px]'
                >
                  <div className='w-[40px] h-[40px] rounded-full overflow-hidden shadow-sm border-2 border-solid border-primaryColor'>
                    <img
                      src={user?.photo || userImg}
                      className='w-full h-full object-cover'
                      alt={user?.name || "User"}
                    />
                  </div>
                  <div>
                    <h2 className='text-headingColor text-[16px] leading-tight font-[600] truncate max-w-[120px]'>
                      {user?.name || 'User'}
                    </h2>
                    <p className='text-textColor text-[12px] leading-tight'>
                      {localStorage.getItem('role') === 'doctor' ? 'Doctor' :
                       localStorage.getItem('role') === 'admin' ? 'Admin' : 'Patient'}
                    </p>
                  </div>
                </div>

                {isDropdownOpen && (
                  <div className='absolute top-12 right-0 z-10 bg-white py-2 px-3 rounded-lg shadow-dropdownShadow w-[220px] border border-gray-100 transition-all duration-300 transform origin-top-right animate-dropdown'>
                    {/* Dropdown arrow */}
                    <div className="absolute -top-2 right-5 w-4 h-4 bg-white transform rotate-45 border-t border-l border-gray-100"></div>
                    <div className="border-b border-gray-100 pb-2">
                      <p className="text-xs text-gray-500">Signed in as</p>
                      <p className="text-sm font-semibold text-gray-700 truncate">{user?.email}</p>
                    </div>
                    <ul className="mt-2">
                      {/* Conditional rendering based on role */}
                      {localStorage.getItem('role') === 'doctor' ? (
                        <li>
                          <a
                            href="/doctor/profile"
                            className='flex items-center gap-2 bg-blue-50 text-primaryColor hover:bg-blue-100 rounded-md py-1.5 px-3 transition-colors duration-200 w-full text-left font-medium whitespace-nowrap'
                            onClick={(e) => {
                              e.preventDefault();
                              setIsDropdownOpen(false);
                              window.location.href = '/doctor/profile';
                            }}
                          >
                            <FaUserMd className="text-primaryColor text-[16px] flex-shrink-0" />
                            Doctor Dashboard
                          </a>
                        </li>
                      ) : (
                        <li>
                          <a
                            href="/profile"
                            className='flex items-center gap-2 bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-primaryColor rounded-md py-1.5 px-3 transition-colors duration-200 w-full text-left'
                            onClick={(e) => {
                              e.preventDefault();
                              setIsDropdownOpen(false);
                              window.location.href = '/profile';
                            }}
                          >
                            <FaUser className="text-gray-500 text-[14px] flex-shrink-0" />
                            My Profile
                          </a>
                        </li>
                      )}
                      <li className="mt-1">
                        <button
                          onClick={handleLogout}
                          className='flex items-center gap-2 text-gray-700 hover:bg-gray-50 hover:text-red-500 rounded-md py-1.5 px-3 w-full text-left transition-colors duration-200'
                        >
                          <FaSignOutAlt className="text-gray-500 text-[14px] flex-shrink-0" />
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <Link to='/login'>
                <button className='bg-primaryColor py-2 px-6 text-white font-[600] h-[44px] flex items-center justify-center rounded-[50px]'>
                  Login
                </button>
              </Link>
            )}
            <button
              className='md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-[#f5f5f5] cursor-pointer'
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <BiMenu className='text-2xl text-primaryColor'/>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header