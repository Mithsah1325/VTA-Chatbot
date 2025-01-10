import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Book, Calendar, FileText } from 'lucide-react';

export default function VTAChatbot() {
  const [messages, setMessages] = useState([
    { 
      type: 'bot', 
      content: 'Hi! 👋 I\'m your Course Assistant. I can help you with assignments, deadlines, and course materials. What would you like to know?' 
    }
  ]);
  const [input, setInput] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const messagesEndRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [activeTool, setActiveTool] = useState('chat');

  const courses = [
    { id: 'CYBER101', name: 'Cyber Risk Management' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    setMessages(prev => [...prev, { type: 'user', content: input }]);
    setLoading(true);

    try {
        const response = await fetch('http://localhost:5000/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: input }),
        });
        const data = await response.json();
        setMessages(prev => [...prev, { type: 'bot', content: data.reply }]);
    } catch (error) {
        console.error('Error:', error);
        setMessages(prev => [...prev, { type: 'bot', content: 'Sorry, something went wrong.' }]);
    }

    setInput('');
    setLoading(false);
};

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-56 bg-white shadow-sm border-r">
        <div className="p-4">
          <select 
            className="w-full p-2 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
          >
            <option value="">Select Course...</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="px-2">
          <button 
            className={`flex items-center w-full p-3 mb-1 rounded-lg ${
              activeTool === 'chat' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
            }`}
            onClick={() => setActiveTool('chat')}
          >
            <MessageCircle className="w-5 h-5 mr-3" />
            Chat
          </button>
          <button 
            className={`flex items-center w-full p-3 mb-1 rounded-lg ${
              activeTool === 'content' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
            }`}
            onClick={() => setActiveTool('content')}
          >
            <Book className="w-5 h-5 mr-3" />
            Course Content
          </button>
          <button 
            className={`flex items-center w-full p-3 mb-1 rounded-lg ${
              activeTool === 'deadlines' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
            }`}
            onClick={() => setActiveTool('deadlines')}
          >
            <Calendar className="w-5 h-5 mr-3" />
            Deadlines
          </button>
          <button 
            className={`flex items-center w-full p-3 mb-1 rounded-lg ${
              activeTool === 'assignments' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
            }`}
            onClick={() => setActiveTool('assignments')}
          >
            <FileText className="w-5 h-5 mr-3" />
            Assignments
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white p-4 border-b">
          <h1 className="text-lg font-semibold">Course Assistant</h1>
          {selectedCourse && (
            <p className="text-sm text-gray-600">
              Currently viewing: {courses.find(c => c.id === selectedCourse)?.name || selectedCourse}
            </p>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-xl ${
                  message.type === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white shadow-sm border'
                }`}
                style={{ whiteSpace: 'pre-wrap' }}
              >
                {message.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start mb-4">
              <div className="bg-white shadow-sm border p-4 rounded-xl">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white border-t p-4">
          <div className="flex space-x-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about assignments, deadlines, or course materials..."
              className="flex-1 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSend}
              className="px-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}