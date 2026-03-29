import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authService } from '../services/authService';
import { setCurrentUser } from '../features/auth/authSlice';
import '../styles/pages/DashboardSettingsPage.scss';

const DashboardSettingsPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    profilePicture: user?.profilePicture || '',
    siteName: user?.siteName || '',
    siteSlug: user?.siteSlug || '',
  });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData({
      name: user?.name || '',
      bio: user?.bio || '',
      profilePicture: user?.profilePicture || '',
      siteName: user?.siteName || '',
      siteSlug: user?.siteSlug || '',
    });
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'siteSlug') {
      const normalized = value
        .toLowerCase()
        .replaceAll(/[^a-z0-9-]/g, '')
        .replaceAll(/\s+/g, '-')
        .replaceAll(/-+/g, '-');
      setFormData((prev) => ({ ...prev, siteSlug: normalized }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');

    try {
      const updated = await authService.updateProfile(formData);
      dispatch(setCurrentUser(updated));
      setStatus('Profile updated successfully');
    } catch (err) {
      setStatus(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-settings-page">
      <h2>Settings</h2>
      {status && <div className="info-banner">{status}</div>}

      <form onSubmit={handleSubmit} className="settings-form">
        <label htmlFor="name">Name</label>
        <input id="name" name="name" value={formData.name} onChange={handleChange} required />

        <label htmlFor="bio">Bio</label>
        <textarea id="bio" name="bio" rows="4" value={formData.bio} onChange={handleChange} />

        <label htmlFor="profilePicture">Profile Picture URL</label>
        <input
          id="profilePicture"
          name="profilePicture"
          value={formData.profilePicture}
          onChange={handleChange}
          placeholder="https://..."
        />

        <label htmlFor="siteName">Public Site Name</label>
        <input
          id="siteName"
          name="siteName"
          value={formData.siteName}
          onChange={handleChange}
          placeholder="My Tech Journal"
        />

        <label htmlFor="siteSlug">Public Site URL Slug</label>
        <input
          id="siteSlug"
          name="siteSlug"
          value={formData.siteSlug}
          onChange={handleChange}
          placeholder="my-tech-journal"
        />
        <small>Public URL: /site/{formData.siteSlug || 'your-slug'}</small>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
};

export default DashboardSettingsPage;
