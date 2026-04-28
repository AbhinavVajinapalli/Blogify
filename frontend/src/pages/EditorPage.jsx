import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { addBlog, updateBlog, setOperationStatus, setError } from '../features/blogs/blogsSlice';
import { blogService } from '../services/blogService';
import BlogForm from '../components/blog/BlogForm';
import EditorSidebar from '../components/blog/EditorSidebar';
import '../styles/pages/EditorPage.scss';

const EditorPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { operationStatus, error } = useSelector((state) => state.blogs);
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(Boolean(id));

  const isDashboardRoute = location.pathname.startsWith('/dashboard');
  const isSaving = useMemo(
    () => operationStatus === 'creating' || operationStatus === 'updating',
    [operationStatus],
  );

  const fetchBlog = useCallback(async () => {
    try {
      setLoading(true);
      const data = await blogService.getBlog(id);
      setInitialData(data);
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      setLoading(false);
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (id) {
      fetchBlog();
    }
  }, [id, fetchBlog]);

  const persistBlog = async (data, navigateAfterSave = true) => {
    dispatch(setOperationStatus(id ? 'updating' : 'creating'));

    if (id) {
      const updated = await blogService.updateBlog(id, data);
      dispatch(updateBlog(updated));
    } else {
      const created = await blogService.createBlog(data);
      dispatch(addBlog(created));
    }

    if (navigateAfterSave) {
      navigate(isDashboardRoute ? '/dashboard/posts' : '/');
    }
  };

  const handleSubmit = async (data) => {
    try {
      await persistBlog(data, true);
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setOperationStatus(null));
    }
  };

  const handleSaveDraft = async (data) => {
    try {
      await persistBlog({ ...data, status: 'draft' }, false);
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setOperationStatus(null));
    }
  };

  const handlePreview = () => {
    window.alert('Preview mode is not connected yet, but the editor is ready for it.');
  };

  const handleRequestPublish = () => {
    document.getElementById('blog-editor-form')?.requestSubmit();
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="editor-page-container">
      <main className="editor-main-content">
        <header className="editor-header">
          <a href="/" className="editor-logo">← Back to Blog</a>
          <div>
            <p className="editor-kicker">Blogger-style editor</p>
            <h1>{id ? 'Edit Blog' : 'Write a New Blog'}</h1>
          </div>
        </header>

        <div className="editor-wrapper">
          {error && <div className="error-message">{error}</div>}

          <BlogForm
            initialData={initialData}
            onSubmit={handleSubmit}
            onSaveDraft={handleSaveDraft}
            isLoading={isSaving}
          />
        </div>
      </main>

      <EditorSidebar
        onPublish={handleRequestPublish}
        onSaveDraft={handleSaveDraft}
        onPreview={handlePreview}
        isSaving={isSaving}
      />
    </div>
  );
};

export default EditorPage;

