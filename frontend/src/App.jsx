import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import AppLayout from './components/layout/AppLayout';
import DashboardLayout from './components/layout/DashboardLayout';
import PublicSiteLayout from './components/layout/PublicSiteLayout';
import ProtectedRoute from './components/common/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import FeedPage from './pages/FeedPage';
import BlogDetailsPage from './pages/BlogDetailsPage';
import EditorPage from './pages/EditorPage';
import ProfilePage from './pages/ProfilePage';
import DashboardCreatePage from './pages/DashboardCreatePage';
import DashboardPostsPage from './pages/DashboardPostsPage';
import DashboardSettingsPage from './pages/DashboardSettingsPage';
import { authService } from './services/authService';
import { logout, setCurrentUser } from './features/auth/authSlice';

function App() {
  const dispatch = useDispatch();
  // eslint-disable-next-line no-unused-vars
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    const hydrateCurrentUser = async () => {
      if (!localStorage.getItem('authToken')) {
        return;
      }

      try {
        const user = await authService.getCurrentUser();
        dispatch(setCurrentUser(user));
      } catch (error) {
        dispatch(logout());
      }
    };

    hydrateCurrentUser();
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<FeedPage />} />
          <Route path="/blogs/:id" element={<BlogDetailsPage />} />
          <Route path="/profile/:userId" element={<ProfilePage />} />
        </Route>

        <Route element={<PublicSiteLayout />}>
          <Route path="/site/:siteSlug" element={<FeedPage mode="site" detailBasePath="/site" />} />
          <Route path="/site/:siteSlug/posts/:id" element={<BlogDetailsPage />} />
        </Route>

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="posts" replace />} />
          <Route path="create" element={<DashboardCreatePage />} />
          <Route path="new" element={<DashboardCreatePage />} />
          <Route path="posts" element={<DashboardPostsPage />} />
          <Route path="settings" element={<DashboardSettingsPage />} />
          <Route path="edit/:id" element={<EditorPage />} />
        </Route>

        <Route
          path="/blogs/new"
          element={
            <ProtectedRoute>
              <Navigate to="/dashboard/create" replace />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
