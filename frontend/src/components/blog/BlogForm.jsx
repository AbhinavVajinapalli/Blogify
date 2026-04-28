import { useState } from 'react';
import PropTypes from 'prop-types';
import '../../styles/BlogForm.scss';
import RichEditor from './RichEditor';

const BlogForm = ({ initialData = {}, onSubmit, isLoading = false, onSaveDraft }) => {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    content: initialData.content || '',
    tags: initialData.tags?.join(', ') || '',
    imageUrl: initialData.imageUrl || '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleContentChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      content: value,
    }));

    if (errors.content) {
      setErrors((prev) => ({
        ...prev,
        content: '',
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim() || formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }

    const plainContent = formData.content.replace(/<[^>]*>/g, '').trim();
    if (!plainContent || plainContent.length < 20) {
      newErrors.content = 'Content must be at least 20 characters';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const submitData = {
      ...formData,
      tags: formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    if (!submitData.imageUrl?.trim()) {
      delete submitData.imageUrl;
    }

    onSubmit(submitData);
  };

  return (
    <form id="blog-editor-form" className="blog-form enhanced-blog-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <h2 className="form-title">Create New Post</h2>
      </div>

      <div className="form-group">
        <label htmlFor="title" className="form-label">Post Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter an engaging title for your post..."
          className={errors.title ? 'error' : ''}
        />
        {errors.title && <span className="error-message">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="content" className="form-label">Post Content</label>
        <RichEditor value={formData.content} onChange={handleContentChange} />
        {errors.content && <span className="error-message">{errors.content}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="tags" className="form-label">Tags</label>
        <input
          type="text"
          id="tags"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="e.g., react, javascript, web (comma-separated)"
        />
      </div>

      <div className="form-group">
        <label htmlFor="imageUrl" className="form-label">Cover Image URL</label>
        <input
          type="url"
          id="imageUrl"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Publish'}
        </button>

        {onSaveDraft && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={(e) => {
              e.preventDefault();
              onSaveDraft(formData);
            }}
            disabled={isLoading}
          >
            Save Draft
          </button>
        )}
      </div>
    </form>
  );
};

BlogForm.propTypes = {
  initialData: PropTypes.shape({
    title: PropTypes.string,
    content: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    imageUrl: PropTypes.string,
  }),
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  onSaveDraft: PropTypes.func,
};

export default BlogForm;
