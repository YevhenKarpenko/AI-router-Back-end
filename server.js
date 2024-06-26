

const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const port = 5000;

const corsOptions = {
    origin: 'https://remarkable-bunny-a21fbf.netlify.app/generate', 
    optionsSuccessStatus: 200 // For legacy browser support
};

app.use(cors(corsOptions));
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

app.post('/generate', async (req, res) => {
    const { prompt } = req.body;

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();


        // Parse and structure the AI response
        let itinerary;
        try {
            itinerary = JSON.parse(text);
            if (!itinerary.start || !Array.isArray(itinerary.stops) || !itinerary.end) {
                throw new Error('Invalid itinerary format');
            }
        } catch (error) {
            console.error('Error parsing itinerary:', error);
            return res.status(500).json({ error: 'Failed to parse itinerary' });
        }

        res.json({ itinerary });
    } catch (error) {
        console.error('Error generating content:', error);
        res.status(500).json({ error: 'Failed to generate content' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
