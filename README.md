# Travel Genie

An AI-powered travel planning web application that generates personalized travel itineraries using GPT-4.

## Features

- Multi-destination trip planning
- Customizable trip duration and budget
- Interest-based activity recommendations
- Day-by-day itinerary with hotels, activities, and transport
- Edit functionality for itinerary sections
- Modern, responsive UI

## Tech Stack

- Frontend: React, Vite, Tailwind CSS
- Backend: Node.js, Express
- AI: OpenAI GPT-4

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- OpenAI API key

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_api_key_here
   PORT=3000
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

1. Enter your travel destinations (you can add multiple)
2. Specify your trip duration and budget
3. Select your interests from the provided options
4. Add any additional notes or preferences
5. Click "Generate Itinerary" to get your personalized travel plan
6. Edit specific sections of your itinerary as needed

## Project Structure

```
/travel-genie
│
├── /frontend
│   ├── /components
│   │   ├── TripForm.jsx
│   │   ├── ItineraryCard.jsx
│   │   ├── EditModal.jsx
│   │   └── Loader.jsx
│   ├── App.jsx
│   ├── index.jsx
│   └── tailwind.config.js
│
├── /backend
│   ├── server.js
│   └── .env
│
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 