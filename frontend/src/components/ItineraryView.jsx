import { useState } from 'react';

const ItineraryView = ({ itinerary, onEdit }) => {
  const [expandedDay, setExpandedDay] = useState(1);

  if (!itinerary) return null;

  return (
    <div>
      {/* Summary Cards */}
      <div className="itinerary-summary">
        <div className="summary-card">
          <div className="summary-label">Total Budget</div>
          <div className="summary-value">${itinerary.budget}</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">Duration</div>
          <div className="summary-value">{itinerary.duration} days</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">Total Cost</div>
          <div className="summary-value">${itinerary.total_cost}</div>
        </div>
      </div>

      {/* Flight Information */}
      {itinerary.flights && itinerary.flights.length > 0 && (
        <div className="flight-card">
          <div className="flight-header">Flight Details</div>
          {itinerary.flights.map((flight, index) => (
            <div key={index} className="flight-route">
              <div>
                <div className="flight-airline">{flight.airline}</div>
                <div>{flight.from} <span className="flight-arrow">→</span> {flight.to}</div>
              </div>
              <div className="activity-cost">${flight.price}</div>
            </div>
          ))}
        </div>
      )}

      {/* Hotel Information */}
      {itinerary.hotels && itinerary.hotels.length > 0 && (
        <div className="hotel-card">
          <div className="hotel-header">Hotel</div>
          {itinerary.hotels.map((hotel, index) => (
            <div key={index}>
              <div className="hotel-name">{hotel.name}</div>
              <div className="hotel-location">{hotel.location}</div>
              <div className="hotel-rating">
                <span>★</span>
                <span>{hotel.rating}</span>
              </div>
              <div>${hotel.price_per_night}/night</div>
              <div className="hotel-amenities">
                {hotel.amenities.map((amenity, i) => (
                  <span key={i} className="amenity-tag">{amenity}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Daily Itinerary */}
      <div>
        <h3 className="day-title">Daily Itinerary</h3>
        {itinerary.daily_itinerary.map((day) => (
          <div key={day.day} className="itinerary-day">
            {/* Day Header */}
            <div
              className={`day-header ${expandedDay === day.day ? 'active' : ''}`}
              onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
            >
              <div className="day-header-content">
                <div>
                  <div className="day-title">Day {day.day}</div>
                  <div className="day-date">{day.date}</div>
                </div>
                <div className="day-cost">${day.estimated_cost}</div>
              </div>
            </div>

            {/* Day Details */}
            {expandedDay === day.day && (
              <div className="day-details">
                <div className="activity-timeline">
                  {day.activities.map((activity, index) => (
                    <div key={index} className="activity-item">
                      <div className="activity-time">{activity.time}</div>
                      <div className="activity-title">{activity.activity}</div>
                      <div className="activity-description">{activity.description}</div>
                      <div className="activity-duration">{activity.duration}</div>
                      {activity.cost > 0 && (
                        <div className="activity-cost">${activity.cost}</div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="transport-info">
                  <span className="font-medium">Transport:</span> {day.transport}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItineraryView; 