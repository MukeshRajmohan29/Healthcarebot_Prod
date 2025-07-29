import React from 'react';

interface ChatMessageProps {
    fromBot: boolean;
    text: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ fromBot, text }) => (
    <div style={{ textAlign: fromBot ? 'left' : 'right', margin: '8px 0' }}>
        <span
            style={{
                background: fromBot ? '#e0e0e0' : '#cce5ff',
                padding: '8px 12px',
                borderRadius: '16px',
                display: 'inline-block',
                maxWidth: '70%',
                wordBreak: 'break-word'
            }}
        >
            {text}
        </span>
    </div>
);