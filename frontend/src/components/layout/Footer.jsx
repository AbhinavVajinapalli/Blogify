import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import '../../styles/Footer.scss';

const Footer = () => {
  const { isDarkTheme } = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand Section */}
          <div className="footer-section">
            <h3 className="footer-section-title">Blogify</h3>
            <p className="footer-description">
              Share your thoughts with the world. A modern blogging platform built for creators.
            </p>
            <div className="footer-socials">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                𝕏
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                GitHub
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                LinkedIn
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="footer-section">
            <h4 className="footer-section-heading">Navigation</h4>
            <ul className="footer-links">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/explore">Explore</Link>
              </li>
              <li>
                <Link to="/dashboard/posts">Dashboard</Link>
              </li>
              <li>
                <a href="#about">About Us</a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="footer-section">
            <h4 className="footer-section-heading">Support</h4>
            <ul className="footer-links">
              <li>
                <a href="#contact">Contact Us</a>
              </li>
              <li>
                <a href="#faq">FAQ</a>
              </li>
              <li>
                <a href="#help">Help Center</a>
              </li>
              <li>
                <a href="#feedback">Send Feedback</a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="footer-section">
            <h4 className="footer-section-heading">Legal</h4>
            <ul className="footer-links">
              <li>
                <a href="#privacy">Privacy Policy</a>
              </li>
              <li>
                <a href="#terms">Terms of Service</a>
              </li>
              <li>
                <a href="#cookies">Cookie Policy</a>
              </li>
              <li>
                <a href="#licenses">Licenses</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="footer-divider" />

        {/* Bottom Section */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            &copy; {currentYear} Blogify. All rights reserved. Made with <span className="heart">❤</span> for creators.
          </p>
          <p className="footer-theme-indicator">
            {isDarkTheme ? '🌙 Dark Mode' : '☀️ Light Mode'} • Built with React + Node.js + MongoDB
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
