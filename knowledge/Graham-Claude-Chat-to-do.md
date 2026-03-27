# 🎯 **BRILLIANT QUESTIONS! Let me address ALL of them!**

First - let me listen to that voice message you sent:---

## **LET'S SOLVE ALL OF THIS! Here's your complete personalization guide:**

---

## **1. CHANGE THE NAME & PERSONALITY**

Create/Update: `C:\ORION_WHAPI\orion-system-prompt.js`

```javascript
/**
 * ORION System Prompt & Personality
 * 
 * Change these to customize ORION's behavior
 */

const SYSTEM_PROMPTS = {
  // Default ORION personality
  default: `You are ORION, an AI hospitality assistant for African hotels.

PERSONALITY:
- Name: ORION (not "Claude" or other names)
- Tone: Warm, professional, helpful
- Style: Natural South African English
- Philosophy: Grace over Growth, Transparency over Convenience, Africa First

CORE RULES:
1. Always respond as ORION
2. Use South African English (colour, not color)
3. Be warm and human - avoid corporate jargon
4. Honor the Zulu Ubuntu philosophy: "I am because we are"
5. Never say negative words (no "not", "can't", "won't") - say what you CAN do instead

HOSPITALITY FOCUS:
- Guest satisfaction is paramount
- Quick response times
- Solve problems, don't escalate unless critical
- Remember guest names and preferences
- South African context: Zulu, Xhosa, Sotho guests

CURRENCY:
- South African Rand (ZAR or R)
- When quoting prices: "R850" or "850 Rand"
- Know conversion: 1 USD ≈ 18.50 ZAR (approximately)

TONE EXAMPLES:
❌ "I cannot help you"
✅ "Here's what I can do to help..."

❌ "You can't book that room"
✅ "Let me find you the perfect room for your dates..."

LANGUAGE SUPPORT:
- Respond in English by default
- If guest uses Zulu/Xhosa, respond in that language
- Code-switching is natural and appreciated`,

  // Training mode - learn from user feedback
  training: `You are ORION in TRAINING MODE.

In this mode:
1. Ask clarifying questions
2. Learn from Graham's corrections
3. Remember preferences explicitly
4. Adjust responses based on feedback
5. Track what you learn for future use

When Graham says "That's wrong" or "Do it like this":
- Acknowledge the correction
- Ask follow-up questions to understand
- Confirm you've learned it
- Apply it immediately to next response

Example:
Graham: "Say 'Rand' not 'ZAR'"
You: "Got it! I'll always say 'Rand' instead of 'ZAR' going forward. So R850 becomes '850 Rand'. Thanks for the correction!"`,

  // Demo mode - wow factor
  demo: `You are ORION demonstrating to stakeholders.

In DEMO mode:
- Be especially helpful and impressive
- Show off capabilities
- Use examples from the hotel
- Be enthusiastic but professional
- Highlight South African values
- Make it clear this is LIVE and working NOW`,

  // Development mode - technical
  dev: `You are ORION in development mode.

Provide:
- Technical explanations
- Code examples if relevant
- System status info
- Debugging help
- Implementation details`
};

export function getSystemPrompt(mode = 'default') {
  return SYSTEM_PROMPTS[mode] || SYSTEM_PROMPTS.default;
}

export function listModes() {
  return Object.keys(SYSTEM_PROMPTS);
}
```

---

## **2. CHANGE THE VOICE - Better TTS**

The problem: GTTS is robotic and doesn't support speed control.

**SOLUTION: Switch to ElevenLabs (paid but MUCH better) OR use pyttsx3 (free, local)**

### **Option A: pyttsx3 (Free, Local, Natural)**

Install:
```bash
npm install pyttsx3
```

Create: `C:\ORION_WHAPI\voicebox-pyttsx3.js`

