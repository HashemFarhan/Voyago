import React, { useState } from 'react';
import styles from './ItineraryDisplay.module.css';

interface Activity {
  name: string;
  type: string;
  cost: number;
}

interface DayPlan {
  day: number;
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

interface ItineraryDisplayProps {
  itinerary: Itinerary | null;
}

const ItineraryDisplay: React.FC<ItineraryDisplayProps> = ({ itinerary }) => {
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  if (!itinerary) {
    return (
      <div className={`${styles.itineraryDisplay} ${styles.empty}`}>
        <div className={styles.emptyContent}>
          <h2>✨ Your Travel Itinerary</h2>
          <p>Start planning your trip by entering your travel request in the chat!</p>
        </div>
      </div>
    );
  }

  const toggleDay = (day: number) => {
    setExpandedDay(expandedDay === day ? null : day);
  };

  return (
    <div className={styles.itineraryDisplay}>
      <div className={styles.itineraryHeader}>
        <h2>✨ {itinerary.destination} Itinerary ✨</h2>
        <div className={styles.tripSummary}>
          <div className={styles.summaryCard}>
            <span className={styles.summaryLabel}>Duration</span>
            <span className={styles.summaryValue}>{itinerary.duration} days</span>
          </div>
          <div className={styles.summaryCard}>
            <span className={styles.summaryLabel}>Budget</span>
            <span className={styles.summaryValue}>${itinerary.budget}</span>
          </div>
        </div>
      </div>

      <div className={styles.flightsSection}>
        <h3>✈️ Flights</h3>
        {itinerary.flights.map((flight, index) => (
          <div key={index} className={styles.flightCard}>
            <div className={styles.flightHeader}>
              <span className={styles.airline}>{flight.airline}</span>
              <span className={styles.price}>${flight.price}</span>
            </div>
            <div className={styles.flightRoute}>
              <span className={styles.origin}>{flight.origin}</span>
              <span className={styles.arrow}>→</span>
              <span className={styles.destination}>{flight.destination}</span>
            </div>
            <div className={styles.flightDuration}>
              <span>⏱️ {flight.duration}</span>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.dailyPlans}>
        {itinerary.daily_plan.map((dayPlan) => (
          <div 
            key={dayPlan.day} 
            className={`${styles.dayCard} ${expandedDay === dayPlan.day ? styles.expanded : ''}`}
            onClick={() => toggleDay(dayPlan.day)}
          >
            <div className={styles.dayHeader}>
              <h3>Day {dayPlan.day}</h3>
              <div className={styles.daySummary}>
                <span className={styles.hotelName}>🏨 {dayPlan.hotel}</span>
                <span className={styles.costEstimate}>💵 ${dayPlan.cost_estimate}</span>
              </div>
            </div>
            
            <div className={styles.dayContent}>
              <div className={styles.activities}>
                <h4>🎯 Activities</h4>
                <ul>
                  {dayPlan.activities.map((activity, index) => (
                    <li key={index} className={styles.activityItem}>
                      <span className={styles.activityName}>{activity.name}</span>
                      <span className={styles.activityCost}>${activity.cost}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItineraryDisplay; 