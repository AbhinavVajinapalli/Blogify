import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { setSelectedBlog, setLoading, setError, deleteBlog } from '../features/blogs/blogsSlice';
import { blogService } from '../services/blogService';
import '../styles/pages/BlogDetailsPage.scss';

const BlogDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedBlog, loading, error } = useSelector((state) => state.blogs);
  const { user } = useSelector((state) => state.auth);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isCommentLoading, setIsCommentLoading] = useState(false);

  const isAuthor = user?.id === selectedBlog?.author?._id;

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      dispatch(setLoading(true));
      const data = await blogService.getBlog(id);
      dispatch(setSelectedBlog(data));
      await fetchComments();
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const fetchComments = async () => {
    try {
      const data = await blogService.getComments(id, { page: 1, limit: 50 });
      setComments(data.comments);
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setIsCommentLoading(true);
      await blogService.addComment(id, newComment);
      setNewComment('');
      await fetchComments();
    } catch (err) {
      console.error('Error adding comment:', err);
    } finally {
      setIsCommentLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await blogService.deleteBlog(id);
        dispatch(deleteBlog(id));
        navigate('/');
      } catch (err) {
        dispatch(setError(err.message));
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading blog...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!selectedBlog) {
    return <div className="error">Blog not found</div>;
  }

  return (
    <div className="blog-details-page">
      <div className="container">
        {selectedBlog.imageUrl && (
          <img src={selectedBlog.imageUrl} alt={selectedBlog.title} className="blog-hero" />
        )}

        <article className="blog-article">
          <h1>{selectedBlog.title}</h1>

          <div className="blog-meta">
            <Link to={`/profile/${selectedBlog.author._id}`} className="author-info">
              <span className="author-name">{selectedBlog.author.name}</span>
              <span className="date">{new Date(selectedBlog.createdAt).toLocaleDateString()}</span>
            </Link>

            {isAuthor && (
              <div className="blog-actions">
                <Link to={`/blogs/${id}/edit`} className="btn btn-secondary">
                  Edit
                </Link>
                <button onClick={handleDelete} className="btn btn-danger">
                  Delete
                </button>
              </div>
            )}
          </div>

          <div className="blog-tags">
            {selectedBlog.tags?.map((tag) => (
              <span key={tag} className="tag">
                #{tag}
              </span>
            ))}
          </div>

          <div className="blog-text">{selectedBlog.content}</div>

          <div className="blog-stats">
            <span>❤️ {selectedBlog.likes?.length || 0} Likes</span>
            <span>💬 {comments.length} Comments</span>
            <span>👁️ {selectedBlog.viewCount || 0} Views</span>
          </div>
        </article>

        <section className="comments-section">
          <h2>Comments</h2>

          {user && (
            <form onSubmit={handleAddComment} className="comment-form">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                rows="4"
              />
              <button type="submit" className="btn btn-primary" disabled={isCommentLoading}>
                {isCommentLoading ? 'Posting...' : 'Post Comment'}
              </button>
            </form>
          )}

          <div className="comments-list">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment._id} className="comment">
                  <div className="comment-author">{comment.author.name}</div>
                  <div className="comment-text">{comment.content}</div>
                  <div className="comment-date">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))
            ) : (
              <p className="no-comments">No comments yet. Be the first to comment!</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default BlogDetailsPage;
