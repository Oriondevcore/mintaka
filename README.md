# ORION Mintaka — Production Setup Guide

**Version:** 1.0  
**Status:** 🟢 Production Ready  
**Last Updated:** 17 March 2026

---

## QUICK START

### Prerequisites
- Windows 10+ (or macOS/Linux)
- Bun v1.3.10+
- Node.js v24.13.0+
- PM2 (will install automatically)

### Installation (5 minutes)

**Step 1: Clone/Download to C:\MINTAKA**
```bash
cd C:\MINTAKA
```

**Step 2: Run setup.bat**
```bash
setup.bat
```

This will:
- ✅ Check Bun and Node.js
- ✅ Create folder structure
- ✅ Install dependencies
- ✅ Create .env template
- ✅ Start PM2

**Step 3: Configure .env**
```bash
notepad .env
```

Add your API keys:
```env
# WhatsApp
ADMIN_NUMBER=27724971810

# AI - Groq (required)
GROQ_API_KEY=sk-xxxxx
GROQ_LLM_API_KEY=sk-xxxxx
GROQ_LLM_MODEL=mixtral-8x7b-32768

# AI - Backups (optional but recommended)
TOGETHER_API_KEY=sk-xxxxx
FIREWORKS_API_KEY=sk-xxxxx

# Vision - Google Gemini (free)
GEMINI_API_KEY=xxxxx

# Email - Cloudflare SMTP
SMTP_HOST=smtp.cloudflare.com
SMTP_PORT=587
SMTP_USER=mintaka@mintaka.oriondevcore.com
SMTP_PASS=your-password
```

**Step 4: Start Mintaka**
```bash
pm2 start ecosystem.config.js
```

**Step 5: Scan WhatsApp QR Code**
```bash
pm2 logs mintaka
# Wait for QR code and scan with WhatsApp
```

---

## GETTING API KEYS

### Groq (AI - Required)
1. Visit https://console.groq.com
2. Sign up (free)
3. Create API key
4. Copy to .env as `GROQ_API_KEY`
5. You get ~60 requests/minute free (plenty for MVP)

### Together.ai (Backup AI - Optional)
1. Visit https://www.together.ai
2. Sign up (free)
3. Create API key
4. Copy to .env as `TOGETHER_API_KEY`
5. 1M tokens/day free tier

### Fireworks.ai (Backup AI - Optional)
1. Visit https://www.fireworks.ai
2. Sign up (free)
3. Create API key
4. Copy to .env as `FIREWORKS_API_KEY`
5. 100+ requests/hour, no token cap

### Google Gemini (Vision - Optional)
1. Visit https://aistudio.google.com/app/apikey
2. Create API key (free, no credit card needed)
3. Copy to .env as `GEMINI_API_KEY`
4. Image analysis is included

### Cloudflare Email (SMTP)
1. Create Cloudflare account (free)
2. Add domain oriondevcore.com
3. Set up email routing to mintaka@mintaka.oriondevcore.com
4. Get SMTP credentials
5. Copy to .env as SMTP_HOST, SMTP_USER, SMTP_PASS

---

## DAILY USAGE

### Start Mintaka
```bash
pm2 start ecosystem.config.js
```

### Monitor Logs
```bash
pm2 logs mintaka
```

### Check Status
```bash
pm2 status
```

### Send Test Message
```bash
# WhatsApp: Send text to Mintaka's number
# Should get instant response
```

### Stop Mintaka
```bash
pm2 stop mintaka
```

### Restart Mintaka
```bash
pm2 restart mintaka
```

---

## FEATURES

### ✅ Voice Messages (STT)
- Send WhatsApp voice note
- Mintaka transcribes with Groq Whisper
- Responds with text

### ✅ Image Analysis (Vision)
- Send photo via WhatsApp
- Mintaka analyzes with Google Gemini
- Describes content, extracts text, OCR

### ✅ File Creation
- Create JSON files
- Create Markdown documents
- Create PDF proposals
- Create HTML emails
- Generate code (Python, JavaScript)

### ✅ Email Drafting
- Mintaka drafts emails
- Shows to Graham for approval
- Sends from mintaka@mintaka.oriondevcore.com
- Auto-BCC Graham

### ✅ AI Provider Redundancy
1. Groq (500ms, fastest)
2. Together.ai (2-3s, 1M tokens/day)
3. Fireworks.ai (2-3s, 100+ req/hour)
4. Ollama Local (5-10s, always works)

If Groq is rate-limited, automatically falls back to next provider.

### ✅ Conversation Memory
- Every message saved to SQLite
- Can reference past conversations
- 8 messages per conversation in context

### ✅ Admin Mode
- Special admin commands (/stats, /help, /health)
- Co-founder mode response style
- Full file system access

---

## COMMANDS

### WhatsApp Commands (Admin Only)

```
/stats     — Show usage statistics
/help      — Show available commands
/mode      — Show current mode
/health    — System health status
```

### Bun Commands

```bash
# Run with hot reload
bun --watch index.js

# Run once
bun run start

# Check syntax
bun check index.js
```

### PM2 Commands

```bash
# Start
pm2 start ecosystem.config.js

# Stop
pm2 stop mintaka

# Restart
pm2 restart mintaka

# Monitor
pm2 monit

# View logs
pm2 logs mintaka

# Save startup
pm2 save
pm2 startup
```

### ngrok (For development/testing)

```bash
# Expose local server
ngrok http 3000

# Copy forwarding URL for webhooks
# https://xxxxx.ngrok.io/api/chat
```

See COMMANDS.md for full reference.

---

## FOLDER STRUCTURE

