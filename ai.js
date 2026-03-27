import axios from 'axios'
import { getPrompt, getAdminPrompt } from './prompt.js'

// ── CONFIG ─────────────────────────────────────────────────
const GROQ_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';
const OR_KEY = process.env.OPENROUTER_KEY;
const OR_MODEL = process.env.OR_MODEL || 'openrouter/auto';
const TOGETHER_KEY = process.env.TOGETHER_API_KEY
const TOGETHER_MODEL = 'meta-llama/Llama-3.1-8B-Instruct-Turbo'

const FIREWORKS_KEY = process.env.FIREWORKS_API_KEY
const FIREWORKS_MODEL = 'accounts/fireworks/models/llama-v3-8b-instruct'

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434'
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'phi3:mini'

console.log(`
🧠 AI Core — Multi-Provider Chain
═════════════════════════════════════════════════════════════
1️⃣  Groq (${GROQ_MODEL}) ${GROQ_KEY ? '✅' : '❌ No key'}
2️⃣  Together.ai (${TOGETHER_MODEL}) ${TOGETHER_KEY ? '✅' : '❌ No key'}
3️⃣  Fireworks.ai (${FIREWORKS_MODEL}) ${FIREWORKS_KEY ? '✅' : '❌ No key'}
4️⃣  Ollama Local (${OLLAMA_MODEL}) — Always available
═════════════════════════════════════════════════════════════
`)

/**
 * PROVIDER 1: GROQ (Fastest, ~500ms)
 */
async function callGroq(systemPrompt, userMessage) {
  if (!GROQ_KEY) return null
  try {
    console.log(`   ⚡ Groq...`)
    const res = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: GROQ_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        max_tokens: 500,
        temperature: 0.35
      },
      {
        headers: {
          'Authorization': `Bearer ${GROQ_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 15000
      }
    )

    const reply = res.data?.choices?.[0]?.message?.content?.trim()
    if (!reply) throw new Error('Empty response')

    console.log(`   ✅ Groq (${reply.length} chars)`)
    return { text: reply, provider: 'Groq', model: GROQ_MODEL }

  } catch (err) {
    if (err.response?.status === 429) {
      console.log(`   ⚠️  Groq: Rate limited (60 req/min cap)`)
    } else {
      console.log(`   ❌ Groq: ${err.message}`)
    }
    return null
  }
}

/**
 * PROVIDER 2: TOGETHER.AI (1M tokens/day free)
 */
async function callTogether(systemPrompt, userMessage) {
  if (!TOGETHER_KEY) return null
  try {
    console.log(`   🌐 Together.ai...`)
    const res = await axios.post(
      'https://api.together.xyz/v1/chat/completions',
      {
        model: TOGETHER_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        max_tokens: 500,
        temperature: 0.35
      },
      {
        headers: {
          'Authorization': `Bearer ${TOGETHER_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 20000
      }
    )

    const reply = res.data?.choices?.[0]?.message?.content?.trim()
    if (!reply) throw new Error('Empty response')

    console.log(`   ✅ Together (${reply.length} chars)`)
    return { text: reply, provider: 'Together.ai', model: TOGETHER_MODEL }

  } catch (err) {
    console.log(`   ❌ Together: ${err.message}`)
    return null
  }
}

/**
 * PROVIDER 3: FIREWORKS.AI (100+ req/hour free, no token cap)
 */
