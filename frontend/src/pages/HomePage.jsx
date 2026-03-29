import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import '../styles/pages/HomePage.scss';

const HomePage = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div className="home-page">
      <div className="hero container">
        <h1>Write. Publish. Grow with Blogify.</h1>
        <p>Create posts, manage them from your dashboard, and share your ideas with the world.</p>
        <div className="hero-actions">
          {isAuthenticated ? (
            <Link to="/dashboard/create" className="btn btn-primary">
              Create New Post
            </Link>
          ) : (
            <Link to="/signup" className="btn btn-primary">
              Create
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
