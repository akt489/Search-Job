import { FormEvent, useMemo, useState, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import JobList from '../components/JobList';
import jobsData from '../data/mockJobs';

type HomeProps = {
    savedJobs: string[];
    onToggleSave: (jobId: string) => void;
};

function Home({ savedJobs, onToggleSave }: HomeProps) {
    const [searchText, setSearchText] = useState('');

    const featuredJobs = jobsData.slice(0, 3);
    const recentJobs = jobsData.slice(3, 8);
    const searchResults = useMemo(
        () =>
            jobsData.filter((job) =>
                [job.title, job.company, job.description].some((value) => value.toLowerCase().includes(searchText.toLowerCase())),
            ),
        [searchText],
    );

    return (
        <div className="page-content page-home">
            <section className="hero-section">
                <div className="hero-copy">
                    <p className="eyebrow">Find your next career move</p>
                    <h1>Modern job search for ambitious professionals.</h1>
                    <p className="hero-text">Browse curated roles, save favorites, and apply with confidence through a clean, modern dashboard.</p>
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
                        <h2>Featured role</h2>
                        <p>Senior Frontend Engineer at BrightHire Labs</p>
                        <span>Hybrid • New York, NY</span>
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
                <JobList jobs={featuredJobs} savedJobs={savedJobs} onToggleSave={onToggleSave} />
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
                <JobList jobs={searchText ? searchResults.slice(0, 5) : recentJobs} savedJobs={savedJobs} onToggleSave={onToggleSave} />
            </section>
        </div>
    );
}

export default Home;