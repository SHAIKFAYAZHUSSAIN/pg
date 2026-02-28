"use client";

import { useState } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Message = { id: number; text: string; sender: 'bot' | 'user' };

const PREDEFINED_QUESTIONS = [
    "How does risk prediction work?",
    "How to register donor?",
    "What is High Risk?"
];

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "Hello! How can I help you today?", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');

    const handleSend = (text: string) => {
        if (!text.trim()) return;

        const userMessage = { id: Date.now(), text, sender: 'user' as const };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');

        // Simulate bot response
        setTimeout(() => {
            let botResponse = "I'm still learning, but I'll connect you with a specialist soon.";

            const lowerText = text.toLowerCase();
            if (lowerText.includes('risk prediction') || lowerText.includes('work')) {
                botResponse = "Risk prediction uses your health metrics like age, blood pressure, glucose, body temperature, and heart rate to estimate maternal risk using an AI model.";
            } else if (lowerText.includes('register donor')) {
                botResponse = "You can register a donor by navigating to the 'Register Donor' page from the top menu, filling out the required health stats, and clicking submit.";
            } else if (lowerText.includes('high risk')) {
                botResponse = "High Risk implies that the vitals inputted strongly correlate with severe maternal complications. Immediate medical attention is normally advised.";
            }

            setMessages((prev) => [...prev, { id: Date.now() + 1, text: botResponse, sender: 'bot' }]);
        }, 600);
    };

    return (
        <>
            {/* Floating Button */}
            <motion.button
                onClick={() => setIsOpen(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`fixed bottom-6 right-6 p-4 rounded-full shadow-2xl glass-panel bg-gradient-to-r from-blue-600 to-indigo-600 text-white z-50 ${isOpen ? 'hidden' : 'flex'}`}
            >
                <MessageSquare size={28} />
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed bottom-6 right-6 w-[90vw] sm:w-[380px] h-[550px] max-h-[85vh] z-50 glass-panel bg-white/95 flex flex-col shadow-2xl border border-white/60 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex justify-between items-center shadow-md">
                            <div className="flex items-center gap-2">
                                <Bot size={20} />
                                <span className="font-bold tracking-wide">PG Assistant</span>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((m) => (
                                <div key={m.id} className={`flex max-w-[85%] ${m.sender === 'user' ? 'ml-auto justify-end' : 'mr-auto justify-start'}`}>
                                    <div className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${m.sender === 'user'
                                        ? 'bg-blue-600 text-white rounded-br-sm'
                                        : 'bg-slate-100 text-slate-800 rounded-bl-sm border border-slate-200'
                                        }`}>
                                        {m.text}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Presets */}
                        <div className="px-4 pb-2 flex flex-wrap gap-2">
                            {PREDEFINED_QUESTIONS.map((pq, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleSend(pq)}
                                    className="text-xs bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-100/50 px-2 py-1.5 rounded-lg transition-colors text-left"
                                >
                                    {pq}
                                </button>
                            ))}
                        </div>

                        {/* Input */}
                        <div className="p-4 bg-white border-t border-slate-100 flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
                                placeholder="Ask something..."
                                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                            />
                            <button
                                onClick={() => handleSend(input)}
                                disabled={!input.trim()}
                                className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
