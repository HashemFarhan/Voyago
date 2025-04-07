import { useState, useRef, useEffect } from 'react';
import groqService from '../services/groqService';

const ChatInterface = ({ itinerary, onItineraryUpdate, loading, error }) => {
  const [messages, setMessages] = useState([
    {
      type: 'system',
      content: 'Hi! I\'m your AI travel assistant. Ask me anything about planning your trip!'
    }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userMessage = input;
    setInput('');
    setIsProcessing(true);

    // Add user message to chat
    setMessages(prev => [...prev, {
      type: 'user',
      content: userMessage
    }]);

    try {
      // Process the request using Groq
      const updatedItinerary = await groqService.processUserRequest(userMessage, itinerary);
      
      // Update the itinerary in the parent component
      onItineraryUpdate(updatedItinerary);

      // Add success message
      setMessages(prev => [...prev, {
        type: 'system',
        content: 'I\'ve updated your itinerary based on your request!'
      }]);
    } catch (err) {
      console.error('Error processing request:', err);
      setMessages(prev => [...prev, {
        type: 'error',
        content: 'Sorry, I couldn\'t process your request. Please try again.'
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const suggestionQueries = [
    "Add a museum visit to day 2",
    "Update my budget to $5000",
    "Add a dinner reservation for day 3"
  ];

  return (
    <>
      <div className="messages-container custom-scrollbar">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.type === 'user' ? 'message-user' : 'message-system'}`}
          >
            <div className={`message-content ${message.type === 'error' ? 'message-error' : ''}`}>
              {message.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length === 1 && (
        <div className="p-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Try asking:</p>
          <div className="space-y-2">
            {suggestionQueries.map((query, index) => (
              <button
                key={index}
                onClick={() => {
                  setInput(query);
                  handleSubmit({ preventDefault: () => {} });
                }}
                className="block w-full text-left text-sm text-gray-800 hover:bg-gray-100 p-2 rounded"
              >
                {query}
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="chat-input-form">
        <div className="input-group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your trip..."
            className="input-field"
            disabled={isProcessing}
          />
          <button
            type="submit"
            disabled={isProcessing}
            className={`btn ${isProcessing ? 'btn-disabled' : 'btn-primary'}`}
          >
            {isProcessing ? '...' : 'Send'}
          </button>
        </div>
        {error && (
          <p className="error-text">{error}</p>
        )}
      </form>
    </>
  );
};

export default ChatInterface; 