import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updateBlog } from '../../features/blogs/blogsSlice';
import { blogService } from '../../services/blogService';
import '../../styles/BlogCard.scss';

const BlogCard = ({ blog, detailBasePath = '/blogs' }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const isLiked = blog.likes?.some((like) => like._id === user?.id);
  const detailsLink = `${detailBasePath}/${blog._id}`;

  const handleLike = async () => {
    try {
      const updatedBlog = await blogService.toggleLike(blog._id);
      dispatch(updateBlog(updatedBlog));
    } catch (error) {
      console.error('Error liking blog:', error);
    }
  };

  return (
    <div className="blog-card">
      {blog.imageUrl && <img src={blog.imageUrl} alt={blog.title} className="blog-image" />}
      
      <div className="blog-content">
        <Link to={detailsLink}>
          <h2 className="blog-title">{blog.title}</h2>
        </Link>
        
        <p className="blog-excerpt">{blog.content.substring(0, 150)}...</p>

        <div className="blog-meta">
          <span className="author-name">{blog.author?.name}</span>
          <span className="date">
            {new Date(blog.createdAt).toLocaleDateString()}
          </span>
        </div>

        <div className="blog-tags">
          {blog.tags?.map((tag) => (
            <span key={tag} className="tag">
              #{tag}
            </span>
          ))}
        </div>

        <div className="blog-actions">
          <button
            className={`like-btn ${isLiked ? 'liked' : ''}`}
            onClick={handleLike}
          >
            ❤️ {blog.likes?.length || 0}
          </button>
          <Link to={detailsLink} className="read-more">
            Read More →
          </Link>
        </div>
      </div>
    </div>
  );
};

BlogCard.propTypes = {
  blog: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    imageUrl: PropTypes.string,
    author: PropTypes.shape({
      name: PropTypes.string,
    }),
    createdAt: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string),
    likes: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string,
      })
    ),
  }).isRequired,
  detailBasePath: PropTypes.string,
};

export default BlogCard;
