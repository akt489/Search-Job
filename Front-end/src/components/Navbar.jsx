import { useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar({ user, onLogout, savedCount, theme, onToggleTheme }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand-link">
          <span className="logo-mark">
            <img src="./public/favicon.png" alt="J" style={{ borderRadius: "50%" }} />
          </span>
          SearchJob
        </Link>

        <div className="nav-layout">
          <nav id="primary-navigation" className={open ? 'nav-links active' : 'nav-links'} aria-label="Primary navigation">
            <Link to="/">Home</Link>
            <Link to="/jobs">Jobs</Link>
            <Link to="/companies">Companies</Link>
            <Link to="/saved">Saved</Link>
            <Link to="/dashboard">Dashboard</Link>
          </nav>

          <div className="nav-actions">
            <button type="button" className="button button-tertiary theme-toggle" onClick={onToggleTheme} aria-label="Toggle dark mode">
              <img src={theme === 'dark' ? './public/light_mode.png' : './public/dark_mode.png'}
                alt={theme === 'dark' ? 'Light' : 'Dark'}
                style={{ width: "20px", height: "20px" }}
              />
            </button>
            {!user ? (
              <>
                <Link to="/login" className="button button-secondary">
                  Login
                </Link>
                <Link to="/register" className="button button-primary">
                  Register
                </Link>
              </>
            ) : (
              <>
                <button className="button button-secondary" type="button" onClick={onLogout}>
                  Sign out
                </button>
                <span className="saved-pill">Saved {savedCount}</span>
              </>
            )}
          </div>
        </div>

        <button
          className="menu-toggle"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
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

export default Navbar;
