import { useState } from 'react';
import AIChat from './AIChat';

function FloatingChatButton() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                className="floating-chat-btn"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Open AI Chat"
            >
                {isOpen ? '✕' : '💬'}
            </button>

            {isOpen && (
                <AIChat onClose={() => setIsOpen(false)} />
            )}
        </>
    );
}

export default FloatingChatButton;