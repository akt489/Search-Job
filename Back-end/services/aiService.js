import axios from 'axios';

// ============================================
// AI SERVICE - Core AI interactions
// ============================================

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'deepseek/deepseek-chat';

/**
 * Call OpenRouter API with a prompt
 */
export async function callAI(messages, options = {}) {
    try {
        const response = await axios.post(
            'https://openrouter.ai/api/v1/chat/completions',
            {
                model: OPENROUTER_MODEL,
                messages: messages,
                temperature: options.temperature || 0.7,
                max_tokens: options.max_tokens || 600,
                ...options,
            },
            {
                headers: {
                    'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': process.env.APP_URL || 'http://localhost:4000',
                    'X-Title': 'SearchJob AI',
                },
            }
        );

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('AI Service Error:', error.response?.data || error.message);
        throw new Error('AI service temporarily unavailable.');
    }
}

/**
 * Generate a system prompt for the AI
 */
export function buildSystemPrompt(userContext, tools) {
    const toolDescriptions = Object.entries(tools)
        .map(([name, tool]) => `- ${name}: ${tool.description}`)
        .join('\n');

    return `
        You are JobScout AI, a professional career assistant.

        USER CONTEXT:
        ${userContext}

        AVAILABLE TOOLS:
        ${toolDescriptions}

        RULES:
        1. Use tools to perform actions, never access the database directly.
        2. Get user confirmation before saving jobs or applying.
        3. Keep responses helpful, friendly, and concise (under 200 words).
        4. If you don't know something, say so and offer to help with what you can.
        5. Always be professional, encouraging, and supportive.
    `;
}

/**
 * Parse tool calls from AI response
 */
export function parseToolCalls(content) {
    // Look for tool calls in format: [TOOL:toolName:args]
    const toolRegex = /\[TOOL:(\w+):(.*?)\]/g;
    const matches = [];
    let match;

    while ((match = toolRegex.exec(content)) !== null) {
        matches.push({
            name: match[1],
            args: JSON.parse(match[2] || '{}'),
        });
    }

    return matches;
}

export default {
    callAI,
    buildSystemPrompt,
    parseToolCalls,
};