import React, { useState } from 'react';
import ChatPanel from './components/ChatPanel';
import ItineraryDisplay from './components/ItineraryDisplay';
import './App.css';

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

function App() {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);

  return (
    <div className="app">
      <header>
        <h1>Smart Travel Planner</h1>
      </header>
      <main>
        <div className="chat-section">
          <ChatPanel onItineraryGenerated={setItinerary} />
        </div>
        <div className="itinerary-section">
          <ItineraryDisplay itinerary={itinerary} />
        </div>
      </main>
    </div>
  );
}

export default App; 