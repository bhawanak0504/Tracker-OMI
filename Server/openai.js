const axios = require('axios');
const retry = require('async-retry'); // Optional, use this to handle retries easily

async function fetchAIResponse(message) {
    try {
        await retry(async () => {
            const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: message }],
                max_tokens: 300,
            }, {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            });
            console.log('AI Response:', response.data.choices[0].message.content);
        }, {
            retries: 3, // Retry up to 3 times
            factor: 2, // Exponential backoff factor (doubles wait time each retry)
            minTimeout: 1000, // Initial wait time in ms
            onRetry: (error, attempt) => {
                console.log(`Retry attempt ${attempt} after error:`, error.message);
            }
        });
    } catch (error) {
        console.error('Error with OpenAI API:', error.message);
    }
}

fetchAIResponse("Your message");

