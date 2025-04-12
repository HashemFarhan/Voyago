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
        - duration (integer, number of days)
        - budget (integer, total budget in USD)
        - preferences (array of strings, any specific preferences mentioned)
        """
        
        response = client.chat.completions.create(
            # model="llama-3.3-70b-versatile",
            model="deepseek-r1-distill-llama-70b",
            response_model=TripDetails,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.1
        )
        
        try:
            print('RESPONSE2', response)
            print()
            print(response.flights)
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
        
        # Generate itinerary using GPT
        prompt = f"""
        Create a detailed travel itinerary based on these requirements:
        Destination: {trip_details.flights[0]['destination']}
    Duration: {trip_details.flights[0]['length']} days
        Budget: ${trip_details.budget}

        If you cannot find data for a certain field, generate random data that meets the requirements. and add it to the sample data. 
        if random data is generated, still return the data in the correct format. Make sure data meets the required format.
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
                    "activities": ["string"],
                    "hotel": "string",
                    "cost_estimate": integer
                }}
            ]
        }}
        """
        
        response = client.chat.completions.create(
            # model="llama-3.3-70b-versatile",
            model="deepseek-r1-distill-llama-70b",
            response_model=TripDetails,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7
        )
        
        # Convert response to proper format
        itinerary = {
            "destination": response.flights[0]['destination'],
            "duration": response.flights[0]['length'],
            "budget": response.budget,
            "flights": response.flights,
            "hotels": response.hotels,
            "daily_plan": [
                {
                    "day": i + 1,
                    "activities": [
                        f"Visit {attraction['name']}" for attraction in response.attractions
                    ],
                    "hotel": response.hotels[0]['name'],
                    "cost_estimate": sum(att['cost'] for att in response.attractions) + response.hotels[0]['price_per_night']
                }
                for i in range(int(response.flights[0]['length']))
            ]
        }
        
        return itinerary
    except Exception as e:
        logger.error(f"Error in generate_itinerary: {str(e)}")
        raise

## NEXT: MAKE SURE RESPONSE IS CONSISTENT / INTEGRARE WITH UI


print("NKJNKJNK")
print(generate_itinerary("I want to go to France for the duration of 5 days with a budget of $1000"))