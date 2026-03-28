import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFeed, setPagination, setFilters, setLoading, setError } from '../features/blogs/blogsSlice';
import { blogService } from '../services/blogService';
import BlogCard from '../components/blog/BlogCard';
import SearchBar from '../components/blog/SearchBar';
import Pagination from '../components/common/Pagination';
import '../styles/pages/FeedPage.scss';

const FeedPage = () => {
  const dispatch = useDispatch();
  const { feed, pagination, filters, loading, error } = useSelector((state) => state.blogs);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchBlogs(currentPage);
  }, [filters]);

  const fetchBlogs = async (page = 1) => {
    try {
      dispatch(setLoading(true));
      const data = await blogService.getBlogs({
        page,
        limit: 10,
        search: filters.search,
        tag: filters.tags.join(','),
      });
      dispatch(setFeed(data));
      setCurrentPage(page);
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleSearch = (query) => {
    dispatch(setFilters({ search: query }));
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    fetchBlogs(page);
  };

  return (
    <div className="feed-page">
      <div className="container">
        <h1>Latest Blogs</h1>

        <SearchBar onSearch={handleSearch} />

        {error && <div className="error">{error}</div>}

        {loading ? (
          <div className="loading">Loading blogs...</div>
        ) : feed.length > 0 ? (
          <>
            <div className="blogs-grid">
              {feed.map((blog) => (
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
          <div className="no-blogs">No blogs found. Be the first to write one!</div>
        )}
      </div>
    </div>
  );
};

export default FeedPage;