```
C:\MINTAKA\
├── index.js                    Main WhatsApp handler
├── ai.js                       AI provider chain
├── files.js                    File I/O operations
├── email.js                    Email handling
├── stt.js                      Speech-to-text (Groq Whisper)
├── vision.js                   Image analysis (Gemini)
├── memory.js                   SQLite database
├── prompt.js                   System personality
├── package.json                Dependencies
├── ecosystem.config.js         PM2 configuration
├── .env                        Secrets (NEVER commit)
├── setup.bat                   Installation script
├── README.md                   This file
├── ARCHITECTURE.md             System design
├── COMMANDS.md                 Command reference
├── DEVLOG.md                   Build status
├── TROUBLESHOOTING.md          Debug guide
├── guardrails.md               Permissions
│
├── outputs/                    Mintaka's creations
│   ├── proposals/              Sales proposals
│   ├── documents/              Generated docs
│   ├── code/                   Generated code
│   ├── data/                   JSON, CSV files
│   └── archive/                Old files (quarterly)
│
├── documents/                  Reference docs
│   ├── orion-master.md         ORION knowledge
│   ├── hotel-specs/            Hotel details
│   └── legal/                  Contracts
│
├── knowledge/                  Knowledge base (.md files)
│   ├── orion-core.md
│   ├── sales-playbook.md
│   └── [more files]
│
├── data/
│   └── mintaka.db              SQLite database
│
├── logs/
│   ├── error.log               Error logs (PM2)
│   ├── out.log                 Output logs (PM2)
│   └── combined.log
│
└── .wwebjs_auth/
    └── session-mintaka/        WhatsApp session (auto-managed)
```

---

## TROUBLESHOOTING

### "Bun not found"
```bash
# Install Bun
powershell -c "irm https://bun.sh/install.ps1|iex"
```

### "WhatsApp not connecting"
```bash
# Clear session
rmdir /s .wwebjs_auth

# Restart
pm2 restart mintaka

# Wait for new QR code
pm2 logs mintaka --follow
```

### "AI returns gibberish"
```bash
# Check .env has valid API keys
cat .env | findstr GROQ_API_KEY

# Test AI providers
node -e "import('./ai.js').then(m => m.testProviders())"
```

### "Port 3000 already in use"
```bash
# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port
API_PORT=3001 bun run start
```

See **TROUBLESHOOTING.md** for complete debug guide.

---

## PERFORMANCE OPTIMIZATION

### Use Quantized Models
For local Ollama backup, use quantized models:
```bash
ollama pull phi3:mini      # 3.8B, fast
ollama pull gemma:2b       # 2B, very fast
ollama pull tinyllama:1.1b # 1.1B, ultra-fast
```

### Monitor Resources
```bash
pm2 monit
# Watch CPU, RAM, Restarts
```

### Cache Responses
Identical queries return cached responses instantly (via provider caching).

### Rate Limiting
Groq has ~60 requests/minute. If hit:
- Automatically falls back to Together.ai
- Then Fireworks.ai
- Finally Ollama (local, never fails)

---

## SECURITY BEST PRACTICES

### Never Commit .env
```bash
# .env is in .gitignore
# NEVER push API keys to GitHub
```

### Rotate Secrets Regularly
```bash
# Quarterly: Generate new API keys
# Update .env
# Restart Mintaka
pm2 restart mintaka
```

### Use Environment Variables
```bash
# Don't hardcode secrets
# Always use process.env.SECRET_KEY
```

### Backup Database
```bash
# Daily backup
copy data\mintaka.db data\mintaka.db.backup-$(date)
```

---

## ADVANCED

### Custom Prompt
Edit `prompt.js` to change personality:
```javascript
export function getPrompt(name) {
  return `You are Mintaka...`
}
```

### Add Knowledge Files
Drop .md files in `./knowledge/`:
```
./knowledge/
├── orion-core.md
├── sales-playbook.md
└── hospitality-industry.md
```

Mintaka auto-loads them.

### Deploy to Cloud
For Phase 2:
1. Container: Docker/Bun
2. Cloud: Cloudflare Workers / Railway
3. DB: PostgreSQL
4. Vector DB: Pinecone for RAG

---

## SUPPORT

### Error? Check These First
1. **TROUBLESHOOTING.md** — 80% of issues covered
2. **COMMANDS.md** — Reference for all tools
3. **DEVLOG.md** — What's been built/fixed

### Contact Graham
- **Email:** graham@oriondevcore.com
- **WhatsApp:** +27 72 497 1810
- **Location:** Amanzimtoti, KwaZulu-Natal 🇿🇦

### Contact Mintaka
- **Email:** mintaka@mintaka.oriondevcore.com
- **WhatsApp:** 27703080516

---

## VERSION HISTORY

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 17 Mar 2026 | Initial production release |
| | | - STT voice input |
| | | - File creation |
| | | - Image analysis |
| | | - Email drafting |
| | | - Multi-provider AI chain |

---

## ROADMAP

### Phase 1 (NOW) ✅
- ✅ Voice input (STT)
- ✅ File creation
- ✅ Image analysis
- ✅ Email handling
- ✅ Multi-provider AI

### Phase 2 (NEXT)
- [ ] George meeting (Zar + View)
- [ ] First signed contract
- [ ] Naledi cloud deployment
- [ ] Multi-tenant hotels

### Phase 3 (LATER)
- [ ] ORION modules (ARMI, PVR, SNAG)
- [ ] AI Vision integration
- [ ] 10+ hotels live
- [ ] Series A funding

---

**Built in Africa. Engineered for Impact.** 🌍

---

**Questions?** Check the docs or contact Graham.
