import { useState } from 'react';
import { toast } from 'react-toastify';
import { userService } from '../../services/api';
import HashLoader from 'react-spinners/HashLoader';
import { FaLock } from 'react-icons/fa';

const PasswordUpdateForm = () => {
  const [loading, setLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long');
      return;
    }

    try {
      setLoading(true);

      const result = await userService.updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (result.success) {
        toast.success('Password updated successfully');
        // Reset form
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        toast.error(result.message || 'Failed to update password');
      }
    } catch (error) {
      toast.error('Failed to update password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <label className="text-headingColor font-semibold mb-2 flex items-center gap-2">
            <FaLock className="text-primaryColor" /> Current Password
          </label>
          <input
            type="password"
            placeholder="Enter your current password"
            name="currentPassword"
            value={passwordData.currentPassword}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-solid border-[#0066ff61] focus:outline-none focus:border-primaryColor text-[16px] leading-7 text-headingColor rounded-lg bg-gray-50"
            required
          />
        </div>

        <div className="mb-5">
          <label className="text-headingColor font-semibold mb-2 flex items-center gap-2">
            <FaLock className="text-primaryColor" /> New Password
          </label>
          <input
            type="password"
            placeholder="Enter your new password"
            name="newPassword"
            value={passwordData.newPassword}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-solid border-[#0066ff61] focus:outline-none focus:border-primaryColor text-[16px] leading-7 text-headingColor rounded-lg bg-gray-50"
            required
          />
        </div>

        <div className="mb-5">
          <label className="text-headingColor font-semibold mb-2 flex items-center gap-2">
            <FaLock className="text-primaryColor" /> Confirm New Password
          </label>
          <input
            type="password"
            placeholder="Confirm your new password"
            name="confirmPassword"
            value={passwordData.confirmPassword}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-solid border-[#0066ff61] focus:outline-none focus:border-primaryColor text-[16px] leading-7 text-headingColor rounded-lg bg-gray-50"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-3 flex items-center justify-center"
        >
          {loading ? <HashLoader size={25} color="#ffffff" /> : 'Update Password'}
        </button>
      </form>
    </div>
  );
};

export default PasswordUpdateForm;
