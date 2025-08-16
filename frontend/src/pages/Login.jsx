import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { useModal } from '../components/Modal';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { showSuccess, showError, ModalComponent } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axiosInstance.post('/api/auth/login', formData);
      login(response.data);
      showSuccess('Welcome back! Redirecting to your appointments...', 'Login Successful');

      // Delay navigation to show success message
      setTimeout(() => {
        navigate('/appointments');
      }, 1500);
    } catch (error) {
      showError('Invalid email or password. Please check your credentials and try again.', 'Login Failed');
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
            <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-soft">
              <span className="text-2xl">🐕</span>
            </div>
            <h1 className="text-3xl font-bold text-darkNavy mb-2">Welcome Back</h1>
            <p className="text-darkNavy opacity-70">Sign in to your Woof Vet Clinic account</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-large p-8 border border-lightBlue/20">
            <div className="space-y-6">
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
                  placeholder="Enter your password"
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
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
          </form>

          {/* Register Link */}
          <div className="mt-8 text-center">
            <p className="text-darkNavy opacity-70">
              Don't have an account?{' '}
              <a
                href="/register"
                className="text-primaryBlue hover:text-darkNavy font-semibold transition-colors duration-200"
              >
                Sign up here
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

export default Login;