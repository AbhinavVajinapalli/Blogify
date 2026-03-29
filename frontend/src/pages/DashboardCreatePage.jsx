import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import BlogForm from '../components/blog/BlogForm';
import { addBlog, setError, setOperationStatus } from '../features/blogs/blogsSlice';
import { blogService } from '../services/blogService';

const DashboardCreatePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setLocalError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleCreate = async (data) => {
    try {
      setIsSaving(true);
      setLocalError('');
      dispatch(setOperationStatus('creating'));

      const created = await blogService.createBlog(data);
      dispatch(addBlog(created));
      navigate('/dashboard/posts');
    } catch (err) {
      const message = err.message || 'Failed to create post';
      setLocalError(message);
      dispatch(setError(message));
    } finally {
      setIsSaving(false);
      dispatch(setOperationStatus(null));
    }
  };

  return (
    <div className="editor-page">
      <div className="container">
        <h1>Create New Post</h1>
        {error && <div className="error">{error}</div>}
        <BlogForm onSubmit={handleCreate} isLoading={isSaving} />
      </div>
    </div>
  );
};

export default DashboardCreatePage;
