import { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { GoogleLogin } from '@react-oauth/google';
import { setUser } from '../features/auth/authSlice';
import { authService } from '../services/authService';
import {
  generateStrongPassword,
  getPasswordRuleStatus,
  getPasswordStrength,
  isStrongPassword,
} from '../utils/passwordStrength';
import Logo from '../components/common/Logo';
import ThemeToggle from '../components/common/ThemeToggle';
import EffectsToggle from '../components/common/EffectsToggle';
import '../styles/pages/SignupPage.scss';

const EyeIcon = ({ visible }) => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {visible ? (
      <>
        <path
          d="M3 12C4.8 8.5 8.1 6 12 6C15.9 6 19.2 8.5 21 12C19.2 15.5 15.9 18 12 18C8.1 18 4.8 15.5 3 12Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
      </>
    ) : (
      <>
        <path
          d="M3 12C4.8 8.5 8.1 6 12 6C15.9 6 19.2 8.5 21 12C19.2 15.5 15.9 18 12 18C8.1 18 4.8 15.5 3 12Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M4 4L20 20"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    )}
  </svg>
);

EyeIcon.propTypes = {
  visible: PropTypes.bool.isRequired,
};

const SignupPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const brandTarget = isAuthenticated ? '/dashboard/posts' : '/';
  const passwordStatus = getPasswordRuleStatus(formData.password);
  const strength = getPasswordStrength(formData.password);
  const missingRules = passwordStatus.filter((rule) => !rule.passed).map((rule) => rule.label);
  const doesPasswordMatch =
    formData.confirmPassword.length > 0 && formData.password === formData.confirmPassword;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUseSuggestion = () => {
    const suggestedPassword = generateStrongPassword(14);
    setFormData((prev) => ({
      ...prev,
      password: suggestedPassword,
      confirmPassword: suggestedPassword,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isStrongPassword(formData.password)) {
      setError('Password is weak. Please satisfy all required constraints.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Password and confirm password do not match.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authService.signup(formData.name, formData.email, formData.password);
      dispatch(setUser(response));
      navigate('/dashboard/posts');
    } catch (err) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    const credential = credentialResponse?.credential;
    if (!credential) {
      setError('Google signup failed. Please try again.');
      return;
    }

    try {
      setGoogleLoading(true);
      setError('');
      const response = await authService.loginWithGoogle(credential);
      dispatch(setUser(response));
      navigate('/dashboard/posts');
    } catch (err) {
      setError(err.message || 'Google signup failed');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google signup failed. Please try again.');
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="auth-page-controls">
          <EffectsToggle className="auth-page-utility-toggle" />
          <ThemeToggle className="auth-page-utility-toggle" />
        </div>
        <Link to={brandTarget} className="auth-brand">
          <Logo text="Blogify" />
        </Link>
        <h1>Sign Up</h1>
        {error && <div className="error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrap">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <EyeIcon visible={showPassword} />
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="password-input-wrap">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              >
                <EyeIcon visible={showConfirmPassword} />
              </button>
            </div>
            {formData.confirmPassword && (
              <small className={doesPasswordMatch ? 'hint-success' : 'hint-error'}>
                {doesPasswordMatch ? 'Passwords match' : 'Passwords do not match'}
              </small>
            )}
          </div>

          <div className="password-strength">
            <div className="password-strength-head">
              <strong>Password strength: {strength.label}</strong>
              <button type="button" className="suggest-btn" onClick={handleUseSuggestion}>
                Suggest strong password
              </button>
            </div>
            <progress className="strength-bar" max="100" value={strength.percentage} />
            {missingRules.length > 0 ? (
              <ul className="password-rules">
                {missingRules.map((rule) => (
                  <li key={rule}>{rule}</li>
                ))}
              </ul>
            ) : (
              <p className="hint-success">All password constraints are satisfied.</p>
            )}
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>

        <p className="login-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>

        <div className="oauth-divider">
          <span>or</span>
        </div>

        <div className="google-auth-wrap" aria-busy={googleLoading}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            text="signup_with"
            shape="pill"
            width="100%"
          />
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
