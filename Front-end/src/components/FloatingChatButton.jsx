import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import AIChat from './AIChat';

function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button type="button" className={isOpen ? 'floating-chat-btn is-open' : 'floating-chat-btn'} onClick={() => setIsOpen((current) => !current)} aria-label={isOpen ? 'Close Career assistant' : 'Open Career assistant'} aria-expanded={isOpen}>
        {isOpen ? <X size={20} aria-hidden="true" /> : <MessageCircle size={21} aria-hidden="true" />}
      </button>
      {isOpen && <AIChat onClose={() => setIsOpen(false)} />}
    </>
  );
}

export default FloatingChatButton;
