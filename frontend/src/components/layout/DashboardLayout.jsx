import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import Logo from '../common/Logo';
import '../../styles/DashboardLayout.scss';

const DashboardLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const sitePath = user?.siteSlug ? `/site/${user.siteSlug}` : '/dashboard/settings';

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <div className="brand">
          <Logo text="Blogify" light />
        </div>
        <nav className="dashboard-nav">
          <NavLink to="/dashboard/create" className={({ isActive }) => (isActive ? 'active' : '')}>
            Create New Post
          </NavLink>
          <NavLink to="/dashboard/posts" className={({ isActive }) => (isActive ? 'active' : '')}>
            Posts
          </NavLink>
          <Link to={sitePath} target="_blank" rel="noreferrer">
            View Blogs
          </Link>
          <NavLink to="/dashboard/settings" className={({ isActive }) => (isActive ? 'active' : '')}>
            Settings
          </NavLink>
        </nav>
        <button type="button" className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>Dashboard</h1>
          <p>{user?.name ? `Welcome, ${user.name}` : 'Manage your content'}</p>
        </header>
        <section className="dashboard-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default DashboardLayout;
