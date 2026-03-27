import 'dotenv/config'
import qrcode from 'qrcode-terminal'
import pkg from 'whatsapp-web.js'
import { askAI } from './ai.js'
import { saveMessage, getHistory, getStats } from './memory.js'
import { getPrompt, getAdminPrompt } from './prompt.js'
import { handleVoiceMessage } from './stt.js'
import { analyzeImageWithGemini } from './vision.js'

const { Client, LocalAuth } = pkg

const ADMIN      = process.env.ADMIN_NUMBER  || '27724971810'
const API_PORT   = process.env.API_PORT      || 3000
const API_SECRET = process.env.API_SECRET    || 'change-me-in-env'

console.log(`
╔══════════════════════════════════════════╗
║   🌟 MINTAKA — ORION DEV CORE v1.0      ║
║   WhatsApp + STT + Vision + Files       ║
║   Built in Africa. Engineered Impact.   ║
╚══════════════════════════════════════════╝
`)

// ── WHATSAPP CLIENT ─────────────────────────────────────────
const client = new Client({
  authStrategy: new LocalAuth({ clientId: 'mintaka' }),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  },
})

client.on('qr', (qr) => {
  console.log('\n📱 Scan this QR code with WhatsApp:\n')
  qrcode.generate(qr, { small: true })
  console.log('\nWaiting for scan...\n')
})

client.on('ready', () => {
  console.log(`
╔══════════════════════════════════════════╗
║   ✅ MINTAKA IS LIVE ON WHATSAPP         ║
║   Ready to receive messages...           ║
╚══════════════════════════════════════════╝
  `)
})

client.on('message', async (msg) => {
  try {
    if (msg.isGroupMsg) return

    const contact    = await msg.getContact()
    const sender     = contact.number
    const name       = contact.pushname || contact.name || sender
    const time       = new Date().toLocaleTimeString('en-ZA')
    const isAdmin    = sender === ADMIN

    // ── VOICE MESSAGE HANDLER ───────────────────────────────
    if (msg.type === 'ptt' || msg.type === 'audio') {
      console.log(`\n[${time}] 🎤 ${isAdmin ? '👑' : '📩'} ${name} (${sender}): [Voice message]`)

      try {
        const mediaData = await msg.downloadMedia()
        if (!mediaData) {
          await msg.reply('Could not download voice message. Please try again.')
          return
        }

        console.log(`   📥 Downloaded: ${mediaData.mimetype}`)
        
        // Save temp file
        const fs = require('fs')
        const tempPath = `./temp/voice_${Date.now()}.ogg`
        fs.mkdirSync('./temp', { recursive: true })
        fs.writeFileSync(tempPath, Buffer.from(mediaData.data, 'base64'))

        // Transcribe
        console.log(`   🎤 Transcribing audio...`)
        const text = await handleVoiceMessage(tempPath)

        if (!text) {
          await msg.reply('Could not transcribe voice message. Please try again or send text.')
          return
        }

        console.log(`   ✅ Transcribed: "${text.substring(0, 60)}"`)

        // Save transcription
        saveMessage(sender, name, 'user', text)

        // Get history & process like text
        const history      = getHistory(sender, 8)
        const systemPrompt = isAdmin ? getAdminPrompt() : getPrompt(name)

        console.log(`   🤖 Processing transcription...`)
        const response = await askAI(text, name, history, systemPrompt)

        saveMessage(sender, 'MINTAKA', 'assistant', response)
        await msg.reply(response)

        console.log(`   ✅ Replied: "${response.substring(0, 60)}"`)
        
        // Cleanup
        setTimeout(() => {
          try { fs.unlinkSync(tempPath) } catch (e) {}
        }, 1000)

      } catch (err) {
        console.error('   ❌ Voice processing error:', err.message)
        await msg.reply('Sorry, I had trouble processing that voice message. Please try again.')
      }
      return
    }

    // ── IMAGE MESSAGE HANDLER ───────────────────────────────
    if (msg.type === 'image') {
      console.log(`\n[${time}] 🖼️  ${isAdmin ? '👑' : '📩'} ${name} (${sender}): [Image]`)

      try {
        const mediaData = await msg.downloadMedia()
        if (!mediaData) {
          await msg.reply('Could not download image. Please try again.')
          return
        }

        console.log(`   📥 Downloaded: ${mediaData.mimetype}`)
        console.log(`   🔍 Analyzing with Gemini...`)

        const analysis = await analyzeImageWithGemini(mediaData.data)

        if (!analysis) {
          await msg.reply('Could not analyze image. Please try again.')
          return
        }

        console.log(`   ✅ Analysis: "${analysis.substring(0, 60)}"`)

        saveMessage(sender, name, 'user', `[IMAGE] ${analysis}`)
        
        const history      = getHistory(sender, 8)
        const systemPrompt = isAdmin ? getAdminPrompt() : getPrompt(name)

        const response = await askAI(`You received an image. Analysis: ${analysis}`, name, history, systemPrompt)

        saveMessage(sender, 'MINTAKA', 'assistant', response)
        await msg.reply(response)

        console.log(`   ✅ Replied: "${response.substring(0, 60)}"`)

      } catch (err) {
        console.error('   ❌ Image processing error:', err.message)
        await msg.reply('Sorry, I had trouble processing that image. Please try again.')
      }
      return
    }

    // ── TEXT MESSAGE HANDLER ────────────────────────────────
    if (!msg.body || msg.hasMedia) return

    const text = msg.body.trim()

    console.log(`\n[${time}] ${isAdmin ? '👑' : '📩'} ${name} (${sender}): "${text.substring(0, 60)}"`)

    // Admin commands
    if (isAdmin && text.startsWith('/')) {
      const reply = handleAdmin(text)
      await msg.reply(reply)
      return
    }

    saveMessage(sender, name, 'user', text)
    const history      = getHistory(sender, 8)
    const systemPrompt = isAdmin ? getAdminPrompt() : getPrompt(name)

    console.log(`   🤖 Thinking... ${isAdmin ? '(admin/co-founder mode)' : '(concierge mode)'}`)
    const response = await askAI(text, name, history, systemPrompt)

    saveMessage(sender, 'MINTAKA', 'assistant', response)
    await msg.reply(response)
    console.log(`   ✅ Replied: "${response.substring(0, 60)}"`)

  } catch (err) {
    console.error('❌ Message error:', err.message)
    try { await msg.reply('Something went wrong. Please try again 🙏') } catch {}
  }
})

