// import { Groq } from '@groq/groq-sdk';

import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: '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',
  dangerouslyAllowBrowser: true // Enable browser usage
});

// Define the schema for our itinerary updates
const ITINERARY_SCHEMA = {
  type: 'object',
  properties: {
    action: {
      type: 'string',
      enum: ['add_activity', 'remove_activity', 'modify_activity', 'update_budget', 'add_destination']
    },
    day: {
      type: 'number',
      description: 'The day number to modify'
    },
    details: {
      type: 'object',
      properties: {
        activity: { type: 'string' },
        time: { type: 'string' },
        duration: { type: 'string' },
        cost: { type: 'number' },
        description: { type: 'string' }
      }
    }
  },
  required: ['action']
};

const systemPrompt = `You are a travel planning assistant. Your task is to help modify and improve travel itineraries.
When users make requests, analyze them and return a JSON response that follows this schema:
${JSON.stringify(ITINERARY_SCHEMA, null, 2)}

Always return valid JSON that matches the schema. Include relevant details based on the user's request.
If the request requires multiple changes, return an array of changes.`;

export async function processUserRequest(userMessage, currentItinerary) {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: `Current itinerary: ${JSON.stringify(currentItinerary)}\n\nUser request: ${userMessage}`
        }
      ],
      model: 'llama2-70b-4096',
      temperature: 0.7,
      max_tokens: 2000,
      top_p: 1,
      stream: false
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from API');
    }

    // Parse the response and validate it against our schema
    const updates = JSON.parse(response);
    return applyUpdatesToItinerary(currentItinerary, updates);
  } catch (error) {
    console.error('Error processing request:', error);
    throw error;
  }
}

function applyUpdatesToItinerary(itinerary, updates) {
  const updatedItinerary = { ...itinerary };
  const updateArray = Array.isArray(updates) ? updates : [updates];

  updateArray.forEach(update => {
    switch (update.action) {
      case 'add_activity':
        if (!updatedItinerary.daily_itinerary[update.day - 1]) {
          updatedItinerary.daily_itinerary[update.day - 1] = {
            day: update.day,
            activities: []
          };
        }
        updatedItinerary.daily_itinerary[update.day - 1].activities.push(update.details);
        break;

      case 'remove_activity':
        if (updatedItinerary.daily_itinerary[update.day - 1]) {
          updatedItinerary.daily_itinerary[update.day - 1].activities = 
            updatedItinerary.daily_itinerary[update.day - 1].activities.filter(
              activity => activity.activity !== update.details.activity
            );
        }
        break;

      case 'modify_activity':
        if (updatedItinerary.daily_itinerary[update.day - 1]) {
          updatedItinerary.daily_itinerary[update.day - 1].activities = 
            updatedItinerary.daily_itinerary[update.day - 1].activities.map(activity => 
              activity.activity === update.details.activity ? { ...activity, ...update.details } : activity
            );
        }
        break;

      case 'update_budget':
        updatedItinerary.budget = update.details.budget;
        break;

      case 'add_destination':
        if (!updatedItinerary.destinations) {
          updatedItinerary.destinations = [];
        }
        updatedItinerary.destinations.push(update.details.destination);
        break;
    }
  });

  // Recalculate total cost
  updatedItinerary.total_cost = calculateTotalCost(updatedItinerary);
  return updatedItinerary;
}

function calculateTotalCost(itinerary) {
  let totalCost = 0;

  // Add up flight costs
  if (itinerary.flights) {
    totalCost += itinerary.flights.reduce((sum, flight) => sum + flight.price, 0);
  }

  // Add up hotel costs
  if (itinerary.hotels) {
    totalCost += itinerary.hotels.reduce((sum, hotel) => sum + (hotel.price_per_night * itinerary.duration), 0);
  }

  // Add up activity costs
  itinerary.daily_itinerary.forEach(day => {
    day.activities.forEach(activity => {
      if (activity.cost) {
        totalCost += activity.cost;
      }
    });
  });

  return totalCost;
}

export default {
  processUserRequest
}; 

