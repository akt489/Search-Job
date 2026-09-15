export function getCompanyInitials(company = '') {
  return company
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase() || 'CO';
}

export function getEmploymentType(job = {}) {
  return job.employmentType || job.type || 'Full-time';
}

export function getWorkMode(job = {}) {
  return job.workMode || (job.remote ? 'Remote' : 'On-site');
}

export function getSalaryLabel(job = {}) {
  return job.salary || 'Salary not disclosed';
}

export function getDeadlineLabel(job = {}) {
  return job.deadline || 'Open until filled';
}

export function getPostedLabel(job = {}) {
  if (job.posted) return job.posted;
  if (job.posted_at) {
    const date = new Date(job.posted_at);
    if (!Number.isNaN(date.getTime())) return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }
  return 'Recently';
}

export function getJobTags(job = {}) {
  if (Array.isArray(job.tags)) return job.tags.filter(Boolean).slice(0, 4);
  return job.category ? [job.category] : [];
}

export function getStatusClass(status = '') {
  const normalized = status.toLowerCase().replace(/\s+/g, '-');
  if (['offer', 'accepted', 'hired'].includes(normalized)) return 'status-success';
  if (['under-review', 'interview', 'review'].includes(normalized)) return 'status-warning';
  if (['rejected', 'declined'].includes(normalized)) return 'status-danger';
  return 'status-info';
}
