import React from 'react';
import { Link } from 'react-router-dom';

export type HeaderProps = {
  title?: string;
};

const Header: React.FC<HeaderProps> = ({ title = 'SearchJob' }) => {
  return (
    <header className="header-container" aria-label="Site Header">
      <Link to="/" className="brand-link">
        <span className="logo-mark">💼</span>
        {title}
      </Link>
      <nav className="nav-links" aria-label="Header Navigation">
        <Link to="/jobs">Find jobs</Link>
        <Link to="/companies">Find companies</Link>
        <Link to="/login">Log in</Link>
        <Link to="/register">Sign up</Link>
      </nav>
    </header>
  );
};

export default Header;