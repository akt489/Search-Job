import {
    useMemo,
    useState,
    useEffect,
    useCallback,
} from "react";
import { useNavigate } from "react-router-dom";

import SearchBar from "../components/SearchBar";

import {
    Building2,
    MapPin,
    Globe,
    Mail,
    Search,
    BriefcaseBusiness,
    ArrowRight,
    SlidersHorizontal,
    X,
    ExternalLink,
    Sparkles,
    Users,
    ChevronRight,
} from "lucide-react";

const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:4000/api";

function FindCompany() {
    const navigate = useNavigate();

    const [jobs, setJobs] = useState([]);
    const [locations, setLocations] = useState(["All"]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchInput, setSearchInput] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [locationFilter, setLocationFilter] =
        useState("All");

    /* ===============================
       FETCH LOCATIONS
    =============================== */

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const res = await fetch(
                    `${API_BASE_URL}/jobs/locations`
                );

                if (!res.ok) {
                    throw new Error(
                        "Failed to load locations"
                    );
                }

                const data = await res.json();

                setLocations([
                    "All",
                    ...(Array.isArray(data) ? data : []),
                ]);
            } catch (err) {
                console.error(
                    "Location fetch error:",
                    err
                );

                setLocations(["All"]);
            }
        };

        fetchLocations();
    }, []);

    /* ===============================
       FETCH JOBS / COMPANIES
    =============================== */

    const fetchCompanies = useCallback(
        async () => {
            try {
                setLoading(true);

                const params = new URLSearchParams();

                if (searchQuery) {
                    params.append(
                        "search",
                        searchQuery
                    );
                }

                if (locationFilter !== "All") {
                    params.append(
                        "location",
                        locationFilter
                    );
                }

                const url =
                    `${API_BASE_URL}/jobs?${params.toString()}`;

                const res = await fetch(url);

                if (!res.ok) {
                    throw new Error(
                        `Failed to load companies`
                    );
                }

                const data = await res.json();

                setJobs(
                    Array.isArray(data) ? data : []
                );

                setError(null);
            } catch (err) {
                console.error(err);

                setError(err.message);

                setJobs([]);
            } finally {
                setLoading(false);
            }
        },
        [searchQuery, locationFilter]
    );

    useEffect(() => {
        fetchCompanies();
    }, [fetchCompanies]);

    /* ===============================
       DEBOUNCE SEARCH
    =============================== */

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchQuery(
                searchInput.trim()
            );
        }, 400);

        return () =>
            clearTimeout(timer);
    }, [searchInput]);

    /* ===============================
       GROUP JOBS BY COMPANY
    =============================== */

    const companies = useMemo(() => {
        const companyMap = new Map();

        jobs.forEach((job) => {
            const companyName =
                job.company?.trim() ||
                "Unknown Company";

            if (!companyMap.has(companyName)) {
                companyMap.set(companyName, {
                    id:
                        job.company_id ||
                        companyName
                            .toLowerCase()
                            .replace(/\s+/g, "-"),

                    name: companyName,

                    location:
                        job.location ||
                        "Location not specified",

                    category:
                        job.category ||
                        job.type ||
                        "Company",

                    description:
                        job.description ||
                        "Explore career opportunities and learn more about this organization.",

                    website:
                        job.website ||
                        null,

                    contact:
                        job.contact ||
                        null,

                    remote:
                        job.remote ||
                        false,

                    jobs: [],

                    jobCount: 0,
                });
            }

            const company =
                companyMap.get(companyName);

            company.jobs.push(job);
            company.jobCount += 1;

            if (
                !company.website &&
                job.website
            ) {
                company.website =
                    job.website;
            }

            if (
                !company.contact &&
                job.contact
            ) {
                company.contact =
                    job.contact;
            }
        });

        return Array.from(
            companyMap.values()
        );
    }, [jobs]);

    /* ===============================
       HANDLERS
    =============================== */

    const handleSearchChange = (
        event
    ) => {
        setSearchInput(
            event.target.value
        );
    };

    const handleSearchSubmit = (
        event
    ) => {
        event.preventDefault();

        setSearchQuery(
            searchInput.trim()
        );
    };

    const clearFilters = () => {
        setSearchInput("");
        setSearchQuery("");
        setLocationFilter("All");
    };

    const getCompanyInitials = (
        name
    ) => {
        return name
            .split(" ")
            .slice(0, 2)
            .map((word) =>
                word.charAt(0)
            )
            .join("")
            .toUpperCase();
    };

    const getCompanyColor = (
        name
    ) => {
        const colors = [
            "company-color-blue",
            "company-color-purple",
            "company-color-green",
            "company-color-orange",
            "company-color-pink",
        ];

        const index =
            name.length % colors.length;

        return colors[index];
    };

    return (
        <div className="page-content page-companies">

            {/* ================= HERO ================= */}

            <section className="companies-hero-modern">

                <div className="companies-hero-glow glow-one" />
                <div className="companies-hero-glow glow-two" />

                <div className="companies-hero-content">

                    <div className="companies-eyebrow">
                        <Sparkles size={15} />
                        DISCOVER EMPLOYERS
                    </div>

                    <h1>
                        Find companies where
                        <span> your career can grow.</span>
                    </h1>

                    <p>
                        Explore companies, discover
                        opportunities, and connect with
                        organizations looking for talent
                        like you.
                    </p>

                    <div className="hero-company-actions">

                        <button
                            onClick={() =>
                                document
                                    .querySelector(
                                        ".company-search-section"
                                    )
                                    ?.scrollIntoView({
                                        behavior: "smooth",
                                    })
                            }
                            className="hero-explore-btn"
                        >
                            <Search size={18} />
                            Explore Companies
                            <ArrowRight size={17} />
                        </button>

                    </div>

                </div>


                {/* HERO STATS */}

                <div className="companies-hero-stats">

                    <div className="hero-stat-card">

                        <div className="hero-stat-icon blue">
                            <Building2 size={20} />
                        </div>

                        <div>
                            <strong>
                                {companies.length}
                            </strong>

                            <span>
                                Active Companies
                            </span>
                        </div>

                    </div>


                    <div className="hero-stat-card">

                        <div className="hero-stat-icon purple">
                            <MapPin size={20} />
                        </div>

                        <div>
                            <strong>
                                {locations.length - 1}
                            </strong>

                            <span>
                                Locations
                            </span>
                        </div>

                    </div>


                    <div className="hero-stat-card">

                        <div className="hero-stat-icon green">
                            <BriefcaseBusiness
                                size={20}
                            />
                        </div>

                        <div>
                            <strong>
                                {jobs.length}
                            </strong>

                            <span>
                                Open Opportunities
                            </span>
                        </div>

                    </div>

                </div>

            </section>


            {/* ================= SEARCH ================= */}

            <section className="company-search-section">

                <div className="company-search-wrapper">

                    <div className="search-heading">

                        <div>
                            <span className="section-label">
                                COMPANY DIRECTORY
                            </span>

                            <h2>
                                Explore employers
                            </h2>
                        </div>

                        <p>
                            Find organizations by name,
                            industry, or location.
                        </p>

                    </div>


                    <div className="company-search-controls">

                        <div className="company-main-search">
                            <SearchBar
                                value={searchInput}
                                onChange={
                                    handleSearchChange
                                }
                                onSubmit={
                                    handleSearchSubmit
                                }
                                placeholder="Search companies..."
                            />
                        </div>


                        <div className="location-filter">

                            <div className="filter-label">
                                <SlidersHorizontal
                                    size={16}
                                />

                                <span>Location</span>
                            </div>

                            <select
                                value={locationFilter}
                                onChange={(event) =>
                                    setLocationFilter(
                                        event.target.value
                                    )
                                }
                            >
                                {locations.map(
                                    (location) => (
                                        <option
                                            key={location}
                                            value={location}
                                        >
                                            {location}
                                        </option>
                                    )
                                )}
                            </select>

                        </div>

                    </div>


                    {/* ACTIVE FILTER */}

                    {(searchQuery ||
                        locationFilter !== "All") && (

                            <div className="active-filters">

                                <span>
                                    Filters active
                                </span>

                                {searchQuery && (
                                    <button>
                                        <Search size={14} />

                                        {searchQuery}

                                        <X
                                            size={14}
                                            onClick={() => {
                                                setSearchInput("");
                                                setSearchQuery("");
                                            }}
                                        />
                                    </button>
                                )}

                                {locationFilter !== "All" && (
                                    <button>
                                        <MapPin size={14} />

                                        {locationFilter}

                                        <X
                                            size={14}
                                            onClick={() =>
                                                setLocationFilter(
                                                    "All"
                                                )
                                            }
                                        />
                                    </button>
                                )}

                                <button
                                    className="clear-filter-btn"
                                    onClick={clearFilters}
                                >
                                    Clear all
                                </button>

                            </div>

                        )}

                </div>

            </section>


            {/* ================= RESULTS HEADER ================= */}

            <section className="companies-results-header">

                <div>

                    <span className="section-label">
                        RESULTS
                    </span>

                    <h2>
                        {loading
                            ? "Finding companies..."
                            : `${companies.length} company${companies.length === 1
                                ? ""
                                : "ies"
                            } discovered`}
                    </h2>

                </div>

                {!loading && companies.length > 0 && (
                    <p>
                        Browse organizations and
                        discover available opportunities.
                    </p>
                )}

            </section>


            {/* ================= ERROR ================= */}

            {error && !loading && (

                <div className="company-error-state">

                    <div className="error-icon">
                        <Building2 size={26} />
                    </div>

                    <div>
                        <h3>
                            Unable to load companies
                        </h3>

                        <p>{error}</p>
                    </div>

                    <button
                        onClick={fetchCompanies}
                    >
                        Try Again
                    </button>

                </div>

            )}


            {/* ================= COMPANY GRID ================= */}

            {!loading && !error && (
                <section className="company-grid-modern">

                    {companies.map(
                        (company, index) => (

                            <article
                                key={company.id}
                                className="company-card-modern"
                                style={{
                                    animationDelay:
                                        `${index * 60}ms`,
                                }}
                            >

                                {/* CARD TOP */}

                                <div className="company-card-top">

                                    <div
                                        className={`company-logo ${getCompanyColor(
                                            company.name
                                        )
                                            }`}
                                    >
                                        {getCompanyInitials(
                                            company.name
                                        )}
                                    </div>


                                    <button
                                        className="company-more-btn"
                                        aria-label="More company options"
                                    >
                                        •••
                                    </button>

                                </div>


                                {/* COMPANY INFO */}

                                <div className="company-card-content">

                                    <div className="company-title-row">

                                        <h3>
                                            {company.name}
                                        </h3>

                                        {company.website && (
                                            <ExternalLink
                                                size={16}
                                            />
                                        )}

                                    </div>


                                    <div className="company-category">
                                        <Building2 size={14} />

                                        {company.category}
                                    </div>


                                    <p className="company-description-modern">
                                        {company.description}
                                    </p>


                                    {/* META */}

                                    <div className="company-meta-modern">

                                        <span>
                                            <MapPin size={15} />

                                            {company.location}
                                        </span>

                                        {company.remote && (
                                            <span>
                                                <Globe size={15} />

                                                Remote
                                            </span>
                                        )}

                                    </div>


                                    {/* JOB COUNT */}

                                    <div className="company-opportunities">

                                        <div className="opportunity-icon">
                                            <BriefcaseBusiness
                                                size={17}
                                            />
                                        </div>

                                        <div>
                                            <strong>
                                                {company.jobCount}
                                            </strong>

                                            <span>
                                                Open opportunity
                                                {company.jobCount !==
                                                    1
                                                    ? "ies"
                                                    : ""}
                                            </span>
                                        </div>

                                    </div>

                                </div>


                                {/* FOOTER */}

                                <div className="company-card-footer-modern">

                                    <button
                                        className="view-company-btn"
                                        onClick={() =>
                                            navigate(
                                                `/jobs?company=${encodeURIComponent(
                                                    company.name
                                                )}`
                                            )
                                        }
                                    >
                                        View Opportunities

                                        <ArrowRight size={17} />
                                    </button>


                                    {company.website && (

                                        <a
                                            href={
                                                company.website.startsWith(
                                                    "http"
                                                )
                                                    ? company.website
                                                    : `https://${company.website}`
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="company-website-btn"
                                            aria-label={`Visit ${company.name}`}
                                        >
                                            <Globe size={17} />
                                        </a>

                                    )}

                                </div>

                            </article>

                        )
                    )}

                </section>
            )}


            {/* ================= EMPTY ================= */}

            {!loading &&
                !error &&
                companies.length === 0 && (

                    <section className="company-empty-modern">

                        <div className="empty-visual">
                            <div className="empty-circle circle-one" />
                            <div className="empty-circle circle-two" />

                            <Search size={38} />
                        </div>

                        <span className="section-label">
                            NO RESULTS
                        </span>

                        <h2>
                            No companies found
                        </h2>

                        <p>
                            We couldn't find companies
                            matching your current search.
                            Try adjusting your filters.
                        </p>

                        <button
                            onClick={clearFilters}
                        >
                            <X size={17} />
                            Clear Filters
                        </button>

                    </section>

                )}


            {/* ================= LOADING ================= */}

            {loading && (

                <section className="company-grid-modern">

                    {Array.from(
                        { length: 6 }
                    ).map((_, index) => (

                        <div
                            key={index}
                            className="company-skeleton-card"
                        >

                            <div className="skeleton-logo" />

                            <div className="skeleton-line title" />

                            <div className="skeleton-line short" />

                            <div className="skeleton-line" />

                            <div className="skeleton-line" />

                            <div className="skeleton-footer" />

                        </div>

                    ))}

                </section>

            )}

        </div>
    );
}

export default FindCompany;