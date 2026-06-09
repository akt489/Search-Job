import { Link } from 'react-router-dom';

function DashboardSidebar() {
    return (
        <aside className="dashboard-sidebar">
            <h3>Dashboard</h3>
            <nav className="dashboard-nav">
                <Link to="/dashboard">Overview</Link>
                <Link to="/saved">Saved Jobs</Link>
                <Link to="/history">Application History</Link>
                <Link to="/dashboard">Account Settings</Link>
            </nav>
        </aside>
    );
}

export default DashboardSidebar;
