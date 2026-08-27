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
import ForgotPassword from './pages/ForgotPassword';
import AuthCallback from './pages/AuthCallback';

import './App.css';

const API_BASE = import.meta.env.VITE_API_URL || '';

function App() {
  const navigate = useNavigate();

  // --- User State ---
  const [user, setUser] = useState(() => {
    const storedUser = window.localStorage.getItem('jobscout-user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState(() =>
    window.localStorage.getItem('jobscout-token') || null
  );

  // --- Data State ---
  const [savedJobs, setSavedJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // --- Theme State ---
  const [theme, setTheme] = useState(() => {
    const stored = window.localStorage.getItem('jobscout-theme');
    return stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });

  // --- Fetch Data When User Logs In ---
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user || !token) {
        setLoadingData(false);
        return;
      }

      setLoadingData(true);

      try {
        // Fetch saved jobs
        const savedResponse = await fetch(`${API_BASE}/users/saved-jobs`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (savedResponse.ok) {
          const savedData = await savedResponse.json();
          setSavedJobs(savedData.map(job => job.id));
        } else if (savedResponse.status === 401) {
          // Token expired
          handleLogout();
          return;
        }

        // Fetch application history
        const historyResponse = await fetch(`${API_BASE}/jobs/history`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (historyResponse.ok) {
          const historyData = await historyResponse.json();
          setApplications(historyData);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchUserData();
  }, [user, token]);

  // --- Theme effect ---
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    window.localStorage.setItem('jobscout-theme', theme);
  }, [theme]);

  // --- Toggle Save Job ---
  const toggleSaveJob = async (jobId) => {
    if (!user || !token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/users/saved-jobs/toggle`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobId }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          handleLogout();
          return;
        }
        throw new Error('Failed to toggle saved job');
      }

      const data = await response.json();

      if (data.saved) {
        setSavedJobs(prev => [...prev, jobId]);
      } else {
        setSavedJobs(prev => prev.filter(id => id !== jobId));
      }
    } catch (error) {
      console.error('Toggle save error:', error);
    }
  };

  // --- Handle Login ---
  const handleLogin = (profile, authToken) => {
    setUser(profile);
    setToken(authToken);
    window.localStorage.setItem('jobscout-user', JSON.stringify(profile));
    window.localStorage.setItem('jobscout-token', authToken);
    navigate('/dashboard');
  };

  // --- Handle Register ---
  const handleRegister = (profile, authToken) => {
    setUser(profile);
    setToken(authToken);
    window.localStorage.setItem('jobscout-user', JSON.stringify(profile));
    window.localStorage.setItem('jobscout-token', authToken);
    navigate('/dashboard');
  };

  // --- Handle Logout ---
  const handleLogout = () => {
    setUser(null);
    setToken(null);
    setSavedJobs([]);
    setApplications([]);
    window.localStorage.removeItem('jobscout-user');
    window.localStorage.removeItem('jobscout-token');
    navigate('/');
  };

  // --- Handle Application Submit ---
  const handleApplicationSubmit = (applicationData) => {
    setApplications(prev => [applicationData, ...prev]);
  };

  // --- Toggle Theme ---
  const toggleTheme = () => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="app-shell">
      <Navbar
        user={user}
        onLogout={handleLogout}
        savedCount={savedJobs.length}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main className="app-main">
        <Routes>
          <Route
            path="/"
            element={
              <Home
                savedJobs={savedJobs}
                onToggleSave={toggleSaveJob}
              />
            }
          />

          <Route
            path="/jobs"
            element={
              <Jobs
                savedJobs={savedJobs}
                onToggleSave={toggleSaveJob}
              />
            }
          />

          <Route
            path="/jobs/:jobId"
            element={
              <JobDetailsPage
                savedJobs={savedJobs}
                onToggleSave={toggleSaveJob}
              />
            }
          />

          <Route
            path="/login"
            element={<Login onLogin={handleLogin} />}
          />

          <Route
            path="/register"
            element={<Register onRegister={handleRegister} />}
          />

          <Route
            path="/auth/callback"
            element={<AuthCallback />}
          />

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
                <SavedJobs
                  savedJobs={savedJobs}
                  onToggleSave={toggleSaveJob}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/history"
            element={
              <ProtectedRoute user={user}>
                <ApplicationHistory />
              </ProtectedRoute>
            }
          />

          <Route
            path="/companies"
            element={<FindCompany />}
          />

          <Route
            path="/post-cv"
            element={
              <ProtectedRoute user={user}>
                <PostCV user={user} token={token} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />

          <Route
            path="/postcv"
            element={<Navigate to="/post-cv" replace />}
          />

          <Route
            path="/apply/:jobId"
            element={
              <ProtectedRoute user={user}>
                <ApplyJob
                  user={user}
                  onSubmit={handleApplicationSubmit}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;