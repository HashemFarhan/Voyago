import React, { useState } from 'react';
import axios from 'axios';
import styles from './ChatPanel.module.css';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Activity {
  name: string;
  type: string;
  cost: number;
  time: string;
  description: string;
  duration: string;
}

interface DayPlan {
  day: number;
  theme: string;
  activities: Activity[];
  hotel: string;
  cost_estimate: number;
}

interface Itinerary {
  destination: string;
  duration: number;
  budget: number;
  flights: Array<{
    origin: string;
    destination: string;
    airline: string;
    price: number;
    duration: string;
  }>;
  hotels: Array<{
    name: string;
    price_per_night: number;
    rating: number;
  }>;
  daily_plan: DayPlan[];
}

interface ChatPanelProps {
  onItineraryGenerated: (itinerary: Itinerary) => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ onItineraryGenerated }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const formatItineraryMessage = (itinerary: Itinerary): string => {
    let message = `✨ I've created a ${itinerary.duration}-day itinerary for ${itinerary.destination}! ✨\n\n`;
    message += `💰 Total Budget: $${itinerary.budget}\n\n`;
    message += `✈️ Flight: ${itinerary.flights[0].airline} from ${itinerary.flights[0].origin} to ${itinerary.flights[0].destination} ($${itinerary.flights[0].price})\n\n`;
    message += `🏨 Hotel: ${itinerary.hotels[0].name} ($${itinerary.hotels[0].price_per_night}/night)\n\n`;
    message += "📅 Daily Plan:\n";
    itinerary.daily_plan.forEach(day => {
      message += `\nDay ${day.day}:\n`;
      message += `🏨 Hotel: ${day.hotel}\n`;
      message += `🎯 Activities:\n`;
      day.activities.forEach(act => {
        if (typeof act === 'string') {
          message += `- ${act}\n`;
        } else {
          message += `- ${act.name} ($${act.cost})\n`;
        }
      });
      message += `💵 Estimated Cost: $${day.cost_estimate}\n`;
    });
    return message;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/generate-itinerary', {
        message: input
      });

      if (response.data) {
        const itinerary = response.data as Itinerary;
        const assistantMessage: Message = {
          role: 'assistant',
          content: formatItineraryMessage(itinerary)
        };
        setMessages(prev => [...prev, assistantMessage]);
        onItineraryGenerated(itinerary);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error generating itinerary:', error);
      const errorMessage: Message = {
        role: 'assistant', 
        content: 'Sorry, there was an error generating your itinerary. Please try again with a different request.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.chatPanel}>
      <div className={styles.chatHistory}>
        {messages.map((message, index) => (
          <div key={index} className={`${styles.message} ${styles[message.role]}`}>
            {message.content.split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </div>
        ))}
        {isLoading && <div className={`${styles.message} ${styles.assistant}`}>✨ Generating your perfect itinerary... ✨</div>}
      </div>
      <form onSubmit={handleSubmit} className={styles.chatInput}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your travel request (e.g., 'Plan a 4 day trip to Rome with a budget of $600')"
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Planning...' : 'Plan Trip'}
        </button>
      </form>
    </div>
  );
};

export default ChatPanel; 