async function callFireworks(systemPrompt, userMessage) {
  if (!FIREWORKS_KEY) return null
  try {
    console.log(`   🔥 Fireworks.ai...`)
    const res = await axios.post(
      'https://api.fireworks.ai/inference/v1/chat/completions',
      {
        model: FIREWORKS_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        max_tokens: 500,
        temperature: 0.35
      },
      {
        headers: {
          'Authorization': `Bearer ${FIREWORKS_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 20000
      }
    )

    const reply = res.data?.choices?.[0]?.message?.content?.trim()
    if (!reply) throw new Error('Empty response')

    console.log(`   ✅ Fireworks (${reply.length} chars)`)
    return { text: reply, provider: 'Fireworks', model: FIREWORKS_MODEL }

  } catch (err) {
    console.log(`   ❌ Fireworks: ${err.message}`)
    return null
  }
}
// ── PROVIDER 4: OPENROUTER ─────────────────────────────────
async function callOpenRouter(systemPrompt, history, userMessage) {
  if (!OR_KEY) return null;
  try {
    console.log(`   🌐 OpenRouter...`);
    const res = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: OR_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          ...history,
          { role: 'user', content: userMessage },
        ],
        max_tokens: 300,
        temperature: 0.35,
      },
      {
        headers: {
          Authorization: `Bearer ${OR_KEY}`,
          'HTTP-Referer': 'https://oriondevcore.com',
          'X-Title': 'Mintaka ORION Dev Core',
          'Content-Type': 'application/json',
        },
        timeout: 20000,
      }
    );
    const reply = res.data?.choices?.[0]?.message?.content?.trim();
    if (!reply) throw new Error('Empty response');
    console.log(`   ✅ OpenRouter replied (${reply.length} chars)`);
    return reply;
  } catch (err) {
    console.error(`   ❌ OpenRouter failed: ${err.message}`);
    return null;
  }
}
/**
 * PROVIDER 5: OLLAMA (Local, always works, slower)
 */
async function callOllama(systemPrompt, userMessage) {
  try {
    console.log(`   🖥️  Ollama Local (${OLLAMA_MODEL})...`)
    const res = await axios.post(
      `${OLLAMA_URL}/api/chat`,
      {
        model: OLLAMA_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        stream: false,
        options: {
          temperature: 0.35,
          num_predict: 500
        }
      },
      { timeout: 180000 }
    )

    const reply = res.data?.message?.content?.trim()
    if (!reply) throw new Error('Empty response')

    console.log(`   ✅ Ollama (${reply.length} chars, slow but works!)`)
    return { text: reply, provider: 'Ollama', model: OLLAMA_MODEL }

  } catch (err) {
    console.log(`   ❌ Ollama: ${err.message}`)
    return null
  }
}

/**
 * MAIN: ASK AI (tries all providers in order)
 */
export async function askAI(userMessage, senderName, history = [], systemPrompt) {
  if (!systemPrompt) {
    systemPrompt = getPrompt(senderName)
  }

  const start = Date.now()

  try {
    console.log(`\n🤖 AI: "${userMessage.substring(0, 40)}..."`)
    console.log(`   Mode: ${systemPrompt.includes('admin') ? '👑 Admin' : '📩 Guest'}`)
    console.log(`\n   Trying providers...`)

    // 1. Try Groq (fastest)
    let result = await callGroq(systemPrompt, userMessage)
    if (result) {
      const elapsed = Date.now() - start
      console.log(`   ⏱️  ${elapsed}ms`)
      return result.text
    }

    // 2. Try Together.ai
    result = await callTogether(systemPrompt, userMessage)
    if (result) {
      const elapsed = Date.now() - start
      console.log(`   ⏱️  ${elapsed}ms`)
      return result.text
    }

    // 3. Try Fireworks.ai
    result = await callFireworks(systemPrompt, userMessage)
    if (result) {
      const elapsed = Date.now() - start
      console.log(`   ⏱️  ${elapsed}ms`)
      return result.text
    }

    // 4. Try OpenRouter
    let reply = await callOpenRouter(systemPrompt, history, userMessage);
  if (reply) {
    console.log(`   ⏱️  ${Date.now() - start}ms`);
    return reply;
  }

    // 5. Try Ollama (last resort, slow but always works)
    console.log(`\n   ⚠️  All cloud providers failed, using local AI...`)
    result = await callOllama(systemPrompt, userMessage)
    if (result) {
      const elapsed = Date.now() - start
      console.log(`   ⏱️  ${elapsed}ms`)
      return result.text
    }

    // All failed
    console.error('\n   ❌ ALL PROVIDERS FAILED')
    return `I'm experiencing technical difficulties right now. Please try again in a moment. 🙏`

  } catch (error) {
    console.error(`   ❌ AI Error: ${error.message}`)
    return `Something went wrong. Please try again. 🙏`
  }
}

/**
 * TEST AI PROVIDERS
 */
export async function testProviders() {
  console.log('\n🧪 Testing AI providers...\n')

  const testMessage = 'Hello, how are you?'
  const systemPrompt = 'You are a helpful AI. Keep responses short.'

  console.log('1️⃣  Testing Groq...')
  const groq = await callGroq(systemPrompt, testMessage)
  console.log(`   Result: ${groq ? '✅' : '❌'}\n`)

  console.log('2️⃣  Testing Together.ai...')
  const together = await callTogether(systemPrompt, testMessage)
  console.log(`   Result: ${together ? '✅' : '❌'}\n`)

  console.log('3️⃣  Testing Fireworks.ai...')
  const fireworks = await callFireworks(systemPrompt, testMessage)
  console.log(`   Result: ${fireworks ? '✅' : '❌'}\n`)

  console.log('4️⃣  Testing Ollama...')
  const ollama = await callOllama(systemPrompt, testMessage)
  console.log(`   Result: ${ollama ? '✅' : '❌'}\n`)

  const working = [groq, together, fireworks, ollama].filter(r => r).length
  console.log(`\n✅ ${working}/4 providers working\n`)
}

export default { askAI, testProviders }
