import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Bookmark,
  Building2,
  BriefcaseBusiness,
  ChevronDown,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Sparkles,
  Sun,
  UserRound,
  X,
} from 'lucide-react';

function Navbar({ user, onLogout, savedCount, theme, onToggleTheme }) {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();

  const closeMenu = () => {
    setOpen(false);
    setProfileOpen(false);
  };

  const isActive = (path) => path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);
  const initials = user?.fullName?.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'U';

  const links = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/jobs', label: 'Jobs', icon: BriefcaseBusiness },
    { to: '/companies', label: 'Companies', icon: Building2 },
    ...(user ? [{ to: '/recommendations', label: 'Matches', icon: Sparkles }, { to: '/saved', label: 'Saved', icon: Bookmark, count: savedCount }] : []),
  ];

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand-link" onClick={closeMenu} aria-label="SearchJob home">
          <span className="logo-mark"><img src="/favicon.png" alt="" /></span>
          <span className="brand-text">
            <span className="brand-name">SearchJob</span>
            <span className="brand-tagline">Find your next opportunity</span>
          </span>
        </Link>

        <nav className={open ? 'nav-links is-open' : 'nav-links'} aria-label="Primary navigation">
          {links.map(({ to, label, icon: Icon, count }) => {
            const active = isActive(to);
            return (
              <Link key={to} to={to} className={active ? 'nav-link is-active' : 'nav-link'} onClick={closeMenu} aria-current={active ? 'page' : undefined}>
                <Icon size={16} aria-hidden="true" />
                <span>{label}</span>
                {count > 0 && <span className="nav-count">{count > 99 ? '99+' : count}</span>}
              </Link>
            );
          })}
          <div className="mobile-menu-footer">
            {user ? (
              <>
                <Link to="/dashboard" className="mobile-menu-link" onClick={closeMenu}><LayoutDashboard size={16} /> Dashboard</Link>
                <Link to="/profile" className="mobile-menu-link" onClick={closeMenu}><UserRound size={16} /> Profile</Link>
                <button type="button" className="mobile-menu-link mobile-menu-signout" onClick={() => { closeMenu(); onLogout(); }}><LogOut size={16} /> Sign out</button>
              </>
            ) : (
              <>
                <Link to="/login" className="mobile-menu-link" onClick={closeMenu}>Sign in</Link>
                <Link to="/register" className="button button-primary mobile-menu-cta" onClick={closeMenu}>Get started</Link>
              </>
            )}
          </div>
        </nav>

        <div className="nav-actions">
          <button type="button" className="theme-toggle-modern" onClick={onToggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>
            {theme === 'dark' ? <Sun size={17} aria-hidden="true" /> : <Moon size={17} aria-hidden="true" />}
            <span className="theme-toggle-label">{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>

          {!user ? (
            <div className="auth-actions">
              <Link to="/login" className="login-link" onClick={closeMenu}>Sign in</Link>
              <Link to="/register" className="register-btn" onClick={closeMenu}>Get started</Link>
            </div>
          ) : (
            <div className="user-menu-wrapper">
              <button type="button" className="user-menu-trigger" onClick={() => setProfileOpen((current) => !current)} aria-expanded={profileOpen} aria-haspopup="menu">
                <span className="navbar-avatar">{user?.avatar ? <img src={user.avatar} alt="" /> : initials}</span>
                <span className="navbar-user-info"><span className="navbar-user-name">{user?.fullName || 'My account'}</span><span className="navbar-user-role">Job seeker</span></span>
                <ChevronDown size={15} className={profileOpen ? 'dropdown-chevron is-open' : 'dropdown-chevron'} aria-hidden="true" />
              </button>
              {profileOpen && (
                <div className="user-dropdown" role="menu">
                  <div className="dropdown-user-header"><span className="dropdown-avatar">{initials}</span><div><strong>{user?.fullName || 'My account'}</strong><span>{user?.email}</span></div></div>
                  <div className="dropdown-divider" />
                  <Link to="/profile" className="dropdown-item" onClick={closeMenu} role="menuitem"><UserRound size={16} /> My profile</Link>
                  <Link to="/dashboard" className="dropdown-item" onClick={closeMenu} role="menuitem"><LayoutDashboard size={16} /> Dashboard</Link>
                  <Link to="/saved" className="dropdown-item" onClick={closeMenu} role="menuitem"><Bookmark size={16} /> Saved jobs{savedCount > 0 && <span className="dropdown-count">{savedCount}</span>}</Link>
                  <div className="dropdown-divider" />
                  <button type="button" className="dropdown-item logout-item" onClick={() => { closeMenu(); onLogout(); }} role="menuitem"><LogOut size={16} /> Sign out</button>
                </div>
              )}
            </div>
          )}

          <button type="button" className="mobile-menu-btn" onClick={() => setOpen((current) => !current)} aria-expanded={open} aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}>
            {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
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

Navbar.defaultProps = { user: null, theme: 'light' };

export default Navbar;
