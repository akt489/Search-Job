import { Link } from 'react-router-dom';
import { FaLinkedin, FaInstagram, FaFacebook, FaXTwitter } from 'react-icons/fa6';

function Footer() {
  return (
    <footer className="site-footer footer-classic">
      <div className="footer-grid footer-classic-grid">
        <div className="footer-brand">
          <h3>SearchJob</h3>
          <p>Empowering professionals with smart hiring tools, trusted employers, and a streamlined application experience.</p>
          <div className="footer-contact">
            <a href="mailto:hello@searchjob.com">hello@searchjob.com</a>
            <span>+1 (555) 010-2020</span>
          </div>
        </div>

        <div className="footer-column">
          <h4>FAQ</h4>
          <ul className="footer-links-list">
            <li><Link to="/jobs">How do I apply?</Link></li>
            <li><Link to="/saved">Can I save jobs?</Link></li>
            <li><Link to="/dashboard">How do I receive alerts?</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Employees</h4>
          <ul className="footer-links-list">
            <li><Link to="/jobs">Find Jobs</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/">Post CVs</Link></li>
            <li><Link to="/dashboard">Job Alerts</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Contact us</h4>
          <ul className="footer-links-list">
            <li>
              <a href="https://linkedin.com">
                <FaLinkedin /> LinkedIn
              </a>
            </li>
            <li>
              <a href="https://instagram.com">
                <FaInstagram /> Instagram
              </a>
            </li>
            <li>
              <a href="https://x.com">
                <FaXTwitter /> Twitter
              </a>
            </li>
            <li>
              <a href="https://facebook.com">
                <FaFacebook /> Facebook
              </a>
            </li>
          </ul>
        </div>


        <div className="footer-column">
          <h4>About</h4>
          <ul className="footer-links-list">
            <li><Link to="/terms">Terms of Service</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 SearchJob. All rights reserved.</p>
        <p>Designed for modern career growth and reliable employer connections.</p>
      </div>
    </footer>
  );
}

export default Footer;
