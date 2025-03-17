const GOOGLE_AI_STUDIO_API_KEY = 'AIzaSyCZk3oQThfQwe3JWBF8QrMDCrJbgvyIRYE';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-pro-exp-02-05:generateContent?key=' + GOOGLE_AI_STUDIO_API_KEY;
const PLAYAI_USER_ID = 'afsBmgPo3jYppKElolGL7vr5oOi2';
const PLAYAI_SECRET_KEY = 'ak-bbd9c8a7e3704eb087e392a919ab7160';

const narrativeCache = new Map<string, string>();

const generateCacheKey = (prompt: string) => {
  let hash = 0;
  for (let i = 0; i < prompt.length; i++) {
    const char = prompt.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString();
};

interface APIError extends Error {
  status?: number;
  details?: string;
}

export const generateNarrative = async (
  prompt: string,
  options: { useCache?: boolean; maxRetries?: number; language?: string; type?: 'story' | 'list' } = { useCache: true, maxRetries: 3 }
): Promise<string> => {
  const { useCache = true, maxRetries = 3, language = 'en', type = 'story' } = options;

  if (useCache) {
    const cacheKey = generateCacheKey(prompt);
    const cachedResult = narrativeCache.get(cacheKey);
    if (cachedResult) return cachedResult;
  }

  const fetchWithRetry = async (retriesLeft: number): Promise<string> => {
    try {
      if (!GOOGLE_AI_STUDIO_API_KEY) {
        throw new Error('Google AI Studio API key is missing');
      }

      const systemMessage =
        type === 'story'
          ? `${language === 'ar' ? 'Respond only in Arabic' : 'Respond only in English'} with a fictional narrative story. Do not generate lists or introductory remarks.`
          : `${language === 'ar' ? 'Respond only in Arabic' : 'Respond only in English'} with a bulleted list of facts. Do not generate stories or additional text.`;

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{text: systemMessage}]
            },
            {
              role: 'model',
              parts: [{text: "Ok."}]
            },
            {
              role: 'user',
              parts: [{text: prompt}],
            }
          ]
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const error: APIError = new Error(`API request failed: ${errorData.error?.message || 'Unknown error'}`);
        error.status = response.status;
        error.details = errorData.error?.message;
        throw error;
      }

      const data = await response.json();
      const result = data.candidates[0].content.parts[0].text;

      if (useCache) {
        const cacheKey = generateCacheKey(prompt);
        narrativeCache.set(cacheKey, result);
      }

      return result;
    } catch (error) {
      if (retriesLeft > 0 && error instanceof Error) {
        console.warn(`Retrying narrative generation. Attempts left: ${retriesLeft}`);
        await new Promise(resolve => setTimeout(resolve, (maxRetries - retriesLeft) * 1000));
        return fetchWithRetry(retriesLeft - 1);
      }
      throw error;
    }
  };

  return fetchWithRetry(maxRetries);
};

export const generateTTS = async (text: string): Promise<string> => {
  const playAIUrl = 'https://api.play.ht/api/v2/tts';

  try {
    const response = await fetch(playAIUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'AUTHORIZATION': `Bearer ${PLAYAI_SECRET_KEY}`,
        'X-USER-ID': PLAYAI_USER_ID,
      },
      body: JSON.stringify({
        text: text,
        voice: "s3://voice-cloning-zero-shot/d9ff78ba-d016-47f6-b0ef-dd630f59414e/female-cs/manifest.json",
        output_format: 'mp3',
        voice_engine: 'PlayHT2.0'
      }),
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (parseError) {
        throw new Error(`PlayAI API request failed with status ${response.status}: ${response.statusText}`);
      }
      throw new Error(`PlayAI API request failed: ${errorData.message || 'Unknown error'}`);
    }

    const data = await response.json();
     if (data.url) {
        return data.url
     } else {
        throw new Error ('URL not found')
     }

  } catch (error) {
    console.error('Error generating TTS with PlayAI:', error);
    throw error; // Re-throw for handling in component
  }
};
