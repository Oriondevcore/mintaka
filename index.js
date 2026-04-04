import 'dotenv/config'
import pkg from 'whatsapp-web.js'
import { askAI } from './ai.js'
import { saveMessage, getHistory, saveFact, getRelevantKnowledge } from './memory.js'
import { getPrompt, getAdminPrompt } from './prompt.js'
import { handleVoiceMessage } from './stt.js'

const { Client, LocalAuth } = pkg
const ADMIN = '27724971810' // Graham's Number
const MINTAKA_ID = '27703080516@c.us' // Mintaka's WhatsApp ID

const client = new Client({
  authStrategy: new LocalAuth({ clientId: 'mintaka' }),
  puppeteer: { headless: true, args: ['--no-sandbox'] }
})

client.on('ready', () => {
  console.log('✅ Mintaka is online.');
  
  // ── PROACTIVE BRAIN LOOP ────────────────────────
  // Checks every 4 hours if Mintaka has something to ask
  setInterval(async () => {
    const hour = new Date().getHours();
    if (hour > 8 && hour < 20) { // Only during business hours
      console.log("🧠 Mintaka is thinking proactively...");
      // Logic for proactive outreach can be added here
    }
  }, 1000 * 60 * 60 * 4); 
});

client.on('message', async (msg) => {
  if (msg.isGroupMsg) return;

  const contact = await msg.getContact();
  const sender = contact.number;
  const isAdmin = sender === ADMIN;
  let text = msg.body;

  // 1. Handle Voice Note
  if (msg.type === 'ptt' || msg.type === 'audio') {
    const media = await msg.downloadMedia();
    const tempPath = `./temp/${Date.now()}.ogg`;
    require('fs').writeFileSync(tempPath, Buffer.from(media.data, 'base64'));
    text = await handleVoiceMessage(tempPath);
  }

  // 2. Learning Mode (ADMIN ONLY)
  if (isAdmin && text.toLowerCase().startsWith('mintaka, remember')) {
    const fact = text.replace(/mintaka, remember/i, '').trim();
    saveFact(fact);
    return msg.reply("✅ Got it, Graham. I've written that to my permanent knowledge base.");
  }

  // 3. Retrieval (RAG)
  const businessContext = getRelevantKnowledge(text);
  const history = getHistory(sender, 10);
  
  // 4. Identity Construction
  let systemPrompt = isAdmin ? getAdminPrompt() : getPrompt(contact.pushname);
  systemPrompt += `\n\nVERIFIED BUSINESS KNOWLEDGE:\n${businessContext}`;

  // 5. Generate Response
  const response = await askAI(text, contact.pushname, history, systemPrompt);
  
  saveMessage(sender, contact.pushname, 'user', text);
  saveMessage(sender, 'MINTAKA', 'assistant', response);
  
  await msg.reply(response);
});

client.initialize();
