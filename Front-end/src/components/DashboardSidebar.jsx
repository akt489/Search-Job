import { Bookmark, Building2, ClipboardList, LayoutDashboard } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

function DashboardSidebar() {
  const location = useLocation();
  const links = [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/saved', label: 'Saved jobs', icon: Bookmark },
    { to: '/history', label: 'Application history', icon: ClipboardList },
    { to: '/companies', label: 'Explore companies', icon: Building2 },
  ];

  return <aside className="dashboard-sidebar" aria-label="Dashboard navigation"><div className="sidebar-kicker">Your workspace</div><h2>SearchJob desk</h2><nav className="dashboard-nav">{links.map(({ to, label, icon: Icon }) => { const active = location.pathname === to; return <Link key={to} to={to} className={active ? 'is-active' : ''} aria-current={active ? 'page' : undefined}><Icon size={16} aria-hidden="true" />{label}</Link>; })}</nav></aside>;
}

export default DashboardSidebar;
