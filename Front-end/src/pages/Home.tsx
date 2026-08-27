import { FormEvent, useMemo, useState, ChangeEvent, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import JobList from '../components/JobList';

// --- Define the Job type ---
type Job = {
    id: number;
    title: string;
    company: string;
    location: string;
    category: string;
    type: string;
    salary: string;
    remote: boolean;
    description: string;
    posted_at: string;
};

// --- Vite environment variable type fix ---
const API_BASE = (import.meta as any).env.VITE_API_URL || '';

type HomeProps = {
    savedJobs: string[];
    onToggleSave: (jobId: string) => void;
};

function Home({ savedJobs, onToggleSave }: HomeProps) {
    const [searchText, setSearchText] = useState('');
    const [allJobs, setAllJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch all jobs from the API
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await fetch(`${API_BASE}/jobs`);
                if (!response.ok) throw new Error('Failed to load jobs');
                const data = await response.json();
                setAllJobs(Array.isArray(data) ? data : []);
            } catch (err) {
                setError('Unable to load jobs. Please try again later.');
                console.error('Jobs fetch error:', err);
                setAllJobs([]);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    const safeAllJobs = Array.isArray(allJobs) ? allJobs : [];

    // Filter jobs based on search text
    const searchResults = useMemo(
        () =>
            safeAllJobs.filter((job) =>
                [job.title, job.company, job.description].some((value) =>
                    value?.toLowerCase().includes(searchText.toLowerCase())
                )
            ),
        [safeAllJobs, searchText]
    );

    // Featured jobs: first 3
    const featuredJobs = safeAllJobs.slice(0, 3);

    // Recent jobs: next 5 (or all remaining)
    const recentJobs = safeAllJobs.slice(3, 8);

    if (loading) {
        return (
            <div className="page-content page-home">
                <section className="hero-section">
                    <div className="hero-copy">
                        <p className="eyebrow">Find your next career move</p>
                        <h1>Modern job search for ambitious professionals.</h1>
                        <p className="hero-text">Loading jobs...</p>
                    </div>
                </section>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-content page-home">
                <section className="hero-section">
                    <div className="hero-copy">
                        <p className="eyebrow">Find your next career move</p>
                        <h1>Modern job search for ambitious professionals.</h1>
                        <p className="hero-text" style={{ color: 'red' }}>{error}</p>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="page-content page-home">
            <section className="hero-section">
                <div className="hero-copy">
                    <p className="eyebrow">Find your next career move</p>
                    <h1>Modern job search for ambitious professionals.</h1>
                    <p className="hero-text">
                        Browse curated roles, save favorites, and apply with confidence through a clean, modern dashboard.
                    </p>
                    <SearchBar
                        value={searchText}
                        onChange={(event: ChangeEvent<HTMLInputElement>) => setSearchText(event.target.value)}
                        onSubmit={(event: FormEvent<HTMLFormElement>) => event.preventDefault()}
                        placeholder="Search by title, company, or keyword"
                    />
                    <div className="hero-links">
                        <Link to="/jobs" className="button button-primary">
                            Browse Jobs
                        </Link>
                        <Link to="/dashboard" className="button button-secondary">
                            Go to Dashboard
                        </Link>
                    </div>
                </div>
                <div className="hero-visual">
                    <div className="hero-card">
                        {featuredJobs.length > 0 ? (
                            <>
                                <h2>Featured role</h2>
                                <p>{featuredJobs[0].title} at {featuredJobs[0].company}</p>
                                <span>{featuredJobs[0].location}</span>
                            </>
                        ) : (
                            <>
                                <h2>Featured role</h2>
                                <p>Senior Frontend Engineer at BrightHire Labs</p>
                                <span>Hybrid • New York, NY</span>
                            </>
                        )}
                    </div>
                </div>
            </section>

            <section className="section-panel">
                <div className="section-heading">
                    <div>
                        <h2>Featured jobs</h2>
                        <p>Handpicked opportunities for trending roles and top companies.</p>
                    </div>
                </div>
                <JobList
                    jobs={featuredJobs}
                    savedJobs={savedJobs}
                    onToggleSave={onToggleSave}
                />
            </section>

            <section className="section-panel">
                <div className="section-heading">
                    <div>
                        <h2>Recent jobs</h2>
                        <p>Newest postings from across our platform.</p>
                    </div>
                    <Link to="/jobs" className="button button-tertiary">
                        View All Jobs
                    </Link>
                </div>
                <JobList
                    jobs={searchText ? searchResults.slice(0, 5) : recentJobs}
                    savedJobs={savedJobs}
                    onToggleSave={onToggleSave}
                />
            </section>
        </div>
    );
}

export default Home;