import React from "react";
import { Link } from "react-router-dom";
import {
  Bookmark,
  MapPin,
  BriefcaseBusiness,
  Clock,
  GraduationCap,
  Globe2,
  Banknote,
  CalendarDays,
  ArrowUpRight,
  Sparkles,
  Building2,
} from "lucide-react";

export type JobType = {
  id: string | number;
  title: string;
  company: string;
  location: string;
  category?: string;
  type?: string;
  employmentType?: string;
  careerLevel?: string;
  workMode?: string;
  remote?: boolean;
  salary?: string;
  description?: string;
  posted?: string;
  posted_at?: string;
  deadline?: string;
  tags?: string[];
  matchScore?: number;
  companyLogo?: string;
  [key: string]: any;
};

export type JobCardProps = {
  job: JobType;
  saved: boolean;
  onToggleSave: (jobId: string | number) => void;
};

const JobCard: React.FC<JobCardProps> = ({
  job,
  saved,
  onToggleSave,
}) => {
  /* ===============================
     JOB DATA NORMALIZATION
  =============================== */

  const descriptionText = job.description || "";

  const preview =
    descriptionText.length > 150
      ? `${descriptionText.slice(0, 150)}...`
      : descriptionText;

  const postedDate =
    job.posted ||
    (job.posted_at
      ? new Date(job.posted_at).toLocaleDateString()
      : "Recently");

  const employmentType =
    job.employmentType ||
    job.type ||
    "Full-time";

  const careerLevel =
    job.careerLevel ||
    "Not specified";

  const workMode =
    job.workMode ||
    (job.remote
      ? "Remote"
      : "On-site");

  const salaryText =
    job.salary ||
    "Salary not disclosed";

  const deadlineText =
    job.deadline ||
    "Open until filled";

  const matchScore =
    job.matchScore ||
    job.match_score ||
    null;

  const tags = Array.isArray(job.tags)
    ? job.tags.slice(0, 4)
    : job.category
      ? [job.category]
      : [];

  /* ===============================
     COMPANY INITIALS
  =============================== */

  const companyInitials =
    job.company
      ?.split(" ")
      .slice(0, 2)
      .map((word: string) =>
        word.charAt(0)
      )
      .join("")
      .toUpperCase() || "CO";

  /* ===============================
     MATCH SCORE COLOR
  =============================== */

  const getMatchClass = () => {
    if (!matchScore) return "";

    if (matchScore >= 85)
      return "excellent";

    if (matchScore >= 70)
      return "good";

    return "fair";
  };

  return (
    <article
      className="job-card-modern"
      aria-labelledby={`job-title-${job.id}`}
    >
      {/* ===============================
          TOP SECTION
      =============================== */}

      <div className="job-card-header">

        {/* COMPANY LOGO */}

        <div className="job-company-logo">
          {job.companyLogo ? (
            <img
              src={job.companyLogo}
              alt={`${job.company} logo`}
            />
          ) : (
            <span>
              {companyInitials}
            </span>
          )}
        </div>


        {/* SAVE BUTTON */}

        <button
          type="button"
          className={
            saved
              ? "job-save-btn is-saved"
              : "job-save-btn"
          }
          onClick={() =>
            onToggleSave(job.id)
          }
          aria-label={
            saved
              ? `Remove ${job.title} from saved jobs`
              : `Save ${job.title}`
          }
          title={
            saved
              ? "Remove from saved jobs"
              : "Save job"
          }
        >
          <Bookmark size={19} />
        </button>

      </div>


      {/* ===============================
          JOB TITLE
      =============================== */}

      <div className="job-title-section">

        <Link
          to={`/jobs/${job.id}`}
          className="job-title-link"
        >
          <h3
            id={`job-title-${job.id}`}
          >
            {job.title}
          </h3>
        </Link>


        <div className="job-company-name">

          <Building2 size={15} />

          <span>
            {job.company}
          </span>

        </div>

      </div>


      {/* ===============================
          AI MATCH SCORE
      =============================== */}

      {matchScore && (
        <div className="job-ai-match">

          <div className="ai-match-left">

            <div className="ai-match-icon">
              <Sparkles size={15} />
            </div>

            <div>
              <span>
                AI Match
              </span>

              <strong>
                {matchScore}% Match
              </strong>
            </div>

          </div>


          <div
            className={`match-circle ${getMatchClass()}`}
          >
            {matchScore}%
          </div>

        </div>
      )}


      {/* ===============================
          JOB META
      =============================== */}

      <div className="job-meta-modern">

        <span>
          <MapPin size={15} />

          {job.location || "Location flexible"}
        </span>

        <span>
          <BriefcaseBusiness size={15} />

          {employmentType}
        </span>

        <span>
          <Globe2 size={15} />

          {workMode}
        </span>

        {careerLevel !== "Not specified" && (
          <span>
            <GraduationCap size={15} />

            {careerLevel}
          </span>
        )}

      </div>


      {/* ===============================
          DESCRIPTION
      =============================== */}

      {preview && (
        <p className="job-description-modern">
          {preview}
        </p>
      )}


      {/* ===============================
          SKILL TAGS
      =============================== */}

      {tags.length > 0 && (

        <div className="job-tags-modern">

          {tags.map(
            (tag: string, index: number) => (

              <span
                key={`${job.id}-${tag}-${index}`}
              >
                {tag}
              </span>

            )
          )}

        </div>

      )}


      {/* ===============================
          FOOTER
      =============================== */}

      <div className="job-card-bottom">

        <div className="job-extra-info">

          <div>
            <Banknote size={15} />

            <span>
              {salaryText}
            </span>
          </div>

          <div>
            <CalendarDays size={15} />

            <span>
              {deadlineText}
            </span>
          </div>

        </div>


        <div className="job-card-actions">

          <Link
            to={`/jobs/${job.id}`}
            className="job-details-btn"
          >
            View Job

            <ArrowUpRight size={17} />
          </Link>

        </div>

      </div>


      {/* POSTED INDICATOR */}

      <div className="job-posted-info">

        <Clock size={13} />

        <span>
          Posted {postedDate}
        </span>

      </div>

    </article>
  );
};

export default JobCard;