import os
import json
# from openai import OpenAI
from groq import Groq
from typing import Dict, Any, List
import dotenv
import instructor
from pydantic import BaseModel, Field
import re
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize OpenAI client
dotenv.load_dotenv()
api_key = os.getenv("GROQ_API_KEY")
if not api_key:
    raise ValueError("GROQ_API_KEY environment variable is not set")

class TripDetails(BaseModel):
    flights: List[Dict[str, Any]] = Field(
        description="List of flights with origin, destination, airline, price and duration",
        example=[{
            "origin": "NYC",
            "destination": "Rome", 
            "airline": "SimAir",
            "price": 350,
            "duration": "9h"
        }]
    )
    hotels: List[Dict[str, Any]] = Field(
        description="List of hotels with name, price per night and rating",
        example=[{
            "city": "Rome",
            "name": "Hotel Roma Bliss",
            "price_per_night": 90,
            "rating": 4.5
        }]
    )
    attractions: List[Dict[str, Any]] = Field(
        description="List of attractions with name, type and cost",
        example=[{
            "city": "Rome", 
            "name": "Colosseum",
            "type": "historical",
            "cost": 20
        }]
    )
    restaurants: List[Dict[str, Any]] = Field(
        description="List of restaurants with name, cost estimate and type",
        example=[{
            "city": "Rome",
            "name": "Trattoria Romana",
            "cost_estimate": 25,
            "type": "Italian"
        }]
    )
    trip_duration: int = Field(
        description="The number of days for the trip",
        example=5
    )
    budget: int = Field(
        description="The total budget of the trip in USD",
        example=1000
    )

client = instructor.from_groq(Groq(api_key=api_key), mode=instructor.Mode.JSON)


# chat_completion = client.chat.completions.create(
#     messages=[
#         {
#             "role": "user",
#             "content": "Explain the importance of fast language models",
#         }
#     ],
#     model="llama-3.3-70b-versatile",
# )

# print(chat_completion.choices[0].message.content)

def load_sample_data() -> Dict[str, List[Dict[str, Any]]]:
    """Load all sample data from JSON files."""
    try:
        data_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "sample_data")
        print(data_dir)
        data = {}
        for filename in ["flights.json", "hotels.json", "attractions.json", "restaurants.json"]:
            file_path = os.path.join(data_dir, filename)
            if not os.path.exists(file_path):
                raise FileNotFoundError(f"Sample data file not found: {file_path}")
            with open(file_path, "r") as f:
                data[filename.split(".")[0]] = json.load(f)
        return data
    except Exception as e:
        logger.error(f"Error loading sample data: {str(e)}")
        raise

def extract_trip_details(message: str) -> Dict[str, Any]:
    """Extract structured trip details from user message using GPT."""
    try:
        prompt = f"""
        Extract the following information from this travel request: {message}
        Return ONLY a JSON object with these fields:
        - destination (string)
        - trip_duration (integer, number of days)
        - budget (integer, total budget in USD)
        - preferences (array of strings, any specific preferences mentioned)
        """
        
        response = client.chat.completions.create(
            model="deepseek-r1-distill-llama-70b",
            response_model=TripDetails,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.1
        )
        
        try:
            return response
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse GPT response as JSON: {str(e)}")
            raise ValueError("Failed to parse trip details from GPT response")
    except Exception as e:
        logger.error(f"Error in extract_trip_details: {str(e)}")
        raise

