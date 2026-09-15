import { Bookmark, BriefcaseBusiness, LayoutDashboard, ListChecks, MoreHorizontal, UserRound } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

function MobileBottomNav({ user, savedCount = 0 }) {
  const location = useLocation();

  if (!user) return null;

  const links = [
    { to: '/jobs', label: 'Jobs', icon: BriefcaseBusiness },
    { to: '/recommendations', label: 'Matches', icon: ListChecks },
    { to: '/saved', label: 'Saved', icon: Bookmark, count: savedCount },
    { to: '/profile', label: 'Profile', icon: UserRound },
    { to: '/dashboard', label: 'More', icon: MoreHorizontal },
  ];

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
      {links.map(({ to, label, icon: Icon, count }) => {
        const active = location.pathname === to || (to !== '/jobs' && location.pathname.startsWith(to));
        return (
          <Link key={to} to={to} className={active ? 'mobile-bottom-nav-link is-active' : 'mobile-bottom-nav-link'} aria-current={active ? 'page' : undefined}>
            <span className="mobile-bottom-nav-icon">
              <Icon size={17} aria-hidden="true" />
              {count > 0 && <span className="mobile-bottom-nav-count">{count > 99 ? '99+' : count}</span>}
            </span>
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

MobileBottomNav.propTypes = {
  user: PropTypes.object,
  savedCount: PropTypes.number,
};

export default MobileBottomNav;
