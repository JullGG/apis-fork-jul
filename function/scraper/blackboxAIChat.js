const axios = require('axios');

async function blackboxAIChat(message) {
  try {
    const response = await axios.post('https://deepenglish.com/wp-json/ai-chatbot/v1/chat', {
      messages: [{ id: null, content: message, role: 'user' }],
      id: null,
      previewToken: null,
      userId: null,
      codeModelMode: true,
      agentMode: {},
      trendingAgentMode: {},
      isMicMode: false,
      isChromeExt: false,
      githubToken: null
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}

module.exports = blackboxAIChat;