def generate_itinerary(message: str) -> Dict[str, Any]:
    """Generate a complete travel itinerary based on user message."""
    try:
        # Load sample data
        sample_data = load_sample_data()
        
        # Extract trip details
        trip_details = extract_trip_details(message)
        
        # Validate trip details
        if not trip_details.flights:
            raise ValueError("No flights found in the response")
        if not trip_details.hotels:
            raise ValueError("No hotels found in the response")
        if not trip_details.attractions:
            raise ValueError("No attractions found in the response")
        if not trip_details.restaurants:
            raise ValueError("No restaurants found in the response")
            
        destination = trip_details.flights[0]['destination']
        
        # Generate itinerary using GPT
        prompt = f"""
        Create a detailed and creative travel itinerary based on these requirements:
        Destination: {destination}
        Trip Duration: {trip_details.trip_duration} days
        Budget: ${trip_details.budget}

        Create a unique and engaging plan for each day with:
        1. Morning Activities (2-3 per day):
           - Cultural experiences (museums, historical sites)
           - Local landmarks and attractions
           - Guided tours or workshops
           - Morning markets or local experiences

        2. Afternoon Activities (1-2 per day):
           - Leisure activities (parks, gardens)
           - Shopping districts
           - Local neighborhoods exploration
           - Interactive experiences

        3. Evening Activities (1-2 per day):
           - Fine dining experiences
           - Local cuisine restaurants
           - Nightlife and entertainment
           - Cultural performances

        Guidelines:
        - Each day must have completely different activities and restaurants
        - No activity or restaurant should be repeated across days
        - Each day should have a different theme or focus
        - Activities should be logically sequenced (morning to evening)
        - Include a mix of popular attractions and hidden gems
        - Consider travel time between locations
        - Ensure activities are within budget
        - Add variety in activity types and experiences
        - Use real attractions and restaurants from the city
        - Only include meaningful, well-known locations
        - Ensure each activity has a proper description and context

        If you cannot find data for a certain field, generate appropriate data that meets the requirements.
        Make sure each day's plan is unique, interesting, and follows a logical flow.

        Return a JSON object with this structure:
        {{
            "destination": "string",
            "duration": integer,
            "budget": integer,
            "flights": [{{...}}],
            "hotels": [{{...}}],
            "daily_plan": [
                {{
                    "day": integer,
                    "theme": "string",
                    "activities": [
                        {{
                            "name": "string",
                            "type": "string",
                            "cost": number,
                            "time": "string",
                            "description": "string",
                            "duration": "string"
                        }}
                    ],
                    "hotel": "string",
                    "cost_estimate": integer
                }}
            ]
        }}
        """
        
        response = client.chat.completions.create(
            model="deepseek-r1-distill-llama-70b",
            response_model=TripDetails,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.8
        )
        
        # Validate response
        if not response.flights:
            raise ValueError("No flights found in the response")
        if not response.hotels:
            raise ValueError("No hotels found in the response")
        if not response.attractions:
            raise ValueError("No attractions found in the response")
        if not response.restaurants:
            raise ValueError("No restaurants found in the response")
            
        # Convert response to proper format
        itinerary = {
            "destination": response.flights[0]['destination'],
            "duration": response.trip_duration,
            "budget": response.budget,
            "flights": response.flights,
            "hotels": response.hotels,
            "daily_plan": []
        }

        # Generate unique daily plans with themes
        themes = [
            "Cultural Exploration",
            "Historical Journey",
            "Local Experiences",
            "Art and Architecture",
            "Food and Culture",
            "Hidden Gems",
            "Nature and Relaxation"
        ]

        # Create sets to track used items
        used_attractions = set()
        used_restaurants = set()

        # Ensure we have enough activities for all days
        required_attractions = response.trip_duration * 4  # 3-4 attractions per day
        required_restaurants = response.trip_duration * 2  # 1-2 restaurants per day

        # If we don't have enough attractions, generate more meaningful ones
        while len(response.attractions) < required_attractions:
            # Get a list of common attractions for the destination
            common_attractions = {
                "Paris": [
                    {"name": "Eiffel Tower", "type": "landmark", "cost": 20, "description": "Iconic iron tower offering panoramic city views"},
                    {"name": "Louvre Museum", "type": "museum", "cost": 25, "description": "World's largest art museum and historic monument"},
                    {"name": "Notre Dame Cathedral", "type": "historical", "cost": 0, "description": "Gothic masterpiece with stunning architecture"},
                    {"name": "Montmartre", "type": "cultural", "cost": 0, "description": "Historic district known for its artistic heritage"},
                    {"name": "Seine River Cruise", "type": "sightseeing", "cost": 15, "description": "Scenic boat tour along the Seine River"},
                    {"name": "Musée d'Orsay", "type": "museum", "cost": 16, "description": "Impressionist and post-impressionist masterpieces"},
                    {"name": "Luxembourg Gardens", "type": "park", "cost": 0, "description": "Beautiful public park with fountains and statues"},
                    {"name": "Palace of Versailles", "type": "historical", "cost": 20, "description": "Opulent royal palace with magnificent gardens"}
                ],
                "Rome": [
                    {"name": "Colosseum", "type": "historical", "cost": 20, "description": "Ancient amphitheater and iconic symbol of Rome"},
                    {"name": "Vatican Museums", "type": "museum", "cost": 25, "description": "Extensive collection of art and historical artifacts"},
                    {"name": "Trevi Fountain", "type": "landmark", "cost": 0, "description": "Baroque masterpiece and famous wishing fountain"},
                    {"name": "Roman Forum", "type": "historical", "cost": 15, "description": "Ancient ruins of Rome's political and social center"},
                    {"name": "Pantheon", "type": "historical", "cost": 0, "description": "Best-preserved ancient Roman building"},
                    {"name": "Spanish Steps", "type": "landmark", "cost": 0, "description": "Famous staircase and meeting place"},
                    {"name": "Villa Borghese", "type": "park", "cost": 15, "description": "Large public park with museums and gardens"},
                    {"name": "Piazza Navona", "type": "cultural", "cost": 0, "description": "Beautiful square with fountains and street artists"}
                ],
                "Madrid": [
                    {"name": "Prado Museum", "type": "museum", "cost": 15, "description": "One of the world's finest art museums"},
                    {"name": "Royal Palace", "type": "historical", "cost": 12, "description": "Official residence of the Spanish Royal Family"},
                    {"name": "Retiro Park", "type": "park", "cost": 0, "description": "Large park with gardens, monuments, and a lake"},
                    {"name": "Plaza Mayor", "type": "cultural", "cost": 0, "description": "Historic central square with beautiful architecture"},
                    {"name": "Reina Sofía Museum", "type": "museum", "cost": 10, "description": "Modern art museum featuring Picasso's Guernica"},
                    {"name": "Gran Vía", "type": "shopping", "cost": 0, "description": "Famous shopping street with impressive architecture"},
                    {"name": "Temple of Debod", "type": "historical", "cost": 0, "description": "Ancient Egyptian temple with sunset views"},
                    {"name": "Santiago Bernabéu Stadium", "type": "sports", "cost": 25, "description": "Home of Real Madrid football club"}
                ],
                "Athens": [
                    {"name": "Acropolis", "type": "historical", "cost": 20, "description": "Ancient citadel with iconic Parthenon temple"},
                    {"name": "Acropolis Museum", "type": "museum", "cost": 15, "description": "Modern museum showcasing Acropolis artifacts"},
                    {"name": "Ancient Agora", "type": "historical", "cost": 10, "description": "Ancient marketplace and civic center"},
                    {"name": "Temple of Olympian Zeus", "type": "historical", "cost": 8, "description": "Massive ancient temple ruins"},
                    {"name": "Plaka District", "type": "cultural", "cost": 0, "description": "Historic neighborhood with charming streets"},
                    {"name": "National Archaeological Museum", "type": "museum", "cost": 12, "description": "Largest archaeological museum in Greece"},
                    {"name": "Mount Lycabettus", "type": "nature", "cost": 0, "description": "Hill with panoramic city views"},
                    {"name": "Panathenaic Stadium", "type": "historical", "cost": 5, "description": "Ancient stadium used in first modern Olympics"}
                ]
            }
            
            if destination in common_attractions:
                for attraction in common_attractions[destination]:
                    if attraction['name'] not in used_attractions and len(response.attractions) < required_attractions:
                        new_attraction = {
                            "city": destination,
                            "name": attraction['name'],
                            "type": attraction['type'],
                            "cost": attraction['cost'],
                            "description": attraction['description']
                        }
                        response.attractions.append(new_attraction)

        # If we don't have enough restaurants, generate more meaningful ones
        while len(response.restaurants) < required_restaurants:
            # Get a list of common restaurants for the destination
            common_restaurants = {
                "Paris": [
                    {"name": "Le Jules Verne", "type": "French", "cost_estimate": 150, "description": "Michelin-starred restaurant in the Eiffel Tower"},
                    {"name": "Le Comptoir du Relais", "type": "French", "cost_estimate": 30, "description": "Popular bistro serving classic French cuisine"},
                    {"name": "Breizh Café", "type": "Creperie", "cost_estimate": 20, "description": "Authentic Breton crepes and galettes"},
                    {"name": "L'Ambroisie", "type": "French", "cost_estimate": 200, "description": "Three-Michelin-starred restaurant"},
                    {"name": "Bouillon Pigalle", "type": "French", "cost_estimate": 25, "description": "Modern take on traditional French cuisine"}
                ],
                "Rome": [
                    {"name": "La Pergola", "type": "Italian", "cost_estimate": 200, "description": "Three-Michelin-starred restaurant with panoramic views"},
                    {"name": "Roscioli", "type": "Italian", "cost_estimate": 40, "description": "Famous for its pasta and wine selection"},
                    {"name": "Da Enzo al 29", "type": "Italian", "cost_estimate": 30, "description": "Traditional Roman trattoria"},
                    {"name": "Armando al Pantheon", "type": "Italian", "cost_estimate": 35, "description": "Historic restaurant near the Pantheon"},
                    {"name": "Pizzarium", "type": "Pizza", "cost_estimate": 15, "description": "Renowned for its gourmet pizza by the slice"}
                ],
                "Madrid": [
                    {"name": "DiverXO", "type": "Spanish", "cost_estimate": 200, "description": "Three-Michelin-starred avant-garde restaurant"},
                    {"name": "Casa Lucio", "type": "Spanish", "cost_estimate": 40, "description": "Famous for its huevos rotos (broken eggs)"},
                    {"name": "Botín", "type": "Spanish", "cost_estimate": 35, "description": "World's oldest restaurant, serving traditional cuisine"},
                    {"name": "Mercado de San Miguel", "type": "Market", "cost_estimate": 25, "description": "Historic food market with various tapas"},
                    {"name": "Sobrino de Botín", "type": "Spanish", "cost_estimate": 30, "description": "Historic restaurant known for its suckling pig"}
                ],
                "Athens": [
                    {"name": "Varoulko Seaside", "type": "Greek", "cost_estimate": 60, "description": "Michelin-starred seafood restaurant"},
                    {"name": "Ta Karamanlidika tou Fani", "type": "Greek", "cost_estimate": 25, "description": "Traditional Greek deli and restaurant"},
                    {"name": "Oinomageiremata", "type": "Greek", "cost_estimate": 20, "description": "Local taverna with authentic Greek dishes"},
                    {"name": "Kuzina", "type": "Greek", "cost_estimate": 35, "description": "Modern Greek cuisine with Acropolis views"},
                    {"name": "Avocado", "type": "Vegetarian", "cost_estimate": 20, "description": "Popular vegetarian restaurant with Greek influences"}
                ]
            }
            
            if destination in common_restaurants:
                for restaurant in common_restaurants[destination]:
                    if restaurant['name'] not in used_restaurants and len(response.restaurants) < required_restaurants:
                        new_restaurant = {
                            "city": destination,
                            "name": restaurant['name'],
                            "type": restaurant['type'],
                            "cost_estimate": restaurant['cost_estimate'],
                            "description": restaurant['description']
                        }
                        response.restaurants.append(new_restaurant)

        for day in range(1, response.trip_duration + 1):
            # Select a theme for the day
            theme = themes[(day - 1) % len(themes)]
            
            # Create a mix of activities for each day
            day_activities = []
            
            # Get available attractions (not used yet)
            available_attractions = [a for a in response.attractions if a['name'] not in used_attractions]
            
            # Morning activities (2-3)
            morning_count = min(3, len(available_attractions))
            morning_activities = available_attractions[:morning_count]
            for activity in morning_activities:
                day_activities.append({
                    "name": activity['name'],
                    "type": activity['type'],
                    "cost": activity['cost'],
                    "time": "Morning",
                    "description": activity.get('description', f"Start your day by visiting {activity['name']}, a {activity['type']} attraction. {get_activity_description(activity['type'])}"),
                    "duration": "2-3 hours"
                })
                used_attractions.add(activity['name'])
            
            # Afternoon activities (1-2)
            available_attractions = [a for a in response.attractions if a['name'] not in used_attractions]
            if len(available_attractions) > 0:
                afternoon_count = min(2, len(available_attractions))
                afternoon_activities = available_attractions[:afternoon_count]
                for activity in afternoon_activities:
                    day_activities.append({
                        "name": activity['name'],
                        "type": activity['type'],
                        "cost": activity['cost'],
                        "time": "Afternoon",
                        "description": activity.get('description', f"After lunch, explore {activity['name']}, known for its {activity['type']} significance. {get_activity_description(activity['type'])}"),
                        "duration": "2-3 hours"
                    })
                    used_attractions.add(activity['name'])
            
            # Get available restaurants (not used yet)
            available_restaurants = [r for r in response.restaurants if r['name'] not in used_restaurants]
            
            # Evening activities (1-2 restaurants)
            if len(available_restaurants) > 0:
                evening_count = min(2, len(available_restaurants))
                evening_activities = available_restaurants[:evening_count]
                for activity in evening_activities:
                    day_activities.append({
                        "name": activity['name'],
                        "type": "dining",
                        "cost": activity['cost_estimate'],
                        "time": "Evening",
                        "description": activity.get('description', f"End your day with a delightful dinner at {activity['name']}, a {activity['type']} restaurant offering authentic local cuisine."),
                        "duration": "1-2 hours"
                    })
                    used_restaurants.add(activity['name'])
            
            # Calculate daily cost estimate
            daily_cost = sum(act['cost'] for act in day_activities) + response.hotels[0]['price_per_night']
            
            # Add the day plan to the itinerary
            itinerary["daily_plan"].append({
                "day": day,
                "theme": theme,
                "activities": day_activities,
                "hotel": response.hotels[0]['name'],
                "cost_estimate": daily_cost
            })
        
        return itinerary
    except Exception as e:
        logger.error(f"Error in generate_itinerary: {str(e)}")
        raise ValueError(f"Failed to generate itinerary: {str(e)}")

def get_activity_description(activity_type: str) -> str:
    """Generate a descriptive text for different activity types."""
    descriptions = {
        "historical": "Immerse yourself in the rich history and learn about the fascinating stories behind this iconic landmark.",
        "cultural": "Experience the local culture and traditions through this unique cultural attraction.",
        "landmark": "Take in the breathtaking views and capture memorable moments at this famous landmark.",
        "museum": "Explore the extensive collections and discover the artistic and historical treasures.",
        "park": "Enjoy a peaceful stroll and take in the beautiful natural surroundings.",
        "shopping": "Browse through local shops and find unique souvenirs and gifts.",
        "dining": "Savor the authentic flavors and experience the local culinary traditions."
    }
    return descriptions.get(activity_type.lower(), "Enjoy this unique experience and create lasting memories.")

## NEXT: MAKE SURE RESPONSE IS CONSISTENT / INTEGRARE WITH UI


# print(generate_itinerary("I want to go to France for the duration of 5 days with a budget of $1000"))