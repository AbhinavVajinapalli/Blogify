import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { setFeed, setFilters, setLoading, setError } from '../features/blogs/blogsSlice';
import { blogService } from '../services/blogService';
import BlogCard from '../components/blog/BlogCard';
import SearchBar from '../components/blog/SearchBar';
import Pagination from '../components/common/Pagination';
import '../styles/pages/FeedPage.scss';

const FeedPage = ({ detailBasePath = '/blogs', mode = 'all' }) => {
  const { siteSlug } = useParams();
  const dispatch = useDispatch();
  const { feed, pagination, filters, loading, error } = useSelector((state) => state.blogs);
  const [currentPage, setCurrentPage] = useState(1);
  const [siteMeta, setSiteMeta] = useState(null);
  const resolvedDetailBasePath =
    mode === 'site' && siteSlug ? `/site/${siteSlug}/posts` : detailBasePath;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setCurrentPage(1);
    fetchBlogs(currentPage);
  }, [filters, mode, siteSlug]);

  const fetchBlogs = async (page = 1) => {
    try {
      dispatch(setLoading(true));
      let data;

      if (mode === 'site' && siteSlug) {
        data = await blogService.getSiteBlogs(siteSlug, {
          page,
          limit: 10,
        });
        setSiteMeta(data.site || null);
      } else {
        data = await blogService.getBlogs({
          page,
          limit: 10,
          search: filters.search,
          tag: filters.tags.join(','),
        });
        setSiteMeta(null);
      }

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
        <h1>{mode === 'site' ? siteMeta?.siteName || 'Public Site' : 'Latest Blogs'}</h1>

        {mode !== 'site' && <SearchBar onSearch={handleSearch} />}

        {error && <div className="error">{error}</div>}

        {loading ? (
          <div className="loading">Loading blogs...</div>
        ) : feed.length > 0 ? (
          <>
            <div className="blogs-grid">
              {feed.map((blog) => (
                <BlogCard key={blog._id} blog={blog} detailBasePath={resolvedDetailBasePath} />
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
