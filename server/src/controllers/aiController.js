
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const parseMealString = async (req, res, next) => {

    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({
                message: 'No text provided'
            })
        }

        const prompt = `
        You are a highly accurate nutrition parsing API.
        Given the user's natural language meal description:
        "${text}"

        Return a JSON array of objects representing each food item.

        Each object MUST have exactly these keys (and the values MUST be numbers):
        - "name": string (the name of the food)
        - "weight": number (estimated weight in grams)
        - "kcals": number (estimated calories)
        - "p": number (protein in grams)
        - "c": number (carbohydrates in grams)
        - "f": number (fats in grams)

        Return ONLY raw JSON array. No markdown formatting, no backticks, no conversational text.

        `
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        })

        //strip formatting in case Gemini tries to wrap it in markdown
        let rawJson = response.text.trim();
        if (rawJson.startsWith('```json')) rawJson = rawJson.substring(7);
        if (rawJson.startsWith('```')) rawJson = rawJson.substring(3);
        if (rawJson.endsWith('```')) rawJson = rawJson.substring(0, rawJson.length - 3);

        const parsedItems = JSON.parse(rawJson.trim());
        res.status(200).json({ items: parsedItems });


    } catch (error) {
        console.error('AI parsing error:', error);
        res.status(500).json({
            message: 'Failed to parse meal with AI'
        });
    }


};


const getDailyQuote = async (req, res, next) => {
    try {
        const prompt = `
        You are an elite fitness and wellness coach. 
        Generate a short, powerful, and unique daily motivational quote about fitness, discipline, or health. 
        Return ONLY the text of the quote, nothing else. Do not wrap it in quotes. Maximum 1-2 sentences.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        res.status(200).json({ quote: response.text.trim().replace(/^"|"$/g, '') });
    } catch (error) {
        console.error('AI quote error:', error);
        res.status(500).json({ message: 'Failed to generate quote' });
    }
};


module.exports = { parseMealString, getDailyQuote };


