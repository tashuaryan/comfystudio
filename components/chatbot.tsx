'use client';

import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([
    { role: 'bot', text: 'Hi! Welcome to Comfy Studio. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault(); // Prevents page reload if triggered by Enter key
    if (!input.trim()) return;

    // Add user message to screen
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    try {
      // Send message to our API route
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg }),
      });
      
      const data = await response.json();
      
      // Add bot response to screen
      setMessages(prev => [...prev, { role: 'bot', text: data.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* The Floating Chat Icon */}
      <div 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 bg-[#8b4a62] text-white p-4 rounded-full shadow-lg hover:bg-[#7a3e52] transition-all z-50 cursor-pointer flex items-center justify-center ${isOpen ? 'hidden' : 'block'}`}
      >
        <MessageCircle size={28} />
      </div>

      {/* The Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden flex flex-col" style={{ height: '500px' }}>
          {/* Header */}
          <div className="bg-[#8b4a62] text-white p-4 flex justify-between items-center">
            <h3 className="font-semibold">Comfy Studio Support</h3>
            <div onClick={() => setIsOpen(false)} className="hover:text-gray-200 cursor-pointer flex items-center">
              <X size={20} />
            </div>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 rounded-2xl max-w-[85%] text-sm ${msg.role === 'user' ? 'bg-[#8b4a62] text-white rounded-br-none' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 text-gray-500 p-3 rounded-2xl rounded-bl-none text-sm animate-pulse">
                  Typing...
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <form onSubmit={sendMessage} className="p-3 bg-white border-t border-gray-200 flex gap-2 items-center">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..." 
              className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:border-[#8b4a62] text-sm"
            />
            <div 
              onClick={() => { if (!isLoading) sendMessage(); }} 
              className={`p-2 bg-[#8b4a62] text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-[#7a3e52] ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <Send size={18} />
            </div>
          </form>
        </div>
      )}
    </>
  );
}