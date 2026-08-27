import { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

function Navbar({ user, onLogout, savedCount, theme, onToggleTheme }) {
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  return (
    <header className="navbar">
      <div className={open ? 'navbar-inner open' : 'navbar-inner'}>
        <Link to="/" className="brand-link" onClick={closeMenu}>
          <span className="logo-mark">
            <img src="/favicon.png" alt="SearchJob logo" style={{ borderRadius: '50%' }} />
          </span>
          SearchJob
        </Link>

        <div className="nav-layout">
          <nav
            id="primary-navigation"
            className={open ? 'nav-links active' : 'nav-links'}
            aria-label="Primary navigation"
          >
            <Link to="/" onClick={closeMenu}>Home</Link>
            <Link to="/jobs" onClick={closeMenu}>Jobs</Link>
            <Link to="/companies" onClick={closeMenu}>Companies</Link>
            <Link to="/saved" onClick={closeMenu}>Saved</Link>
            <Link to="/dashboard" onClick={closeMenu}>Dashboard</Link>
          </nav>

          <div className="nav-actions">
            <button
              type="button"
              className="button button-tertiary theme-toggle"
              onClick={onToggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              <img
                src={theme === 'dark' ? '/light_mode.png' : '/dark_mode.png'}
                alt={theme === 'dark' ? 'Light mode' : 'Dark mode'}
                style={{ width: '20px', height: '20px' }}
              />
            </button>

            {!user ? (
              <>
                <Link to="/login" className="button button-secondary" onClick={closeMenu}>
                  Login
                </Link>
                <Link to="/register" className="button button-primary" onClick={closeMenu}>
                  Register
                </Link>
              </>
            ) : (
              <>
                <button
                  className="button button-secondary"
                  type="button"
                  onClick={() => {
                    closeMenu();
                    onLogout();
                  }}
                >
                  Sign out
                </button>
                <span className="saved-pill" aria-label={`${savedCount} saved jobs`}>
                  Saved {savedCount}
                </span>
              </>
            )}
          </div>
        </div>

        <button
          type="button"
          className="menu-toggle"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          aria-controls="primary-navigation"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}

Navbar.propTypes = {
  user: PropTypes.object,
  onLogout: PropTypes.func.isRequired,
  savedCount: PropTypes.number.isRequired,
  theme: PropTypes.string,
  onToggleTheme: PropTypes.func.isRequired,
};

Navbar.defaultProps = {
  user: null,
  theme: 'light',
};

export default Navbar;
