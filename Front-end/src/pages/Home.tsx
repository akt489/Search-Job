import { FormEvent, useMemo, useState, ChangeEvent, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, BriefcaseBusiness, RefreshCw } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import JobList from '../components/JobList';
import { EmptyState, ErrorState, LoadingState } from '../components/ui/AsyncState';
import { API_BASE, safeJson } from '../utils/api';

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


type HomeProps = {
    savedJobs: string[];
    onToggleSave: (jobId: string) => void;
};

function Home({ savedJobs, onToggleSave }: HomeProps) {
    const [searchText, setSearchText] = useState('');
    const [allJobs, setAllJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchJobs = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch(`${API_BASE}/jobs`);
            const data = await safeJson(response, []);
            if (!response.ok) throw new Error(data?.error || 'Failed to load jobs');
            setAllJobs(Array.isArray(data) ? data : []);
        } catch (err) {
            setError('Unable to load jobs. Please try again.');
            console.error('Jobs fetch error:', err);
            setAllJobs([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
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
        return <div className="page-content page-home"><div className="page-title-block"><div><span className="field-kicker">SearchJob / starting point</span><h1>Find your next opportunity</h1><p>Search roles, companies, and skills without losing the details that matter.</p></div></div><LoadingState label="Loading jobs" /></div>;
    }

    if (error) {
        return <div className="page-content page-home"><div className="page-title-block"><div><span className="field-kicker">SearchJob / starting point</span><h1>Find your next opportunity</h1><p>Search roles, companies, and skills without losing the details that matter.</p></div></div><ErrorState title="Jobs are temporarily unavailable" message={error} onRetry={fetchJobs} /><div className="home-feature-card"><div><h2>Keep your search moving</h2><p>Browse the current jobs workspace or return when the latest job data is available.</p></div><Link to="/jobs" className="button button-secondary">Browse jobs <ArrowUpRight size={15} /></Link></div></div>;
    }

    return (
        <div className="page-content page-home">
            <div className="page-title-block"><div><span className="field-kicker">SearchJob / starting point</span><h1>Find your next opportunity</h1><p>Search roles, companies, and skills. Compare the details that matter before you apply.</p></div><div className="page-title-meta"><strong>{safeAllJobs.length || 'No'} open roles</strong><span>Updated from the latest job data</span></div></div>
            <SearchBar value={searchText} onChange={(event: ChangeEvent<HTMLInputElement>) => setSearchText(event.target.value)} onSubmit={(event: FormEvent<HTMLFormElement>) => { event.preventDefault(); }} placeholder="Search roles, companies, or skills" />
            {featuredJobs[0] && <div className="home-feature-card"><div><span className="field-kicker">Featured role</span><h2>{featuredJobs[0].title}</h2><p>{featuredJobs[0].company} · {featuredJobs[0].location}</p></div><Link to={`/jobs/${featuredJobs[0].id}`} className="button button-secondary">View role <ArrowUpRight size={15} /></Link></div>}

            <section className="section-panel">
                <div className="section-heading">
                    <div><span className="field-kicker">Start here</span><h2>Featured jobs</h2><p>Review a small set of current opportunities.</p></div>
                </div>
                <JobList
                    jobs={featuredJobs}
                    savedJobs={savedJobs}
                    onToggleSave={onToggleSave}
                />
            </section>

            <section className="section-panel">
                <div className="section-heading">
                    <div><span className="field-kicker">Latest entries</span><h2>Recent jobs</h2><p>Newest postings from the current job feed.</p></div>
                    <Link to="/jobs" className="button button-quiet">View all jobs <ArrowUpRight size={15} /></Link>
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