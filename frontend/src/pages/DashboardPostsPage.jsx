import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { blogService } from '../services/blogService';
import '../styles/pages/DashboardPostsPage.scss';

const DashboardPostsPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const data = await blogService.getUserBlogs(user.id, { page: 1, limit: 50 });
        setPosts(data.blogs || []);
      } catch (err) {
        setError(err.message || 'Failed to load your posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [user?.id]);

  const handleDeletePost = async (postId) => {
    const confirmed = globalThis.confirm('Delete this post permanently?');
    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(postId);
      setError('');
      await blogService.deleteBlog(postId);
      setPosts((prev) => prev.filter((post) => post._id !== postId));
    } catch (err) {
      setError(err.message || 'Failed to delete post');
    } finally {
      setDeletingId(null);
    }
  };

  const sitePostBase = user?.siteSlug ? `/site/${user.siteSlug}/posts` : null;

  if (loading) {
    return <div className="loading">Loading your posts...</div>;
  }

  return (
    <div className="dashboard-posts-page">
      <div className="page-head">
        <h2>Your Posts</h2>
        <Link to="/dashboard/create" className="btn btn-primary">
          + Create New
        </Link>
      </div>

      {error && <div className="error">{error}</div>}

      {posts.length === 0 ? (
        <div className="empty-state">
          <p>No posts yet.</p>
          <Link to="/dashboard/create" className="btn btn-primary">
            Create your first post
          </Link>
        </div>
      ) : (
        <div className="post-list">
          {posts.map((post) => (
            <article className="post-row" key={post._id}>
              <div>
                <h3>{post.title}</h3>
                <p>
                  Published {new Date(post.createdAt).toLocaleDateString()} • {post.tags?.join(', ')}
                </p>
              </div>
              <div className="actions">
                <Link
                  to={sitePostBase ? `${sitePostBase}/${post._id}` : '/dashboard/settings'}
                  className="btn btn-secondary"
                  target="_blank"
                  rel="noreferrer"
                >
                  View
                </Link>
                <Link to={`/dashboard/edit/${post._id}`} className="btn btn-primary">
                  Edit
                </Link>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => handleDeletePost(post._id)}
                  disabled={deletingId === post._id}
                >
                  {deletingId === post._id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPostsPage;
