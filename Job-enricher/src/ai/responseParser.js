export const extractJson = (content) => {
    const text = String(content || '').trim();
    try { return JSON.parse(text); } catch { /* Try the next JSON representation. */ }

    const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fenced) {
        try { return JSON.parse(fenced[1].trim()); } catch { /* Try object extraction. */ }
    }

    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start !== -1 && end > start) {
        try { return JSON.parse(text.slice(start, end + 1)); } catch { /* Report malformed output. */ }
    }
    throw new Error('No valid JSON in AI response');
};
