# Smart Travel Planner

A modern travel planning application that uses AI to generate personalized travel itineraries based on user preferences.

## Features

- Natural language input for travel requests
- AI-powered itinerary generation
- Interactive itinerary display
- Sample data integration
- Modern, responsive UI

## Tech Stack

### Frontend
- React with TypeScript
- CSS for styling
- Axios for HTTP requests

### Backend
- Python 3.10+
- FastAPI
- OpenAI GPT-4
- Uvicorn

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - Windows:
     ```bash
     .\venv\Scripts\activate
     ```
   - Unix/MacOS:
     ```bash
     source venv/bin/activate
     ```

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Create a `.env` file in the backend directory with your OpenAI API key:
   ```
   OPENAI_API_KEY=your-api-key-here
   ```

6. Start the backend server:
   ```bash
   uvicorn main:app --reload
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

## Usage

1. Open your browser and navigate to `http://localhost:5173`
2. Type your travel request in the chat interface (e.g., "Plan a 4 day trip to Rome with a budget of $600")
3. Wait for the AI to generate your personalized itinerary
4. View and interact with your generated travel plan

## Project Structure

```
smart-travel-planner/
├── frontend/            # React + TypeScript app
├── backend/             # FastAPI + Python backend
├── sample_data/         # JSON files with simulated travel data
└── README.md
```

## Contributing

Feel free to submit issues and enhancement requests! 