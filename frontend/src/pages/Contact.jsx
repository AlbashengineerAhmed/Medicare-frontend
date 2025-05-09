import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaLock } from 'react-icons/fa';
import HashLoader from 'react-spinners/HashLoader';

const Contact = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!token) {
      toast.info('Please login to send feedback');
      navigate('/login');
      return;
    }

    if (!formData.email || !formData.subject || !formData.message) {
      toast.error('Please fill all fields');
      return;
    }

    setLoading(true);

    // Simulate form submission
    setTimeout(() => {
      toast.success('Your message has been sent successfully!');
      setFormData({
        email: '',
        subject: '',
        message: ''
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <section>
      <div className='px-4 mx-auto max-w-screen-md'>
        <h2 className='heading text-center'>
          Contact Us
        </h2>
        <p className='mb-8 lg:mb-16 font-light text-center text__para'>
          Got a technical issue? Want to send feedback about beta feature? Let Us Know
        </p>

        {!token && (
          <div className="bg-blue-50 p-4 rounded-lg mb-8 border border-blue-100 text-center">
            <FaLock className="text-primaryColor text-xl mx-auto mb-2" />
            <h3 className="text-headingColor font-semibold mb-1">Login Required</h3>
            <p className="text-gray-600 mb-3">You need to be logged in to send feedback</p>
            <button
              onClick={() => navigate('/login')}
              className="bg-primaryColor text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Login Now
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-8'>
          <div>
            <label htmlFor="email" className='form__label'>
              Your Email
            </label>
            <input
              type="email"
              id='email'
              placeholder='example@gmail.com'
              className='form__input mt-1'
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="subject" className='form__label'>
              Subject
            </label>
            <input
              type="text"
              id='subject'
              placeholder='Let us know how we can help you'
              className='form__input mt-1'
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="message" className='form__label'>
              Your Message
            </label>
            <textarea
              rows={5}
              id='message'
              placeholder='Leave a comment . . .'
              className='form__input-1 mt-1'
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading || !token}
            className="btn rounded sm:w-fit flex items-center justify-center gap-2"
          >
            {loading ? <HashLoader size={25} color="#ffffff" /> : (
              <>
                {!token && <FaLock className="text-sm" />}
                Submit
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  )
}

export default Contact