// ── ADMIN COMMANDS ──────────────────────────────────────────
function handleAdmin(cmd) {
  const lower = cmd.toLowerCase()

  if (lower === '/stats') {
    const s = getStats()
    return `📊 Mintaka Stats:\n- Conversations: ${s.conversations}\n- Messages today: ${s.today}`
  }

  if (lower === '/help') {
    return `🔑 Admin Commands:\n/stats — usage stats\n/help — this message\n/mode — current mode\n/health — system health`
  }

  if (lower === '/mode') {
    return `🤖 Mintaka v1.0\nAdmin: co-founder mode\nGuests: concierge mode\nREST API: port ${API_PORT}`
  }

  if (lower === '/health') {
    const uptime = Math.floor(process.uptime())
    const hours = Math.floor(uptime / 3600)
    const mins = Math.floor((uptime % 3600) / 60)
    return `✅ System Health:\nUptime: ${hours}h ${mins}m\nStatus: Healthy\nProvider: AI chain active`
  }

  return '❓ Unknown command. Try /help'
}

// ── REST API ────────────────────────────────────────────────
Bun.serve({
  port: API_PORT,
  async fetch(req) {
    const url = new URL(req.url)

    if (req.method === 'GET' && url.pathname === '/health') {
      return Response.json({ 
        status: 'ok', 
        version: '1.0', 
        uptime: process.uptime(),
        service: 'mintaka',
        ready: true
      })
    }

    if (req.method === 'POST' && url.pathname === '/api/chat') {
      const secret = req.headers.get('x-api-secret')
      if (secret !== API_SECRET) {
        console.warn(`   🚫 Unauthorized API attempt`)
        return Response.json({ error: 'Unauthorized' }, { status: 401 })
      }

      let body
      try { body = await req.json() } catch {
        return Response.json({ error: 'Invalid JSON' }, { status: 400 })
      }

      const { sender, name, message } = body
      if (!sender || !message) {
        return Response.json({ error: 'sender and message required' }, { status: 400 })
      }

      const senderName   = name || sender
      const time         = new Date().toLocaleTimeString('en-ZA')
      const isAdmin      = sender === ADMIN

      console.log(`\n[${time}] 📡 REST ${senderName} (${sender}): "${message.substring(0, 60)}"`)

      saveMessage(sender, senderName, 'user', message)
      const history      = getHistory(sender, 8)
      const systemPrompt = isAdmin ? getAdminPrompt() : getPrompt(senderName)

      const reply = await askAI(message, senderName, history, systemPrompt)

      saveMessage(sender, 'MINTAKA', 'assistant', reply)
      console.log(`   ✅ Replied: "${reply.substring(0, 60)}"`)

      return Response.json({ reply })
    }

    return Response.json({ error: 'Not found' }, { status: 404 })
  },
})

console.log(`\n🌐 REST API live → http://localhost:${API_PORT}`)
console.log(`   POST /api/chat — Voice bridge`)
console.log(`   GET  /health   — Status check\n`)

// ── LIFECYCLE ───────────────────────────────────────────────
client.on('disconnected', (reason) => {
  console.log('⚠️  Disconnected:', reason)
  process.exit(1)
})

client.initialize()

process.on('SIGINT', async () => {
  console.log('\n👋 Shutting down...')
  await client.destroy()
  process.exit(0)
})
