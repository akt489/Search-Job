import { Link, useLocation } from 'react-router-dom';

function DashboardSidebar() {
  const location = useLocation();

  const links = [
    { to: '/dashboard', label: 'Overview', icon: '📊' },
    { to: '/saved', label: 'Saved Jobs', icon: '⭐' },
    { to: '/history', label: 'Application History', icon: '📜' },
    { to: '/companies', label: 'Explore Companies', icon: '🏢' },
  ];

  return (
    <aside className="dashboard-sidebar" aria-label="Dashboard Sidebar Navigation">
      <h3>Dashboard Navigation</h3>
      <nav className="dashboard-nav">
        {links.map((link) => {
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={isActive ? 'active' : ''}
              aria-current={isActive ? 'page' : undefined}
            >
              <span>{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export default DashboardSidebar;
