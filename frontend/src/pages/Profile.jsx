import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const Profile = () => {
  const { user } = useAuth(); // Access user token from context
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch profile data from the backend
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/api/auth/profile', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setFormData({
          name: response.data.name,
          email: response.data.email,
          role: response.data.role || '',
          address: response.data.address || '',
        });
      } catch (error) {
        alert('Failed to fetch profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchProfile();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosInstance.put('/api/auth/profile', formData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream via-lightBlue to-primaryBlue flex items-center justify-center p-6">
        <div className="flex items-center justify-center space-x-2 text-darkNavy">
          <div className="w-6 h-6 border-2 border-darkNavy/30 border-t-darkNavy rounded-full animate-spin"></div>
          <span className="text-lg font-semibold">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-lightBlue to-primaryBlue flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-darkNavy mb-2">Your Profile</h1>
          <p className="text-darkNavy opacity-70">Update your account information</p>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-large p-8 border border-lightBlue/20">
          <div className="space-y-6">
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-darkNavy mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border-2 border-lightBlue/30 rounded-xl focus:border-primaryBlue focus:ring-0 outline-none transition-colors duration-200 text-darkNavy placeholder-gray-400"
                required
                disabled={loading}
              />
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-darkNavy mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border-2 border-lightBlue/30 rounded-xl focus:border-primaryBlue focus:ring-0 outline-none transition-colors duration-200 text-darkNavy placeholder-gray-400"
                required
                disabled={loading}
              />
            </div>

            {/* Role Input */}
            <div>
              <label htmlFor="role" className="block text-sm font-semibold text-darkNavy mb-2">
                Role
              </label>
              <input
                id="role"
                type="text"
                placeholder="Enter your role (optional)"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-3 border-2 border-lightBlue/30 rounded-xl focus:border-primaryBlue focus:ring-0 outline-none transition-colors duration-200 text-darkNavy placeholder-gray-400"
                disabled={loading}
              />
            </div>

            {/* Address Input */}
            <div>
              <label htmlFor="address" className="block text-sm font-semibold text-darkNavy mb-2">
                Address
              </label>
              <textarea
                id="address"
                placeholder="Enter your address (optional)"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-3 border-2 border-lightBlue/30 rounded-xl focus:border-primaryBlue focus:ring-0 outline-none transition-colors duration-200 text-darkNavy placeholder-gray-400 resize-none"
                rows="3"
                disabled={loading}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-200 transform ${loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primaryBlue hover:bg-darkNavy hover:shadow-medium hover:-translate-y-0.5 active:translate-y-0'
                }`}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Updating...</span>
                </div>
              ) : (
                'Update Profile'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;