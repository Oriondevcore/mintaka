import axios from 'axios'

const GROQ_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.1-70b-versatile';
const TOGETHER_KEY = process.env.TOGETHER_API_KEY;
const TOGETHER_MODEL = 'meta-llama/Llama-3.1-8B-Instruct-Turbo';

/**
 * Main AI Router
 */
export async function askAI(userMessage, userName, history = [], systemPrompt = "") {
  // We inject history into the messages array here
  const messages = [
    { role: 'system', content: systemPrompt },
    ...history,
    { role: 'user', content: userMessage }
  ];

  // Try Groq First
  let result = await callGroq(messages);
  
  // Fallback to Together if Groq fails
  if (!result) result = await callTogether(messages);

  return result ? result.text : "I'm having a bit of trouble thinking right now. Could you repeat that?";
}

async function callGroq(messages) {
  if (!GROQ_KEY) return null;
  try {
    const res = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
      model: GROQ_MODEL,
      messages: messages,
      temperature: 0.5
    }, {
      headers: { 'Authorization': `Bearer ${GROQ_KEY}` },
      timeout: 10000
    });
    return { text: res.data.choices[0].message.content.trim() };
  } catch (err) {
    return null;
  }
}

async function callTogether(messages) {
  if (!TOGETHER_KEY) return null;
  try {
    const res = await axios.post('https://api.together.xyz/v1/chat/completions', {
      model: TOGETHER_MODEL,
      messages: messages
    }, {
      headers: { 'Authorization': `Bearer ${TOGETHER_KEY}` }
    });
    return { text: res.data.choices[0].message.content.trim() };
  } catch (err) {
    return null;
  }
}
