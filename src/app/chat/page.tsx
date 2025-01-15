"use client";

import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([{
    role: 'assistant',
    content: "Hi! I'm your emergency preparedness assistant. I can help you with wildfire safety information, evacuation procedures, and emergency planning. How can I help you today?"
  }]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const newMessages = [...messages, { role: 'user' as 'user', content: inputMessage }];
    setMessages(newMessages);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newMessages,
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      setMessages([...newMessages, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages([
        ...newMessages,
        { 
          role: 'assistant', 
          content: "I'm sorry, I'm having trouble connecting right now. Please try again." 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <nav className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="hover:text-orange-600 transition-colors">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <h1 className="text-2xl font-semibold">Emergency Assistant</h1>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8">
          {/* Chat Container */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Chat Header */}
            <div className="p-4 bg-orange-50 border-b">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                <p className="text-sm text-gray-600">
                  Ask me anything about emergency preparedness and safety.
                </p>
              </div>
            </div>

            {/* Messages Area */}
            <div className="h-[400px] overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-xl ${
                      message.role === 'user'
                        ? 'bg-orange-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-xl p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-600 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-orange-600 rounded-full animate-bounce [animation-delay:-.3s]" />
                      <div className="w-2 h-2 bg-orange-600 rounded-full animate-bounce [animation-delay:-.5s]" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t bg-gray-50">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your question here..."
                  className="flex-1 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-600"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  className="px-4 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors disabled:opacity-50"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Frequently Asked Questions</h2>
            <div className="grid gap-4">
              <button 
                onClick={() => setInputMessage("What should I include in my emergency kit?")}
                className="text-left p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
              >
                What should I include in my emergency kit?
              </button>
              <button 
                onClick={() => setInputMessage("How do I create an evacuation plan?")}
                className="text-left p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
              >
                How do I create an evacuation plan?
              </button>
              <button 
                onClick={() => setInputMessage("What are the signs of an approaching wildfire?")}
                className="text-left p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
              >
                What are the signs of an approaching wildfire?
              </button>
              <button 
                onClick={() => setInputMessage("How can I make my home more fire-resistant?")}
                className="text-left p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
              >
                How can I make my home more fire-resistant?
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}