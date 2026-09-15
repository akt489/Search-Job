const defaultSignals = ['hiring', 'vacancy', 'job', 'position', 'developer', 'engineer', 'internship', 'recruitment', 'career', 'apply', 'salary', 'deadline'];
const negativeSignals = ['channel rules', 'subscribe', 'admin notice', 'giveaway'];

export const isCandidateJobMessage = (text, keywords = defaultSignals) => {
    const normalized = String(text || '').toLowerCase();
    if (!normalized.trim()) return false;
    const signals = keywords.filter((keyword) => normalized.includes(keyword));
    const negatives = negativeSignals.filter((keyword) => normalized.includes(keyword));
    return signals.length >= 2 || (signals.length >= 1 && negatives.length === 0 && normalized.length >= 120);
};

export const getJobSignals = (text, keywords = defaultSignals) => {
    const normalized = String(text || '').toLowerCase();
    return keywords.filter((keyword) => normalized.includes(keyword));
};
