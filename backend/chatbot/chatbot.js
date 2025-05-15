const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5003;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '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 ';

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  try {
    const { prompt, language } = req.body;
    
    // Make request to OpenRouter API
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: "nousresearch/deephermes-3-mistral-24b-preview:free",
        messages: [
          { role: "system", content: "You are an agricultural expert assistant." },
          { role: "user", content: prompt }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://agrolens-farmers.com',
          'X-Title': 'AgroLens'
        }
      }
    );
    
    // Extract and return the response
    if (response.data && 
        response.data.choices && 
        response.data.choices.length > 0) {
      return res.json({
        success: true,
        message: response.data.choices[0].message.content
      });
    } else {
      throw new Error('Invalid response from OpenRouter');
    }
  } catch (error) {
    console.error('Error in chatbot API:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get response from AI service'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Chatbot server running on port ${PORT}`);
});