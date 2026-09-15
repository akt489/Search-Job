import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaGithub, FaInstagram, FaLinkedin, FaPaperPlane, FaPhone, FaYoutube, FaXTwitter, FaLocationDot } from 'react-icons/fa6';

function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [emailError, setEmailError] = useState('');
  const currentYear = new Date().getFullYear();

  const handleSubscribe = (event) => {
    event.preventDefault();
    const value = email.trim();
    if (!value) {
      setEmailError('Enter your email address.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setEmailError('Enter a valid email address.');
      return;
    }
    setEmailError('');
    setSubscribed(true);
    setEmail('');
    window.setTimeout(() => setSubscribed(false), 5000);
  };

  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-brand-link"><span className="footer-brand-mark"><img src="/favicon.png" alt="" /></span>SearchJob</Link>
            <p>Professional tools for finding roles, comparing opportunities, and moving your career forward.</p>
            <div className="footer-contact-info">
              <a href="mailto:support@searchjob.com"><FaEnvelope aria-hidden="true" /> support@searchjob.com</a>
              <span><FaPhone aria-hidden="true" /> +251 90 000 0000</span>
              <span><FaLocationDot aria-hidden="true" /> Addis Ababa, Ethiopia</span>
            </div>
          </div>
          <div className="footer-column"><h2>Explore</h2><ul className="footer-links-list"><li><Link to="/jobs">Browse jobs</Link></li><li><Link to="/companies">Companies</Link></li><li><Link to="/register">Create an account</Link></li><li><Link to="/saved">Saved jobs</Link></li></ul></div>
          <div className="footer-column"><h2>Your workspace</h2><ul className="footer-links-list"><li><Link to="/dashboard">Dashboard</Link></li><li><Link to="/history">Application history</Link></li><li><Link to="/profile">Profile</Link></li><li><Link to="/recommendations">AI matches</Link></li></ul></div>
          <div className="footer-column footer-social-column">
            <h2>Stay in the loop</h2>
            <p className="footer-newsletter-copy">Get practical job-search notes and new role alerts.</p>
            <form onSubmit={handleSubscribe} className="newsletter-form" noValidate>
              <div className="newsletter-input-group"><label htmlFor="newsletter-email" className="sr-only">Email address</label><input id="newsletter-email" type="email" value={email} onChange={(event) => { setEmailError(''); setEmail(event.target.value); }} placeholder="you@example.com" aria-invalid={emailError ? 'true' : 'false'} /><button type="submit" className="subscribe-btn" aria-label="Subscribe to newsletter"><FaPaperPlane aria-hidden="true" /></button></div>
              {emailError && <span className="field-error" role="alert">{emailError}</span>}
              {subscribed && <span className="form-status-message" role="status">You are subscribed.</span>}
            </form>
            <div className="footer-social-links" aria-label="Social links">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LinkedIn"><FaLinkedin /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram"><FaInstagram /></a>
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="X"><FaXTwitter /></a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="YouTube"><FaYoutube /></a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="GitHub"><FaGithub /></a>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom"><div className="footer-bottom-inner"><p>© {currentYear} <strong>SearchJob</strong>. All rights reserved.</p><p>Built for focused career moves.</p><a href="mailto:support@searchjob.com">Contact support</a></div></div>
    </footer>
  );
}

export default Footer;
