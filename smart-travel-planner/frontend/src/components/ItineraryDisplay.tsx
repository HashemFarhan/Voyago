import React from 'react';
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
  if (!itinerary) {
    return (
      <div className={`${styles.itineraryDisplay} ${styles.empty}`}>
        <p>Your travel itinerary will appear here</p>
      </div>
    );
  }

  return (
    <div className={styles.itineraryDisplay}>
      <div className={styles.itineraryHeader}>
        <h2>{itinerary.destination} Itinerary</h2>
        <div className={styles.tripSummary}>
          <p>Duration: {itinerary.duration} days</p>
          <p>Budget: ${itinerary.budget}</p>
        </div>
      </div>

      <div className={styles.flightsSection}>
        <h3>Flights</h3>
        {itinerary.flights.map((flight, index) => (
          <div key={index} className={styles.flightCard}>
            <p>{flight.airline}</p>
            <p>{flight.origin} → {flight.destination}</p>
            <p>Price: ${flight.price}</p>
            <p>Duration: {flight.duration}</p>
          </div>
        ))}
      </div>

      <div className={styles.dailyPlans}>
        {itinerary.daily_plan.map((dayPlan) => (
          <div key={dayPlan.day} className={styles.dayCard}>
            <h3>Day {dayPlan.day}</h3>
            <div className={styles.hotelInfo}>
              <h4>Hotel: {dayPlan.hotel}</h4>
            </div>
            <div className={styles.activities}>
              <h4>Activities:</h4>
              <ul>
                {dayPlan.activities.map((activity, index) => (
                  <li key={index}>
                    {activity.name} (${activity.cost})
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.daySummary}>
              <p>Estimated Cost: ${dayPlan.cost_estimate}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItineraryDisplay; 