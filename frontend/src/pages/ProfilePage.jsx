import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { setProfile, setProfileBlogs, setLoading, setError } from '../features/profile/profileSlice';
import { blogService } from '../services/blogService';
import BlogCard from '../components/blog/BlogCard';
import Pagination from '../components/common/Pagination';
import '../styles/pages/ProfilePage.scss';

const ProfilePage = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const { profile, blogs, pagination, loading, error } = useSelector((state) => state.profile);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        dispatch(setLoading(true));
        const profileData = await blogService.getUserProfile(userId);
        dispatch(setProfile(profileData));

        const blogsData = await blogService.getUserBlogs(userId, {
          page: currentPage,
          limit: 10,
        });
        dispatch(setProfileBlogs(blogsData));
      } catch (err) {
        dispatch(setError(err.message));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchProfile();
  }, [userId, currentPage, dispatch]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <div className="profile-page">
      {error && <div className="error">{error}</div>}

      {profile && (
        <div className="profile-header">
          {profile.profilePicture && (
            <img src={profile.profilePicture} alt={profile.name} className="profile-picture" />
          )}
          <div className="profile-info">
            <h1>{profile.name}</h1>
            <p className="profile-email">{profile.email}</p>
            <p className="profile-bio">{profile.bio || 'No bio yet'}</p>
          </div>
        </div>
      )}

      <div className="profile-blogs">
        <h2>Published Blogs ({pagination.total})</h2>
        {blogs.length > 0 ? (
          <>
            <div className="blogs-grid">
              {blogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </div>
            <Pagination
              currentPage={pagination.currentPage}
              total={pagination.total}
              limit={pagination.limit}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <p className="no-blogs">No blogs published yet</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
