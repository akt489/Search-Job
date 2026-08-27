import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaLinkedin,
  FaInstagram,
  FaFacebook,
  FaXTwitter,
  FaYoutube,
  FaGithub,
  FaEnvelope,
  FaPhone,
  FaLocationDot,
  FaPaperPlane,
  FaCircleCheck,
} from 'react-icons/fa6';

function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [emailError, setEmailError] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setEmailError('Please enter your email.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    setEmailError('');
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 5000);
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-grid">
          {/* Brand Section */}
          <div className="footer-brand">
            <h3>
              <span className="brand-icon" role="img" aria-label="Briefcase">💼</span>
              SearchJob
            </h3>
            <p>
              Empowering professionals with smart hiring tools, trusted employers, and a streamlined application experience.
            </p>
            <div className="footer-contact-info">
              <a href="mailto:support@searchjob.com">
                <FaEnvelope aria-hidden="true" /> support@searchjob.com
              </a>
              <span><FaPhone aria-hidden="true" /> +251 90 000 0000</span>
              <span><FaLocationDot aria-hidden="true" /> Addis Ababa, Ethiopia</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-column">
            <h4>Quick Links</h4>
            <ul className="footer-links-list">
              <li><Link to="/jobs">Browse Jobs</Link></li>
              <li><Link to="/companies">Companies</Link></li>
              <li><Link to="/register">Register</Link></li>
              <li><Link to="/saved">Saved Jobs</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="footer-column">
            <h4>Resources</h4>
            <ul className="footer-links-list">
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/history">Application History</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Contact & Social + Newsletter */}
          <div className="footer-column footer-social-column">
            <h4>Connect With Us</h4>
            <div className="footer-social-links">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link linkedin"
                aria-label="LinkedIn"
              >
                <FaLinkedin />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link instagram"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link twitter"
                aria-label="Twitter"
              >
                <FaXTwitter />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link facebook"
                aria-label="Facebook"
              >
                <FaFacebook />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link youtube"
                aria-label="YouTube"
              >
                <FaYoutube />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link github"
                aria-label="GitHub"
              >
                <FaGithub />
              </a>
            </div>

            <div className="footer-newsletter">
              <h4>Newsletter</h4>
              <p>Get the latest job alerts and career tips.</p>
              <form onSubmit={handleSubscribe} className="newsletter-form" noValidate>
                <div className="newsletter-input-group">
                  <label htmlFor="newsletter-email" className="sr-only">Email address</label>
                  <input
                    id="newsletter-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmailError('');
                      setEmail(e.target.value);
                    }}
                    placeholder="Your email address"
                    className={emailError ? 'input-error' : ''}
                    aria-invalid={emailError ? 'true' : 'false'}
                  />
                  <button type="submit" className="subscribe-btn" aria-label="Subscribe to newsletter">
                    <FaPaperPlane />
                  </button>
                </div>
                {emailError && <span className="field-error" role="alert">{emailError}</span>}
                {subscribed && (
                  <span className="form-status-message" role="status">
                    <FaCircleCheck style={{ marginRight: '6px' }} /> Subscribed successfully!
                  </span>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <p className="footer-copyright">
            &copy; {currentYear} <strong>SearchJob</strong>. All rights reserved.
          </p>
          <p className="footer-tagline">
            Designed for modern career growth and reliable employer connections.
          </p>
          <div className="footer-bottom-links">
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;