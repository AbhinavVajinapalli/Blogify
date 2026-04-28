import { useState } from 'react';
import PropTypes from 'prop-types';
import '../../styles/EditorSidebar.scss';

const EditorSidebar = ({ onPublish, onSaveDraft, isSaving, onPreview }) => {
  const [showMenu, setShowMenu] = useState(true);

  return (
    <div className={`editor-sidebar ${showMenu ? 'open' : 'closed'}`}>
      <div className="sidebar-toggle">
        <button
          className="toggle-btn"
          onClick={() => setShowMenu(!showMenu)}
          title={showMenu ? 'Collapse' : 'Expand'}
        >
          {showMenu ? '✕' : '☰'}
        </button>
      </div>

      {showMenu && (
        <div className="sidebar-content">
          <div className="sidebar-section">
            <h3 className="sidebar-title">Publish</h3>
            <div className="button-group">
              <button
                type="button"
                className="btn btn-publish"
                onClick={onPublish}
                disabled={isSaving}
              >
                {isSaving ? 'Publishing...' : 'Publish'}
              </button>
            </div>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-title">Drafts</h3>
            <div className="button-group">
              <button
                type="button"
                className="btn btn-draft"
                onClick={onSaveDraft}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Draft'}
              </button>
            </div>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-title">Preview</h3>
            <div className="button-group">
              <button
                type="button"
                className="btn btn-preview"
                onClick={onPreview}
              >
                Preview Post
              </button>
            </div>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-title">Blog Settings</h3>
            <ul className="sidebar-menu">
              <li><a href="/dashboard/stats">Stats</a></li>
              <li><a href="/dashboard/comments">Comments</a></li>
              <li><a href="/dashboard/settings">Settings</a></li>
              <li><a href="/dashboard">Dashboard</a></li>
            </ul>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-title">Post Options</h3>
            <div className="post-options">
              <label className="checkbox-label">
                <input type="checkbox" />
                <span>Allow Comments</span>
              </label>
              <label className="checkbox-label">
                <input type="checkbox" />
                <span>Allow Sharing</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

EditorSidebar.propTypes = {
  onPublish: PropTypes.func.isRequired,
  onSaveDraft: PropTypes.func.isRequired,
  onPreview: PropTypes.func.isRequired,
  isSaving: PropTypes.bool,
};

EditorSidebar.defaultProps = {
  isSaving: false,
};

export default EditorSidebar;
