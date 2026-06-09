import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Jobs from './pages/Jobs';
import JobDetailsPage from './pages/JobDetailsPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SavedJobs from './pages/SavedJobs';
import ApplicationHistory from './pages/ApplicationHistory';
import ApplyJob from './pages/ApplyJob';
import FindCompany from './pages/FindCompany';
import PostCV from './pages/PostCV';

import './App.css';

function App() {
  const navigate = useNavigate();

  const [savedJobs, setSavedJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [user, setUser] = useState(null);

  const [theme, setTheme] = useState(() => {
    const stored = window.localStorage.getItem('jobscout-theme');
    return stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    window.localStorage.setItem('jobscout-theme', theme);
  }, [theme]);

  const toggleSaveJob = (jobId) => {
    setSavedJobs((current) =>
      current.includes(jobId)
        ? current.filter((id) => id !== jobId)
        : [...current, jobId]
    );
  };

  const handleLogin = (profile) => setUser(profile);
  const handleRegister = (profile) => setUser(profile);

  const handleApplicationSubmit = (applicationData) => {
    setApplications((prev) => [...prev, applicationData]);
  };

  const toggleTheme = () => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="app-shell">
      <Navbar
        user={user}
        onLogout={() => {
          setUser(null);
          navigate('/');
        }}
        savedCount={savedJobs.length}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main className="app-main">
        <Routes>
          <Route
            path="/"
            element={<Home savedJobs={savedJobs} onToggleSave={toggleSaveJob} />}
          />

          <Route
            path="/jobs"
            element={<Jobs savedJobs={savedJobs} onToggleSave={toggleSaveJob} />}
          />

          <Route
            path="/jobs/:jobId"
            element={<JobDetailsPage savedJobs={savedJobs} onToggleSave={toggleSaveJob} />}
          />

          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register onRegister={handleRegister} />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute user={user}>
                <Dashboard
                  user={user}
                  savedCount={savedJobs.length}
                  applicationCount={applications.length}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/saved"
            element={
              <ProtectedRoute user={user}>
                <SavedJobs savedJobs={savedJobs} onToggleSave={toggleSaveJob} />
              </ProtectedRoute>
            }
          />

          <Route path="/companies" element={<FindCompany />} />

          <Route
            path="/history"
            element={
              <ProtectedRoute user={user}>
                <ApplicationHistory applications={applications} />
              </ProtectedRoute>
            }
          />

          <Route path="/applications" element={<Navigate to="/history" replace />} />

          <Route
            path="/post-cv"
            element={
              <ProtectedRoute user={user}>
                <PostCV user={user} />
              </ProtectedRoute>
            }
          />

          <Route path="/postcv" element={<Navigate to="/post-cv" replace />} />

          <Route
            path="/apply/:jobId"
            element={
              <ProtectedRoute user={user}>
                <ApplyJob user={user} onSubmit={handleApplicationSubmit} />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;