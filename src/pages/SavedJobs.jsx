import SavedJobsList from '../components/SavedJobsList';
import jobsData from '../data/mockJobs';

function SavedJobs({ savedJobs, onToggleSave }) {
    const saved = jobsData.filter((job) => savedJobs.includes(job.id));

    return (
        <div className="page-content page-saved">
            <div className="section-heading">
                <div>
                    <h1>Saved jobs</h1>
                    <p>Keep track of opportunities you want to revisit.</p>
                </div>
            </div>
            <SavedJobsList jobs={saved} onToggleSave={onToggleSave} />
        </div>
    );
}

export default SavedJobs;
