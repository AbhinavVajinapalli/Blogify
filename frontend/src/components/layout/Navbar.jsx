import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.scss';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          📝 BlogHub
        </Link>

        <div className="navbar-center">
          <Link to="/">Home</Link>
        </div>

        <div className="navbar-right">
          {isAuthenticated ? (
            <>
              <Link to="/blogs/new" className="btn btn-primary">
                ✍️ Write
              </Link>
              <Link to={`/profile/${user?.id}`} className="user-link">
                {user?.name}
              </Link>
              <button onClick={handleLogout} className="btn btn-secondary">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary">
                Login
              </Link>
              <Link to="/signup" className="btn btn-primary">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