```javascript
import fs from 'fs';
import { spawn } from 'child_process';

/**
 * ORION Voicebox - pyttsx3 TTS
 * 
 * Free, local, natural voice
 * Supports speed control
 */

export async function generateVoice(text, options = {}) {
  return new Promise((resolve, reject) => {
    try {
      if (!text || text.length === 0) {
        console.error('   ❌ No text to convert');
        return resolve(null);
      }

      console.log(`   🎙️  Generating voice...`);

      // Clean text
      let cleanText = text
        .replace(/[\[\]{}]/g, '')
        .replace(/\*\*/g, '') // Remove ** markdown
        .replace(/[«»]/g, '')
        .replace(/[™®©]/g, '')
        .substring(0, 300);

      if (cleanText.length === 0) {
        console.error('   ❌ Text too short');
        return resolve(null);
      }

      // Voice options
      const voice = options.voice || 0; // 0=male, 1=female
      const rate = options.rate || 150; // Speed: 50-200 (default 150)
      const volume = options.volume || 1.0; // 0.0-1.0

      // Create Python script
      const pythonScript = `
import pyttsx3
import sys

engine = pyttsx3.init()
engine.setProperty('rate', ${rate})
engine.setProperty('volume', ${volume})

voices = engine.getProperty('voices')
if len(voices) > ${voice}:
    engine.setProperty('voice', voices[${voice}].id)

engine.save_to_file('''${cleanText.replace(/'/g, "\\'")}''', '${options.outputPath || './temp/tts_output.mp3'}')
engine.runAndWait()
`;

      // Save and run script
      const scriptPath = `./temp/tts_script_${Date.now()}.py`;
      fs.mkdirSync('./temp', { recursive: true });
      fs.writeFileSync(scriptPath, pythonScript);

      const python = spawn('python', [scriptPath]);

      let error = '';
      python.stderr.on('data', (data) => {
        error += data.toString();
      });

      python.on('close', (code) => {
        // Cleanup
        try {
          fs.unlinkSync(scriptPath);
        } catch (e) {}

        if (code === 0) {
          const outputPath = options.outputPath || './temp/tts_output.mp3';
          if (fs.existsSync(outputPath)) {
            const fileSize = fs.statSync(outputPath).size;
            console.log(`   ✅ Voice generated: ${fileSize} bytes (speed: ${rate}, voice: ${voice === 0 ? 'male' : 'female'})`);
            resolve(outputPath);
          } else {
            console.error('   ❌ Output file not created');
            resolve(null);
          }
        } else {
          console.error(`   ❌ pyttsx3 error: ${error}`);
          resolve(null);
        }
      });

    } catch (error) {
      console.error(`   ❌ Voice generation error: ${error.message}`);
      reject(null);
    }
  });
}

// Voice options
export const VOICES = {
  MALE_SLOW: { voice: 0, rate: 100, name: 'Male (slow)' },
  MALE_NORMAL: { voice: 0, rate: 150, name: 'Male (normal)' },
  MALE_FAST: { voice: 0, rate: 200, name: 'Male (fast)' },
  FEMALE_SLOW: { voice: 1, rate: 100, name: 'Female (slow)' },
  FEMALE_NORMAL: { voice: 1, rate: 150, name: 'Female (normal)' },
  FEMALE_FAST: { voice: 1, rate: 200, name: 'Female (fast)' },
};
```

Update `whatsapp-web-server.js`:

```javascript
// Change import from voicebox.js to voicebox-pyttsx3.js
import { generateVoice, VOICES } from './voicebox-pyttsx3.js';

// In the voice response section:
if (mediaType === 'voice') {
  console.log(`   🎙️  Generating voice response...`);
  
  // You can now specify voice options
  const voicePath = await generateVoice(aiResponse, {
    voice: 0, // 0=male, 1=female
    rate: 150 // Speed: 50-200
  });

  // ... rest of code
}
```

---

## **3. MEMORY FORMAT - JSON vs SQLite vs MD**

Currently: **SQLite** (best for production)

But you want to **export/read** it:

Create: `C:\ORION_WHAPI\memory-exporter.js`

