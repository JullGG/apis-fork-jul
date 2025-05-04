import axios from 'axios';

async function fetchUser(content, prompt, user) {
  function generateRandomUserId() {
    return 'user-' + Math.floor(Math.random() * 10000);
  }
  let userId = generateRandomUserId();
  console.log(`Generated User ID: ${userId}`);
  try {
    const response = await axios.post('https://luminai.my.id/', { content, prompt, user });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function muslimAi(query) {
    const searchUrl = 'https://www.muslimai.io/api/search';
    const headers = {
        'Content-Type': 'application/json'
    };

    try {
        
        const translatedQuery = await translate(query, 'id', 'en');
        const englishQuery = translatedQuery.translation;

        const searchData = { query: englishQuery };
        const searchResponse = await axios.post(searchUrl, searchData, { headers });
        const passages = searchResponse.data.map(item => item.content).join('\n\n');
        
        const answerUrl = 'https://www.muslimai.io/api/answer';
        const answerData = {
            prompt: `Use the following passages to answer the query to the best of your ability as a world class expert in the Quran. Do not mention that you were provided any passages in your answer: ${englishQuery}\n\n${passages}`
        };
        const answerResponse = await axios.post(answerUrl, answerData, { headers });

        const translatedAnswer = await translate(answerResponse.data, 'en', 'id');
     
        const translatedSources = await Promise.all(
            searchResponse.data.map(async (item) => {
                const translatedSource = await translate(item.content, 'en', 'id');
                return translatedSource.translation;
            })
        );

        const result = {
            answer: translatedAnswer.translation,
            source: translatedSources
        };

        return result;
    } catch (error) {
        console.error('Error occurred:', error.response ? error.response.data : error.message);
        throw new Error('Terjadi kesalahan saat mengambil data. Mohon coba lagi.');
    }
}

const gpt24 = {
  chatOnly: async (prompt, question) => {
    const data = JSON.stringify({
      "messages": [
        {
          "role": "system",
          "content": prompt
        },
        {
          "role": "user",
          "content": question
        }
      ],
      "stream": false,
      "model": "gpt-4o-mini",
      "temperature": 0.5,
      "presence_penalty": 0,
      "frequency_penalty": 0,
      "top_p": 1,
      "max_tokens": 4000
    });

    const config = {
      method: 'POST',
      url: 'https://gpt24-ecru.vercel.app/api/openai/v1/chat/completions',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Android 10; Mobile; rv:131.0) Gecko/131.0 Firefox/131.0',
        'Accept': 'application/json, text/event-stream',
        'Content-Type': 'application/json',
        'accept-language': 'id-ID',
        'referer': 'https://gpt24-ecru.vercel.app/',
        'origin': 'https://gpt24-ecru.vercel.app',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'priority': 'u=0',
        'te': 'trailers',
        'Cookie': '_ga_89WN60ZK2E=GS1.1.1736208261.1.1.1736208312.0.0.0; _ga=GA1.1.1312319525.1736208262'
      },
      data: data
    };

    const api = await axios.request(config);
    const parsedResult = api.data;
    const reply = parsedResult.choices[0].message.content;
    return reply;
  },

  chatWithImage: async (prompt, question, imageUrl) => {
    const data = JSON.stringify({
      "messages": [
        {
          "role": "system",
          "content": prompt
        },
        {
          "role": "user",
          "content": [
            {
              "type": "text",
              "text": question
            },
            {
              "type": "image_url",
              "image_url": {
                "url": imageUrl
              }
            }
          ]
        }
      ],
      "stream": false,
      "model": "gpt-4o-mini",
      "temperature": 0.5,
      "presence_penalty": 0,
      "frequency_penalty": 0,
      "top_p": 1,
      "max_tokens": 4000
    });

    const config = {
      method: 'POST',
      url: 'https://gpt24-ecru.vercel.app/api/openai/v1/chat/completions',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Android 10; Mobile; rv:131.0) Gecko/131.0 Firefox/131.0',
        'Accept': 'application/json, text/event-stream',
        'Content-Type': 'application/json',
        'accept-language': 'id-ID',
        'referer': 'https://gpt24-ecru.vercel.app/',
        'origin': 'https://gpt24-ecru.vercel.app',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'priority': 'u=4',
        'te': 'trailers',
        'Cookie': '_ga_89WN60ZK2E=GS1.1.1736208261.1.1.1736208312.0.0.0; _ga=GA1.1.1312319525.1736208262'
      },
      data: data
    };

    const api = await axios.request(config);
    const parsedResult = api.data;
    const reply = parsedResult.choices[0].message.content;
    return reply;
  }
};

export {
  fetchUser,
  muslimAi, 
  gpt24
};
