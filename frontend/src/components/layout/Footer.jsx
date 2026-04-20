import { Link } from 'react-router-dom';
import '../../styles/Footer.scss';

const Footer = () => {
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
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M12 0.5C5.65 0.5 0.5 5.65 0.5 12c0 5.1 3.3 9.43 7.88 10.96.58.1.79-.25.79-.56 0-.27-.01-1.01-.02-1.99-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.02 1.76 2.69 1.25 3.34.95.1-.74.4-1.25.72-1.54-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.48.11-3.09 0 0 .97-.31 3.18 1.18a10.97 10.97 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.61.23 2.8.11 3.09.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.4-5.27 5.68.41.36.78 1.08.78 2.18 0 1.57-.01 2.83-.01 3.22 0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
                </svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M4.98 3.5A2.48 2.48 0 1 0 5 8.46 2.48 2.48 0 0 0 4.98 3.5ZM3 9h4v12H3V9Zm7 0h3.84v1.64h.05c.53-1 1.83-2.06 3.77-2.06C21.22 8.58 22 10.76 22 14.02V21h-4v-6.16c0-1.47-.03-3.36-2.05-3.36-2.05 0-2.36 1.6-2.36 3.25V21h-4V9Z" />
                </svg>
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
          <p className="footer-copyright">&copy; {currentYear} Blogify. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
