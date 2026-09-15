const clean = (value) => value?.replace(/\s+/g, ' ').trim() || null;

const normalizeLocation = (value) => {
    const location = clean(value) || 'Not specified';
    const aliases = new Map([
        ['addis', 'Addis Ababa'],
        ['addis-ababa', 'Addis Ababa'],
        ['addis ababa', 'Addis Ababa'],
    ]);
    return aliases.get(location.toLowerCase()) || location;
};

const firstMeaningfulLine = (rawText) => rawText.split(/\r?\n/).map(clean).find(Boolean) || 'Opportunity';

const extractTitle = (rawText) => {
    const line = firstMeaningfulLine(rawText).replace(/^(job|vacancy|hiring)\s*[:-]\s*/i, '');
    return clean(line.replace(/\s+at\s+.+$/i, ''))?.slice(0, 255) || 'Opportunity';
};

const extractCompany = (rawText) => {
    const match = rawText.match(/\bat\s+([^\n|,;]+)/i) || rawText.match(/company\s*[:-]\s*([^\n]+)/i);
    return clean(match?.[1])?.slice(0, 255) || 'Company not specified';
};

const extractLocation = (rawText) => {
    const match = rawText.match(/(?:location|place|based in)\s*[:-]\s*([^\n]+)/i);
    return normalizeLocation(match?.[1]);
};

const extractType = (rawText) => {
    if (/part[- ]?time/i.test(rawText)) return 'Part Time';
    if (/contract|freelance/i.test(rawText)) return 'Contract';
    if (/intern(ship)?/i.test(rawText)) return 'Internship';
    return 'Full Time';
};

const extractSalary = (rawText) => clean(rawText.match(/(?:salary|compensation|pay)\s*[:-]\s*([^\n]+)/i)?.[1])?.slice(0, 100) || null;
const extractApplicationUrl = (rawText) => rawText.match(/https?:\/\/[^\s)]+/i)?.[0] || null;
const extractDeadline = (rawText) => {
    const value = rawText.match(/(?:deadline|apply before|closing date)\s*[:-]\s*([^\n]+)/i)?.[1];
    const date = value ? new Date(value.trim()) : null;
    return date && !Number.isNaN(date.getTime()) ? date.toISOString() : null;
};

const extractRequirements = (rawText) => rawText.split(/\r?\n/)
    .map(clean)
    .filter((line) => line && /^(?:[-*•]|requirement|qualification|must have|experience)/i.test(line))
    .map((text) => ({ text: text.replace(/^[-*•]\s*/, ''), category: /experience|year/i.test(text) ? 'experience' : 'technical_skill' }))
    .slice(0, 50);

export const normalizeJob = (input) => {
    const title = extractTitle(input.rawText);
    const company = extractCompany(input.rawText);
    const location = extractLocation(input.rawText);
    const applicationUrl = extractApplicationUrl(input.rawText);
    return {
        title,
        company,
        location,
        category: 'General',
        type: extractType(input.rawText),
        salary: extractSalary(input.rawText),
        remote: /\bremote\b/i.test(input.rawText),
        description: input.rawText,
        postedAt: input.postedAt || new Date().toISOString(),
        deadline: extractDeadline(input.rawText),
        applicationUrl,
        experienceLevel: /senior|lead|principal/i.test(input.rawText) ? 'Senior' : /junior|entry[- ]level/i.test(input.rawText) ? 'Entry' : null,
        requirements: extractRequirements(input.rawText),
        normalizedTitle: title.toLowerCase(),
        normalizedCompany: company.toLowerCase(),
        normalizedLocation: location.toLowerCase(),
        normalizedApplicationUrl: applicationUrl?.toLowerCase() || null,
    };
};
