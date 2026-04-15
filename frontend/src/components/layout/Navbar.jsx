import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../common/Logo';
import ThemeToggle from '../common/ThemeToggle';
import '../../styles/Navbar.scss';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const brandTarget = isAuthenticated ? '/dashboard/posts' : '/';

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to={brandTarget} className="navbar-brand">
          <Logo text="Blogify" />
        </Link>

        <div className="navbar-right">
          <ThemeToggle className="navbar-theme-toggle" />
          {isAuthenticated ? (
            <>
              <Link to="/explore" className="btn btn-secondary">
                Explore
              </Link>
              <Link to="/dashboard/posts" className="btn btn-primary">
                Dashboard
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
