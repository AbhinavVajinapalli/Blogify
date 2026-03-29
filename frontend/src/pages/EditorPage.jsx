import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { addBlog, updateBlog, setOperationStatus, setError } from '../features/blogs/blogsSlice';
import { blogService } from '../services/blogService';
import BlogForm from '../components/blog/BlogForm';
import '../styles/pages/EditorPage.scss';

const EditorPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // eslint-disable-next-line no-unused-vars
  const { selectedBlog, operationStatus, error } = useSelector((state) => state.blogs);
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(Boolean(id));
  const isDashboardRoute = location.pathname.startsWith('/dashboard');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (id) {
      fetchBlog();
    }
  }, [id]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const data = await blogService.getBlog(id);
      setInitialData(data);
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data) => {
    try {
      dispatch(setOperationStatus(id ? 'updating' : 'creating'));

      if (id) {
        const updated = await blogService.updateBlog(id, data);
        dispatch(updateBlog(updated));
      } else {
        const created = await blogService.createBlog(data);
        dispatch(addBlog(created));
      }

      navigate(isDashboardRoute ? '/dashboard/posts' : '/');
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setOperationStatus(null));
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="editor-page">
      <div className="container">
        <h1>{id ? 'Edit Blog' : 'Write a New Blog'}</h1>

        {error && <div className="error">{error}</div>}

        <BlogForm
          initialData={initialData}
          onSubmit={handleSubmit}
          isLoading={operationStatus === 'creating' || operationStatus === 'updating'}
        />
      </div>
    </div>
  );
};

export default EditorPage;
