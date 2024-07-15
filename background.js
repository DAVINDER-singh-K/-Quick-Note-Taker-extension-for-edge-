const COHERE_API_KEY = 'SI60opK439ip3LHrUsEJ4kNyOGQzjpkxniU0bgGM';
const COHERE_API_URL = 'https://api.cohere.ai/v1/generate';

async function generateText(prompt) {
  console.log('Generating text for prompt:', prompt);
  try {
    const response = await fetch(COHERE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${COHERE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'command-nightly',
        prompt: `Transform the following text into a humorous or double-meaning version: "${prompt}"`,
        max_tokens: 100,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('API response:', data);
    return data.generations[0].text;
  } catch (error) {
    console.error('Error in generateText:', error);
    throw error;
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "generate") {
    console.log('Received generate request:', request);
    generateText(request.prompt)
      .then(generatedText => {
        console.log('Generated text:', generatedText);
        sendResponse({generatedText});
      })
      .catch(error => {
        console.error('Error in listener:', error);
        sendResponse({error: error.message});
      });
    return true;  // Indicates that the response is asynchronous
  }
});