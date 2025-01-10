import express from 'express';
import OpenAI from 'openai';
import 'dotenv/config';
import cors from 'cors';

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cors());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

app.post('/chat', async (req, res) => {
    try {
        const text = req.body.text;

        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
    messages: [
        { role: 'system', content: 'You are a helpful assistant. Provide brief, clear answers using simple words and also add few deatils too.' },
        { role: 'user', content: text },
    ],
    temperature: 0.7,
    max_tokens: 150
});
    res.json({ reply: completion.choices[0]?.message?.content });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong!' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
