export const sampleItinerary = {
  destination: "Rome, Italy",
  duration: 3,
  budget: 2000,
  flights: [
    {
      from: "New York (JFK)",
      to: "Rome (FCO)",
      airline: "Alitalia",
      price: 750,
      departure: "2024-05-01T10:00:00",
      arrival: "2024-05-02T02:30:00"
    }
  ],
  hotels: [
    {
      name: "Hotel de la Ville",
      location: "Via Sistina 69, Rome",
      price_per_night: 200,
      rating: 4.5,
      amenities: ["WiFi", "Breakfast", "Pool", "Spa"]
    }
  ],
  daily_itinerary: [
    {
      day: 1,
      date: "2024-05-02",
      activities: [
        {
          time: "09:00",
          activity: "Colosseum Tour",
          duration: "3 hours",
          cost: 45,
          description: "Guided tour of the ancient Roman Colosseum and Forum"
        },
        {
          time: "13:00",
          activity: "Lunch at La Pergola",
          duration: "1.5 hours",
          cost: 50,
          description: "Traditional Roman cuisine at a local favorite"
        },
        {
          time: "15:00",
          activity: "Pantheon Visit",
          duration: "1 hour",
          cost: 0,
          description: "Self-guided tour of the historic Pantheon"
        }
      ],
      hotel: "Hotel de la Ville",
      transport: "Walking and Metro",
      estimated_cost: 95
    },
    {
      day: 2,
      date: "2024-05-03",
      activities: [
        {
          time: "08:30",
          activity: "Vatican Museums",
          duration: "4 hours",
          cost: 65,
          description: "Skip-the-line tour of Vatican Museums and Sistine Chapel"
        },
        {
          time: "13:30",
          activity: "Lunch at Lela's",
          duration: "1 hour",
          cost: 30,
          description: "Light lunch near Vatican City"
        },
        {
          time: "15:00",
          activity: "Spanish Steps",
          duration: "2 hours",
          cost: 0,
          description: "Walking tour and shopping around Spanish Steps"
        }
      ],
      hotel: "Hotel de la Ville",
      transport: "Metro and Walking",
      estimated_cost: 95
    },
    {
      day: 3,
      date: "2024-05-04",
      activities: [
        {
          time: "09:00",
          activity: "Trevi Fountain",
          duration: "1 hour",
          cost: 0,
          description: "Visit and photo opportunity at the famous fountain"
        },
        {
          time: "11:00",
          activity: "Villa Borghese",
          duration: "3 hours",
          cost: 35,
          description: "Art gallery visit and garden tour"
        },
        {
          time: "15:00",
          activity: "Food Tour",
          duration: "3 hours",
          cost: 85,
          description: "Guided food tasting tour in Trastevere"
        }
      ],
      hotel: "Hotel de la Ville",
      transport: "Walking",
      estimated_cost: 120
    }
  ],
  total_cost: 1510
}; 