import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-primaryBlue text-white p-4 flex justify-between items-center shadow-lg">
      <Link to="/" className="text-2xl font-bold text-cream hover:text-lightBlue transition-colors duration-200">
        Woof Vet Clinic Management System
      </Link>
      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <Link
              to="/appointments"
              className="text-cream hover:text-lightBlue transition-colors duration-200 font-medium"
            >
              Appointments
            </Link>
            <Link
              to="/pet-profile"
              className="text-cream hover:text-lightBlue transition-colors duration-200 font-medium"
            >
              Pets
            </Link>
            <Link
              to="/profile"
              className="text-cream hover:text-lightBlue transition-colors duration-200 font-medium"
            >
              User Profile
            </Link>
            <button
              onClick={handleLogout}
              className="bg-darkNavy text-cream px-4 py-2 rounded-lg hover:bg-opacity-80 hover:shadow-medium transition-all duration-200 font-medium"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-cream hover:text-lightBlue transition-colors duration-200 font-medium"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-darkNavy text-cream px-4 py-2 rounded-lg hover:bg-opacity-80 hover:shadow-medium transition-all duration-200 font-medium"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;