export default async function handler(req, res) {
  try {
    const { email } = req.body;

    // Check if we're in development mode or if OpenAI API is unavailable
    if (process.env.NODE_ENV === 'development' || process.env.USE_MOCK_API === 'true') {
      // Mock response
      const mockCategories = ['promotion', 'personal', 'work', 'newsletter', 'social'];
      const mockCategory = mockCategories[Math.floor(Math.random() * mockCategories.length)];
      console.log('Using mock API response:', mockCategory);
      return res.status(200).json({ category: mockCategory });
    }

    // Request to OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo', // Replace with the model you are using
        messages: [
          {
            role: 'system',
            content: 'You are an email sorting assistant that classifies emails into categories like promotion, personal, work, newsletter, social.',
          },
          {
            role: 'user',
            content: `Sort this email into one of the following categories (promotion, personal, work, newsletter, social): ${email}`,
          },
        ],
        max_tokens: 50,
      }),
    });

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API responded with status ${openaiResponse.status}`);
    }

    // Log the entire response for debugging purposes
    const openaiData = await openaiResponse.json();
    console.log('OpenAI API response:', openaiData);

    // Ensure the response contains the expected structure
    if (openaiData.choices && openaiData.choices.length > 0) {
      const category = openaiData.choices[0].message.content.trim().toLowerCase();
      const validCategories = ['promotion', 'personal', 'work', 'newsletter', 'social'];

      if (validCategories.includes(category)) {
        res.status(200).json({ category });
      } else {
        res.status(400).json({ error: 'Invalid category returned by AI.' });
      }
    } else {
      res.status(500).json({ error: 'Unexpected OpenAI response structure.' });
    }
  } catch (error) {
    console.error('Error processing the request:', error);
    res.status(500).json({ error: 'Something went wrong with the email sorting.' });
  }
}
