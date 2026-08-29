import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import {
  Menu,
  X,
  Sun,
  Moon,
  Home,
  BriefcaseBusiness,
  Building2,
  Bookmark,
  LayoutDashboard,
  User,
  Sparkles,
  LogOut,
  Heart,
  ChevronDown,
} from "lucide-react";

function Navbar({
  user,
  onLogout,
  savedCount,
  theme,
  onToggleTheme,
}) {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const location = useLocation();

  const closeMenu = () => {
    setOpen(false);
    setProfileOpen(false);
  };

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname.startsWith(path);
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">

        {/* =====================================================
            BRAND
        ===================================================== */}

        <Link
          to="/"
          className="brand-link"
          onClick={closeMenu}
        >
          <div className="logo-mark">
            <img
              src="/favicon.png"
              alt="SearchJob"
            />
          </div>

          <div className="brand-text">
            <span className="brand-name">
              SearchJob
            </span>

            <span className="brand-tagline">
              Find your next opportunity
            </span>
          </div>
        </Link>


        {/* =====================================================
            DESKTOP NAVIGATION
        ===================================================== */}

        <nav
          className={
            open
              ? "nav-links active"
              : "nav-links"
          }
          aria-label="Primary navigation"
        >

          <Link
            to="/"
            className={
              isActive("/")
                ? "nav-link active"
                : "nav-link"
            }
            onClick={closeMenu}
          >
            <Home size={17} />
            <span>Home</span>
          </Link>


          <Link
            to="/jobs"
            className={
              isActive("/jobs")
                ? "nav-link active"
                : "nav-link"
            }
            onClick={closeMenu}
          >
            <BriefcaseBusiness size={17} />
            <span>Jobs</span>
          </Link>


          <Link
            to="/companies"
            className={
              isActive("/companies")
                ? "nav-link active"
                : "nav-link"
            }
            onClick={closeMenu}
          >
            <Building2 size={17} />
            <span>Companies</span>
          </Link>


          {/* =====================================================
              LOGGED-IN NAVIGATION
          ===================================================== */}

          {user && (
            <>
              <Link
                to="/recommendations"
                className={
                  isActive("/recommendations")
                    ? "nav-link ai-nav-link active"
                    : "nav-link ai-nav-link"
                }
                onClick={closeMenu}
              >
                <Sparkles size={17} />

                <span>AI Matches</span>
              </Link>


              <Link
                to="/saved"
                className={
                  isActive("/saved")
                    ? "nav-link active"
                    : "nav-link"
                }
                onClick={closeMenu}
              >
                <Bookmark size={17} />

                <span>Saved</span>

                {savedCount > 0 && (
                  <span className="nav-count">
                    {savedCount > 99
                      ? "99+"
                      : savedCount}
                  </span>
                )}
              </Link>
            </>
          )}

        </nav>


        {/* =====================================================
            NAVBAR ACTIONS
        ===================================================== */}

        <div className="nav-actions">

          {/* THEME */}

          <button
            type="button"
            className="theme-toggle-modern"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === "dark"
                ? "light"
                : "dark"
              } mode`}
            title={`Switch to ${theme === "dark"
                ? "light"
                : "dark"
              } mode`}
          >
            {theme === "dark" ? (
              <Sun size={18} />
            ) : (
              <Moon size={18} />
            )}
          </button>


          {/* =====================================================
              NOT LOGGED IN
          ===================================================== */}

          {!user ? (
            <div className="auth-actions">

              <Link
                to="/login"
                className="login-link"
                onClick={closeMenu}
              >
                Sign in
              </Link>


              <Link
                to="/register"
                className="register-btn"
                onClick={closeMenu}
              >
                Get Started
              </Link>

            </div>
          ) : (

            /* =====================================================
                LOGGED IN
            ===================================================== */

            <div className="user-menu-wrapper">

              <button
                className="user-menu-trigger"
                onClick={() =>
                  setProfileOpen(!profileOpen)
                }
                aria-expanded={profileOpen}
              >

                <div className="navbar-avatar">

                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.fullName}
                    />
                  ) : (
                    <span>
                      {user?.fullName
                        ?.charAt(0)
                        ?.toUpperCase() || "U"}
                    </span>
                  )}

                </div>


                <div className="navbar-user-info">

                  <span className="navbar-user-name">
                    {user?.fullName ||
                      "My Account"}
                  </span>

                  <span className="navbar-user-role">
                    Job Seeker
                  </span>

                </div>


                <ChevronDown
                  size={16}
                  className={
                    profileOpen
                      ? "dropdown-chevron open"
                      : "dropdown-chevron"
                  }
                />

              </button>


              {/* =====================================================
                  USER DROPDOWN
              ===================================================== */}

              {profileOpen && (

                <div className="user-dropdown">

                  <div className="dropdown-user-header">

                    <div className="dropdown-avatar">

                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.fullName}
                        />
                      ) : (
                        <span>
                          {user?.fullName
                            ?.charAt(0)
                            ?.toUpperCase() || "U"}
                        </span>
                      )}

                    </div>


                    <div>

                      <strong>
                        {user?.fullName ||
                          "User"}
                      </strong>

                      <span>
                        {user?.email}
                      </span>

                    </div>

                  </div>


                  <div className="dropdown-divider" />


                  <Link
                    to="/profile"
                    className="dropdown-item"
                    onClick={closeMenu}
                  >
                    <User size={17} />
                    My Profile
                  </Link>


                  <Link
                    to="/dashboard"
                    className="dropdown-item"
                    onClick={closeMenu}
                  >
                    <LayoutDashboard size={17} />
                    Dashboard
                  </Link>


                  <Link
                    to="/saved"
                    className="dropdown-item"
                    onClick={closeMenu}
                  >
                    <Heart size={17} />

                    Saved Jobs

                    {savedCount > 0 && (
                      <span className="dropdown-count">
                        {savedCount}
                      </span>
                    )}

                  </Link>


                  <div className="dropdown-divider" />


                  <button
                    type="button"
                    className="dropdown-item logout-item"
                    onClick={() => {
                      closeMenu();
                      onLogout();
                    }}
                  >
                    <LogOut size={17} />
                    Sign out
                  </button>

                </div>

              )}

            </div>
          )}


          {/* =====================================================
              MOBILE MENU
          ===================================================== */}

          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() =>
              setOpen(!open)
            }
            aria-label="Toggle navigation"
            aria-expanded={open}
          >

            {open ? (
              <X size={22} />
            ) : (
              <Menu size={22} />
            )}

          </button>

        </div>

      </div>
    </header>
  );
}


Navbar.propTypes = {
  user: PropTypes.object,

  onLogout:
    PropTypes.func.isRequired,

  savedCount:
    PropTypes.number.isRequired,

  theme:
    PropTypes.string,

  onToggleTheme:
    PropTypes.func.isRequired,
};


Navbar.defaultProps = {
  user: null,
  theme: "light",
};


export default Navbar;