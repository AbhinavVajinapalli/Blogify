import { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../features/auth/authSlice';
import Logo from '../common/Logo';
import ThemeToggle from '../common/ThemeToggle';
import EffectsToggle from '../common/EffectsToggle';
import '../../styles/DashboardLayout.scss';

const CreateIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M13 4h7v2h-7V4Zm0 14h7v2h-7v-2ZM4 12l7-7v4h9v6h-9v4l-7-7Z" fill="currentColor" />
  </svg>
);

const PostsIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path
      d="M5 5.5A1.5 1.5 0 0 1 6.5 4h11A1.5 1.5 0 0 1 19 5.5v13A1.5 1.5 0 0 1 17.5 20h-11A1.5 1.5 0 0 1 5 18.5v-13ZM8 7h8v2H8V7Zm0 4h8v2H8v-2Zm0 4h6v2H8v-2Z"
      fill="currentColor"
    />
  </svg>
);

const StatsIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M5 19h14v2H3V3h2v16Zm4-3H7v-6h2v6Zm4 0h-2V8h2v8Zm4 0h-2v-4h2v4Z" fill="currentColor" />
  </svg>
);

const GlobeIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path
      d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm6.9 8h-2.03a13.2 13.2 0 0 0-1.1-4.2A7.03 7.03 0 0 1 18.9 11ZM12 5c.74 0 1.94 1.61 2.63 6H9.37C10.06 6.61 11.26 5 12 5ZM5.1 13h2.03a13.2 13.2 0 0 0 1.1 4.2A7.03 7.03 0 0 1 5.1 13Zm2.03-2H5.1a7.03 7.03 0 0 1 3.13-4.2A13.2 13.2 0 0 0 7.13 11Zm4.87 8c-.74 0-1.94-1.61-2.63-6h5.26c-.69 4.39-1.89 6-2.63 6Zm4.87-1.8a13.2 13.2 0 0 0 1.1-4.2h2.03a7.03 7.03 0 0 1-3.13 4.2Z"
      fill="currentColor"
    />
  </svg>
);

const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path
      d="M19.14 12.94a7.53 7.53 0 0 0 .05-.94 7.53 7.53 0 0 0-.05-.94l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.6-.22l-2.39.96a7.1 7.1 0 0 0-1.63-.94l-.36-2.54A.5.5 0 0 0 13.89 2h-3.78a.5.5 0 0 0-.5.43l-.36 2.54c-.58.22-1.13.53-1.63.94l-2.39-.96a.5.5 0 0 0-.6.22L2.71 8.49a.5.5 0 0 0 .12.64l2.03 1.58a7.53 7.53 0 0 0-.05.94c0 .32.02.63.05.94l-2.03 1.58a.5.5 0 0 0-.12.64l1.92 3.32a.5.5 0 0 0 .6.22l2.39-.96c.5.41 1.05.72 1.63.94l.36 2.54a.5.5 0 0 0 .5.43h3.78a.5.5 0 0 0 .5-.43l.36-2.54c.58-.22 1.13-.53 1.63-.94l2.39.96a.5.5 0 0 0 .6-.22l1.92-3.32a.5.5 0 0 0-.12-.64l-2.03-1.58ZM12 15.5A3.5 3.5 0 1 1 12 8a3.5 3.5 0 0 1 0 7.5Z"
      fill="currentColor"
    />
  </svg>
);

const ExpandIcon = ({ expanded }) => <span aria-hidden="true">{expanded ? '‹' : '›'}</span>;

ExpandIcon.propTypes = {
  expanded: PropTypes.bool.isRequired,
};

const navItems = [
  { to: '/dashboard/create', label: 'Create New Post', icon: <CreateIcon /> },
  { to: '/dashboard/posts', label: 'Posts', icon: <PostsIcon /> },
  { to: '/dashboard/stats', label: 'Stats', icon: <StatsIcon /> },
  { to: '/dashboard/settings', label: 'Settings', icon: <SettingsIcon /> },
  { to: '/dashboard/posts', label: 'View Blogs', icon: <GlobeIcon />, external: true },
];

const DashboardLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const sitePath = user?.siteSlug ? `/site/${user.siteSlug}` : '/dashboard/settings';

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const isExpanded = isSidebarExpanded;

  return (
    <div className="dashboard-layout">
      <aside
        className={`dashboard-sidebar ${isExpanded ? 'is-expanded' : 'is-collapsed'}`}
        onMouseEnter={() => setIsSidebarExpanded(true)}
        onMouseLeave={() => setIsSidebarExpanded(false)}
      >
        <div className="brand">
          <Logo text="Blogify" light />
          <button
            type="button"
            className="sidebar-expand-btn"
            onClick={() => setIsSidebarExpanded((prev) => !prev)}
            aria-label={isExpanded ? 'Collapse navigation' : 'Expand navigation'}
            aria-pressed={isExpanded}
          >
            <ExpandIcon expanded={isExpanded} />
          </button>
        </div>
        <nav className="dashboard-nav">
          {navItems.map((item) => {
            const sharedClassName = ({ isActive }) => (isActive ? 'active' : '');

            if (item.external) {
              return (
                <Link key={item.label} to={sitePath} target="_blank" rel="noreferrer" className="nav-link">
                  {item.icon}
                  <span className="nav-label">{item.label}</span>
                </Link>
              );
            }

            return (
              <NavLink key={item.label} to={item.to} className={sharedClassName}>
                {item.icon}
                <span className="nav-label">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
        <button type="button" className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="dashboard-header-copy">
            <h1>Dashboard</h1>
            <p>{user?.name ? `Welcome, ${user.name}` : 'Manage your content'}</p>
          </div>
          <div className="dashboard-header-controls">
            <EffectsToggle className="dashboard-utility-toggle" />
            <ThemeToggle className="dashboard-utility-toggle" />
          </div>
        </header>
        <section className="dashboard-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default DashboardLayout;
