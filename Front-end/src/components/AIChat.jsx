import { useState, useEffect, useRef } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || '';

function AIChat({ jobId, onClose }) {
    const [messages, setMessages] = useState([
        { role: 'ai', content: '👋 Hi! I\'m JobScout AI. How can I help you with your job search today?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef(null);
    const token = localStorage.getItem('jobscout-token');

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE}/api/ai/chat`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: userMessage,
                    jobId: jobId || null,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessages(prev => [...prev, { role: 'ai', content: data.response }]);
            } else {
                setMessages(prev => [...prev, {
                    role: 'ai',
                    content: '❌ Sorry, I\'m having trouble connecting. Please try again.'
                }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, {
                role: 'ai',
                content: '❌ Network error. Please check your connection.'
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ai-chat-container">
            <div className="ai-chat-header">
                <h3>🤖 JobScout AI</h3>
                {onClose && (
                    <button className="close-btn" onClick={onClose}>✕</button>
                )}
            </div>

            <div className="ai-chat-messages">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`ai-message ${msg.role}`}>
                        <div className="message-content">{msg.content}</div>
                    </div>
                ))}
                {loading && (
                    <div className="ai-message ai typing">
                        <div className="typing-dots">...</div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            <div className="ai-chat-input">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask me about jobs, applications, or careers..."
                    disabled={loading}
                />
                <button onClick={handleSend} disabled={loading}>
                    {loading ? '...' : '➤'}
                </button>
            </div>
        </div>
    );
}

export default AIChat;