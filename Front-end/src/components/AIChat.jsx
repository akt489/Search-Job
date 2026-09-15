import { useEffect, useRef, useState } from 'react';
import { Bot, LockKeyhole, Send, X } from 'lucide-react';
import { API_BASE, safeJson } from '../utils/api';

function AIChat({ jobId, onClose }) {
  const [messages, setMessages] = useState([{ role: 'ai', content: 'I can help you find roles, explain a match, or improve your profile.' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const token = localStorage.getItem('jobscout-token');

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    inputRef.current?.focus();
  }, [messages]);

  useEffect(() => {
    const handleKeyDown = (event) => event.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSend = async () => {
    const userMessage = input.trim();
    if (!userMessage || loading) return;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/ai/chat`, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ message: userMessage, jobId: jobId || null }) });
      const data = await safeJson(response, {});
      setMessages((prev) => [...prev, { role: 'ai', content: response.ok ? (data.response || 'I could not find an answer for that yet.') : 'I am having trouble connecting right now. Please try again.' }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'ai', content: 'The connection failed. Please check your network and try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="ai-chat-container" role="dialog" aria-modal="false" aria-labelledby="career-assistant-title">
      <header className="ai-chat-header"><div><span className="ai-chat-kicker">Career assistant</span><h2 id="career-assistant-title"><Bot size={17} aria-hidden="true" /> SearchJob assistant</h2></div><button type="button" className="icon-button icon-button-on-dark" onClick={onClose} aria-label="Close Career assistant"><X size={18} /></button></header>
      <div className="ai-chat-messages" aria-live="polite">
        {messages.map((message, index) => <div key={`${message.role}-${index}`} className={`ai-message ${message.role}`}><span className="sr-only">{message.role === 'user' ? 'You said' : 'Assistant said'}</span><div className="message-content">{message.content}</div></div>)}
        {loading && <div className="ai-message ai typing"><div className="typing-dots" aria-label="Assistant is typing">•••</div></div>}
        <div ref={chatEndRef} />
      </div>
      <form className="ai-chat-input" onSubmit={(event) => { event.preventDefault(); handleSend(); }}><label htmlFor="assistant-message" className="sr-only">Message Career assistant</label><input ref={inputRef} id="assistant-message" type="text" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask about jobs or your profile" disabled={loading} /><button type="submit" disabled={loading || !input.trim()} aria-label="Send message"><Send size={17} /></button></form>
      <div className="ai-chat-foot"><LockKeyhole size={13} aria-hidden="true" /> Private to your SearchJob account</div>
    </section>
  );
}

export default AIChat;
