import React, { useState } from 'react';
import { ChatMessage } from './ChatMessage';

export const ChatFlow = () => {
    const [messages, setMessages] = useState<Array<{ fromBot: boolean, text: string }>>([]);

    const addUserMessage = (text: string) => {
        setMessages(prev => [...prev, { fromBot: false, text }]);
    };

    const addBotMessage = (text: string) => {
        setMessages(prev => [...prev, { fromBot: true, text }]);
    };

    const handleUserMessage = (message: string) => {
        addUserMessage(message);

        if (!isHealthcareRelated(message)) {
            addBotMessage("I'm here to assist you with healthcare-related questions such as symptoms, appointments, or insurance. Please ask a health-related question.");
            return;
        }

        // Example: echo back with healthcare context
        addBotMessage(`Thank you for your message regarding your health. Our team will assist you with: "${message}"`);
    };

    function isHealthcareRelated(message: string): boolean {
        const keywords = ['doctor', 'appointment', 'prescription', 'symptom', 'insurance', 'health', 'medical', 'clinic', 'hospital'];
        return keywords.some(word => message.toLowerCase().includes(word));
    }

    return (
        <div>
            {messages.map((msg, index) => (
                <ChatMessage key={index} fromBot={msg.fromBot} text={msg.text} />
            ))}
        </div>
    );
};