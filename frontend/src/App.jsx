import { useState } from 'react'
import ChatInterface from './components/ChatInterface'
import ItineraryView from './components/ItineraryView'
import './styles/main.css'

function App() {
  const [error, setError] = useState(null)
  const [itinerary, setItinerary] = useState({
    budget: 3000,
    duration: 5,
    total_cost: 2500,
    destinations: ['Paris'],
    flights: [
      {
        airline: "Sample Airlines",
        from: "New York",
        to: "Paris",
        price: 800
      }
    ],
    hotels: [
      {
        name: "Sample Hotel",
        location: "Paris City Center",
        rating: 4.5,
        price_per_night: 200,
        amenities: ["WiFi", "Pool", "Breakfast"]
      }
    ],
    daily_itinerary: [
      {
        day: 1,
        date: "2024-03-20",
        activities: [
          {
            time: "09:00",
            activity: "Eiffel Tower Visit",
            description: "Guided tour of the Eiffel Tower",
            duration: "2 hours",
            cost: 25
          }
        ],
        transport: "Metro",
        estimated_cost: 50
      }
    ]
  })

  const handleItineraryUpdate = (updatedItinerary) => {
    try {
      setItinerary(updatedItinerary)
      setError(null)
    } catch (err) {
      console.error('Error updating itinerary:', err)
      setError('Failed to update itinerary. Please try again.')
    }
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={() => setError(null)} className="btn btn-primary">
          Dismiss
        </button>
      </div>
    )
  }

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="container navbar-content">
          <h1 className="navbar-title">Travel Genie</h1>
          <div className="navbar-actions">
            <span className="destination-text">
              {itinerary.destinations?.[0] || 'Your Perfect Trip Awaits'}
            </span>
            <button className="btn btn-white">New Trip</button>
          </div>
        </div>
      </nav>

      <main className="container main-content">
        <div className="layout-grid">
          {/* Left side - Chat Interface */}
          <div className="chat-section">
            <div className="chat-container">
              <ChatInterface 
                itinerary={itinerary}
                onItineraryUpdate={handleItineraryUpdate}
                error={error}
              />
            </div>
          </div>

          {/* Right side - Itinerary View */}
          <div className="itinerary-section">
            <ItineraryView 
              itinerary={itinerary}
              onEdit={(dayNumber, edits) => {
                // Handle edit functionality
                console.log('Editing day', dayNumber, edits)
              }}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
