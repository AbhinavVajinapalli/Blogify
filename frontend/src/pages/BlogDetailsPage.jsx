import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import {
  setSelectedBlog,
  setLoading,
  setError,
  deleteBlog,
} from '../features/blogs/blogsSlice';
import { blogService } from '../services/blogService';
import '../styles/pages/BlogDetailsPage.scss';

/**
 * Format date to readable string
 * @param {string|Date} dateValue - Date to format
 * @returns {string} Formatted date or 'Unknown date'
 */
const formatDate = (dateValue) => {
  if (!dateValue) {
    return 'Unknown date';
  }
  try {
    return new Date(dateValue).toLocaleDateString();
  } catch {
    return 'Unknown date';
  }
};

const BlogDetailsPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedBlog, loading, error } = useSelector((state) => state.blogs);
  const { user } = useSelector((state) => state.auth);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isCommentLoading, setIsCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState('');

  const isPublicSiteRoute = location.pathname.startsWith('/site');

  // Derived state
  const blogAuthor = selectedBlog?.author;
  const isAuthor = user?.id === blogAuthor?._id;
  const likeCount = selectedBlog?.likes?.length || 0;
  const viewCount = selectedBlog?.viewCount || 0;
  const createdDate = formatDate(selectedBlog?.createdAt);

  /**
   * Fetch blog and comments
   */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchBlog = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(''));
      const data = await blogService.getBlog(id);
      dispatch(setSelectedBlog(data));
      await fetchComments(id);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to load blog';
      dispatch(setError(errorMsg));
    } finally {
      dispatch(setLoading(false));
    }
  }, [id, dispatch]);

  /**
   * Fetch comments for the blog
   */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchComments = useCallback(async (blogId) => {
    try {
      const data = await blogService.getComments(blogId, { page: 1, limit: 50 });
      setComments(data?.comments || []);
      setCommentError('');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to load comments';
      setCommentError(errorMsg);
      console.error('Error fetching comments:', err);
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchBlog();
    }
  }, [id, fetchBlog]);

  /**
   * Handle adding a new comment
   */
  const handleAddComment = useCallback(
    async (e) => {
      e.preventDefault();
      if (!newComment.trim()) {
        setCommentError('Comment cannot be empty');
        return;
      }

      try {
        setIsCommentLoading(true);
        setCommentError('');
        await blogService.addComment(id, newComment);
        setNewComment('');
        await fetchComments(id);
      } catch (err) {
        const errorMsg = err.response?.data?.message || 'Failed to post comment';
        setCommentError(errorMsg);
        console.error('Error adding comment:', err);
      } finally {
        setIsCommentLoading(false);
      }
    },
    [id, newComment, fetchComments]
  );

  /**
   * Handle deleting the blog post
   */
  const handleDelete = useCallback(async () => {
    const confirmed = globalThis.confirm(
      'Are you sure you want to delete this blog? This action cannot be undone.'
    );
    if (!confirmed) {
      return;
    }

    try {
      await blogService.deleteBlog(id);
      dispatch(deleteBlog(id));
      const redirectPath = isPublicSiteRoute ? '/site/posts' : '/';
      navigate(redirectPath);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to delete blog';
      dispatch(setError(errorMsg));
      console.error('Error deleting blog:', err);
    }
  }, [id, isPublicSiteRoute, navigate, dispatch]);

  // Loading state
  if (loading) {
    return (
      <div className="blog-details-page">
        <div className="container">
          <div className="loading">Loading blog...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="blog-details-page">
        <div className="container">
          <div className="error">{error}</div>
        </div>
      </div>
    );
  }

  // Not found state
  if (!selectedBlog?._id) {
    return (
      <div className="blog-details-page">
        <div className="container">
          <div className="error">Blog not found</div>
        </div>
      </div>
    );
  }

  /**
   * Render author information section
   */
  const renderAuthorInfo = () => {
    if (!blogAuthor?._id) {
      return (
        <div className="author-info">
          <span className="author-name">Unknown author</span>
          <span className="date">{createdDate}</span>
        </div>
      );
    }

    return (
      <Link to={`/profile/${blogAuthor._id}`} className="author-info">
        <span className="author-name">{blogAuthor.name || 'Unknown author'}</span>
        <span className="date">{createdDate}</span>
      </Link>
    );
  };

  /**
   * Render blog action buttons (edit/delete)
   */
  const renderBlogActions = () => {
    if (!isAuthor) {
      return null;
    }

    return (
      <div className="blog-actions">
        <Link to={`/dashboard/edit/${id}`} className="btn btn-secondary">
          Edit
        </Link>
        <button onClick={handleDelete} className="btn btn-danger" type="button">
          Delete
        </button>
      </div>
    );
  };

  /**
   * Render blog tags
   */
  const renderTags = () => {
    if (!selectedBlog.tags || selectedBlog.tags.length === 0) {
      return null;
    }

    return (
      <div className="blog-tags">
        {selectedBlog.tags.map((tag) => (
          <span key={tag} className="tag">
            #{tag}
          </span>
        ))}
      </div>
    );
  };

  /**
   * Render comment form
   */
  const renderCommentForm = () => {
    if (!user) {
      return (
        <p className="comment-signin">
          <Link to="/login">Sign in</Link> to comment
        </p>
      );
    }

    return (
      <form onSubmit={handleAddComment} className="comment-form">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Share your thoughts..."
          rows={4}
          disabled={isCommentLoading}
        />
        {commentError && <div className="error">{commentError}</div>}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isCommentLoading || !newComment.trim()}
        >
          {isCommentLoading ? 'Posting...' : 'Post Comment'}
        </button>
      </form>
    );
  };

  /**
   * Render comments list
   */
  const renderComments = () => {
    if (comments.length === 0) {
      return <p className="no-comments">No comments yet. Be the first to comment!</p>;
    }

    return (
      <div className="comments-list">
        {comments.map((comment) => (
          <div key={comment._id} className="comment">
            <div className="comment-author">{comment.author?.name || 'Anonymous'}</div>
            <div className="comment-text">{comment.content}</div>
            <div className="comment-date">{formatDate(comment.createdAt)}</div>
          </div>
        ))}
      </div>
    );
  };

  // Main render
  return (
    <div className="blog-details-page">
      <div className="container">
        {/* Blog hero image */}
        {selectedBlog.imageUrl && (
          <img
            src={selectedBlog.imageUrl}
            alt={selectedBlog.title}
            className="blog-hero"
          />
        )}

        {/* Article section */}
        <article className="blog-article">
          <h1>{selectedBlog.title}</h1>

          {/* Meta information (author, date, actions) */}
          <div className="blog-meta">
            {renderAuthorInfo()}
            {renderBlogActions()}
          </div>

          {/* Tags */}
          {renderTags()}

          {/* Article content */}
          <div className="blog-text">{selectedBlog.content}</div>

          {/* Stats (likes, comments, views) */}
          <div className="blog-stats">
            <span>❤️ {likeCount} Likes</span>
            <span>💬 {comments.length} Comments</span>
            <span>👁️ {viewCount} Views</span>
          </div>
        </article>

        {/* Comments section */}
        <section className="comments-section">
          <h2>Comments</h2>

          {renderCommentForm()}

          {renderComments()}
        </section>
      </div>
    </div>
  );
};

export default BlogDetailsPage;
