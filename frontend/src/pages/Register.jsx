import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { useModal } from '../components/Modal';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { showSuccess, showError, ModalComponent } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axiosInstance.post('/api/auth/register', formData);
      showSuccess('Registration successful! Redirecting to login page...', 'Welcome to Woof Vet Clinic');

      // Delay navigation to show success message
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error) {
      showError('Registration failed. Please check your information and try again.', 'Registration Failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-cream via-lightBlue to-primaryBlue flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-darkNavy mb-2">Create Account</h1>
            <p className="text-darkNavy opacity-70">Join Woof Vet Clinic to get started</p>
          </div>

          {/* Register Form */}
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
                  disabled={isLoading}
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
                  disabled={isLoading}
                />
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-darkNavy mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-lightBlue/30 rounded-xl focus:border-primaryBlue focus:ring-0 outline-none transition-colors duration-200 text-darkNavy placeholder-gray-400"
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-200 transform ${isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-primaryBlue hover:bg-darkNavy hover:shadow-medium hover:-translate-y-0.5 active:translate-y-0'
                  }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Creating account...</span>
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-darkNavy opacity-70">
              Already have an account?{' '}
              <a
                href="/login"
                className="text-primaryBlue hover:text-darkNavy font-semibold transition-colors duration-200"
              >
                Sign in here
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Modal Component */}
      <ModalComponent />
    </>
  );
};

export default Register;