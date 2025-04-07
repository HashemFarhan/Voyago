const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const OpenAI = require('openai');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.post('/generate-itinerary', async (req, res) => {
  try {
    const { destinations, duration, budget, interests, optional } = req.body;
    
    const prompt = `Plan a ${duration}-day trip to ${destinations.join(', ')}.
Budget: $${budget}
User interests: ${interests.join(', ')}
Optional notes: ${optional || 'N/A'}

Include:
- Simulated flight options (departure and return)
- Hotels with cost estimates
- A daily schedule of activities (3–4/day)
- Local transport options

Format response as structured JSON:
{
  "flights": [...],
  "hotels": [...],
  "daily_itinerary": [
    {
      "day": 1,
      "activities": [...],
      "hotel": "...",
      "transport": "...",
      "estimated_cost": ...
    }
  ]
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a travel planning expert. Generate detailed travel itineraries in JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
    });

    const itinerary = JSON.parse(completion.choices[0].message.content);
    res.json(itinerary);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to generate itinerary' });
  }
});

app.post('/edit-section', async (req, res) => {
  try {
    const { sectionType, dayNumber, edits } = req.body;
    
    const prompt = `Modify the ${sectionType} for day ${dayNumber} with the following changes: ${edits}
    Return only the updated section in JSON format.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a travel planning expert. Modify specific sections of travel itineraries."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
    });

    const updatedSection = JSON.parse(completion.choices[0].message.content);
    res.json(updatedSection);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to edit section' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 