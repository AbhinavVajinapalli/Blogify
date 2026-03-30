import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

const MainSidebar = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <aside className="main-sidebar" aria-label="Quick navigation">
      <h3>Discover</h3>
      <nav>
        <NavLink to="/explore">Explore Posts</NavLink>
        <NavLink to="/">Featured</NavLink>
        {isAuthenticated ? <NavLink to="/dashboard/create">Write Story</NavLink> : <NavLink to="/signup">Get Started</NavLink>}
        {isAuthenticated && <NavLink to="/dashboard/settings">Account Settings</NavLink>}
      </nav>

      <div className="sidebar-promo">
        <p>Build your personal publication with custom public site URL and writer profile.</p>
      </div>
    </aside>
  );
};

export default MainSidebar;