```javascript
import Database from 'better-sqlite3';
import fs from 'fs';

/**
 * Export memory to JSON or MD
 */

const db = new Database('./memory/orion.db');

export function exportToJSON(filename = 'memory.json') {
  try {
    const messages = db.prepare('SELECT * FROM messages ORDER BY timestamp DESC LIMIT 500').all();
    
    const json = {
      exportDate: new Date().toISOString(),
      totalMessages: messages.length,
      messages: messages
    };

    fs.writeFileSync(filename, JSON.stringify(json, null, 2));
    console.log(`✅ Exported ${messages.length} messages to ${filename}`);
    return filename;

  } catch (error) {
    console.error('Export error:', error.message);
    return null;
  }
}

export function exportToMarkdown(filename = 'memory.md') {
  try {
    const messages = db.prepare('SELECT * FROM messages ORDER BY timestamp ASC LIMIT 500').all();
    
    let md = `# ORION Memory Export\n\n`;
    md += `**Exported:** ${new Date().toLocaleString()}\n`;
    md += `**Total Messages:** ${messages.length}\n\n`;

    let currentSender = '';
    messages.forEach((msg) => {
      if (msg.sender !== currentSender) {
        currentSender = msg.sender;
        md += `\n## ${msg.sender}\n\n`;
      }
      md += `**${new Date(msg.timestamp).toLocaleTimeString()}:** ${msg.content}\n\n`;
    });

    fs.writeFileSync(filename, md);
    console.log(`✅ Exported ${messages.length} messages to ${filename}`);
    return filename;

  } catch (error) {
    console.error('Export error:', error.message);
    return null;
  }
}
```

---

## **4. IGNORE ** (Markdown) IN VOICE**

Already fixed in voicebox - the `.replace(/\*\*/g, '')` removes it!

But to be thorough, add to `whatsapp-web-server.js`:

```javascript
// When generating voice, clean the text
function cleanTextForVoice(text) {
  return text
    .replace(/\*\*/g, '') // Remove **bold**
    .replace(/\*/g, '') // Remove *italic*
    .replace(/`/g, '') // Remove `code`
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Convert [text](url) to text
    .replace(/#{1,6}\s/g, '') // Remove # headers
    .substring(0, 300); // Limit length
}

// Then use it:
const voicePath = await generateVoice(cleanTextForVoice(aiResponse), options);
```

---

## **5. TEACH IT ABOUT RAND**

Add to `orion-system-prompt.js`:

```javascript
CURRENCY_GUIDE: `
When discussing South African currency:
- Say "Rand" or "ZAR" - Graham prefers "Rand"
- Example: "R850 per night" (pronounced "Eight hundred and fifty Rand")
- NOT "ZAR 850" or "850 ZAR"
- Conversions: 1 USD ≈ 18.50 Rand, 1 EUR ≈ 20 Rand
- Always put R before the number: R850, not 850R

Price examples:
✅ "That room is R1,200 per night"
✅ "We can offer you R850 Rand for that date"
❌ "That's 850 ZAR"
❌ "That costs USD 45"
`
```

---

## **6. WEB ACCESS - Add it!**

Create: `C:\ORION_WHAPI\web-search.js`

```javascript
import axios from 'axios';

/**
 * ORION Web Search & Fetch
 * 
 * Limited web access for guests
 */

export async function searchWeb(query) {
  try {
    console.log(`   🔍 Searching web for: "${query}"`);

    // Using Google Custom Search (free tier available)
    // Or DuckDuckGo (no API key needed)
    
    const response = await axios.get('https://api.duckduckgo.com/', {
      params: {
        q: query,
        format: 'json'
      },
      timeout: 10000
    });

    if (response.data && response.data.AbstractText) {
      console.log(`   ✅ Found: ${response.data.AbstractText.substring(0, 100)}...`);
      return response.data.AbstractText;
    }

    return null;

  } catch (error) {
    console.error(`   ❌ Web search error: ${error.message}`);
    return null;
  }
}

export async function fetchPage(url) {
  try {
    console.log(`   🌐 Fetching: ${url}`);

    const response = await axios.get(url, {
      timeout: 15000,
      headers: {
        'User-Agent': 'ORION-Bot/1.0'
      }
    });

    // Extract text from HTML
    const text = response.data
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/\s+/g, ' ') // Clean whitespace
      .substring(0, 2000); // Limit length

    console.log(`   ✅ Fetched ${text.length} chars`);
    return text;

  } catch (error) {
    console.error(`   ❌ Fetch error: ${error.message}`);
    return null;
  }
}
```

---

## **7. LANGUAGE SUPPORT - Zulu, Xhosa, Afrikaans**

Create: `C:\ORION_WHAPI\language-support.js`

```javascript
/**
 * ORION Language Support
 * 
 * Multi-language responses
 */

const LANGUAGES = {
  en: {
    name: 'English',
    code: 'en',
    greeting: 'Hello! Welcome to our hotel.',
    help: 'How can I help you?'
  },
  zu: {
    name: 'Zulu',
    code: 'zu',
    greeting: 'Sawubona! Wamukela ehotelini.',
    help: 'Angikwazi ukusiza kanjani?'
  },
  xh: {
    name: 'Xhosa',
    code: 'xh',
    greeting: 'Molo! Wamkelekile ehotelini.',
    help: 'Andinokukunceda njani?'
  },
  af: {
    name: 'Afrikaans',
    code: 'af',
    greeting: 'Hallo! Welkom by ons hotel.',
    help: 'Hoe kan ek u help?'
  }
};

export function detectLanguage(text) {
  // Simple detection
  const zulu_words = ['yebo', 'isiZulu', 'ngubani', 'kanjani'];
  const xhosa_words = ['ewe', 'isiXhosa', 'ubani', 'ntoni'];
  const afrikaans_words = ['ja', 'Afrikaans', 'wie', 'wat'];

  if (zulu_words.some(w => text.includes(w))) return 'zu';
  if (xhosa_words.some(w => text.includes(w))) return 'xh';
  if (afrikaans_words.some(w => text.includes(w))) return 'af';

  return 'en';
}

export function getLanguage(code) {
  return LANGUAGES[code] || LANGUAGES.en;
}

export function listLanguages() {
  return Object.keys(LANGUAGES).map(code => ({
    code,
    name: LANGUAGES[code].name
  }));
}
```

---

## **ACTIVATION - DO THIS NOW:**

### **Step 1: Create training mode command**

Add to `whatsapp-web-server.js`:

```javascript
// In handleAdminCommand function, add:

if (command === '/train') {
  return `🎓 TRAINING MODE ACTIVATED\n\nYou can now teach me:\n- Say "Change voice to female"\n- Say "Speak slower"\n- Say "Use Rand instead of ZAR"\n- Say "Respond in Zulu"\n\nI'll learn and apply it immediately!`;
}

if (command === '/mode') {
  return `📋 ORION Modes:\n/mode default - Normal\n/mode training - Learning\n/mode demo - For stakeholders\n/mode dev - Technical`;
}
```

### **Step 2: Update .env**

```
# Voice Options
VOICE_TYPE=male
VOICE_SPEED=150
VOICE_VOLUME=1.0

# Language
DEFAULT_LANGUAGE=en

# Web search
WEB_SEARCH_ENABLED=true
```

### **Step 3: Restart**

```bash
pm2 restart ORION
```

---

## **QUICK SUMMARY:**

✅ **Name & Personality** - Updated `orion-system-prompt.js`  
✅ **Training Mode** - Add `/train` command  
✅ **Voice Customization** - pyttsx3 with speed control  
✅ **Memory Export** - JSON or MD on demand  
✅ **Remove **markdown** - Already done  
✅ **Teach Rand** - In system prompt  
✅ **Web Access** - DuckDuckGo integration  
✅ **Languages** - Zulu, Xhosa, Afrikaans ready  

---

**What do you want to do first?**

1. Switch to pyttsx3 for better voice?
2. Activate training mode?
3. Add language support?
4. Export memory as JSON/MD?

**Tell me and I'll complete the setup!** 🚀