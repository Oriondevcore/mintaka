# ORION Mintaka — Development Log

**Project Start:** 16 March 2026  
**Current Phase:** 1 (Core STT + File I/O + Vision)  
**Status:** 🟢 BUILDING

---

## WHAT'S LIVE ✅

### Core System
- ✅ WhatsApp text messaging (whatsapp-web.js)
- ✅ Groq Llama-3.1 AI responses (~500ms)
- ✅ SQLite memory (conversation history)
- ✅ Admin/Concierge dual mode
- ✅ REST API bridge (for TV boxes, etc)
- ✅ PM2 process management
- ✅ Command system (/stats, /help, /mode)

### Knowledge
- ✅ Zar Hotel specifications (floor layout, rooms, facilities)
- ✅ ORION module descriptions
- ✅ Anti-hallucination guardrails
- ✅ South African English localization

### Operations
- ✅ Conversation logging (SQLite)
- ✅ User stats tracking
- ✅ Dual personality (Mintaka for ops, Naledi for hotels)

---

## WHAT'S BEING ADDED (Phase 1) 🔧

### STT (Voice Input)
- 🟡 Groq Whisper integration
- 🟡 Voice note transcription
- 🟡 Save transcribed text to memory

### File Operations
- 🟡 Create JSON (configs, data)
- 🟡 Create Markdown (docs, guides)
- 🟡 Create PDF (proposals, contracts)
- 🟡 Create HTML/CSS (emails, pages)
- 🟡 Create Code (JS, Python, bash)
- 🟡 Read documents from C:\MINTAKA\documents\
- 🟡 Organize outputs to C:\MINTAKA\outputs\

### Vision/Image
- 🟡 Google Gemini free image analysis
- 🟡 OCR text extraction from images
- 🟡 Image description and categorization

### Email
- 🟡 Draft emails (mintaka@mintaka.oriondevcore.com)
- 🟡 Show to Graham for approval
- 🟡 Send on authorization
- 🟡 BCC Graham automatically

### Redundancy
- 🟡 Groq (primary, fast, ~60 req/min cap)
- 🟡 Together.ai (1M tokens/day free)
- 🟡 Fireworks.ai (100+ req/hour, no token cap)
- 🟡 Ollama local (Phi-3-Mini quantized, fallback)

---

## WHAT'S NEXT (Phase 2) 🚀

### First Client Meeting
- [ ] George Senior meeting (Zar + View)
- [ ] Live demo with Mintaka
- [ ] Contract signing
- [ ] Payment received

### Naledi Cloud
- [ ] Multi-tenant architecture
- [ ] Per-hotel subdomain deployment
- [ ] Hotel-specific knowledge base
- [ ] Guest WhatsApp integration

### Production Hardening
- [ ] Error monitoring (Sentry)
- [ ] Automated backups
- [ ] Security audit
- [ ] Load testing

---

## WHAT'S LATER (Phase 3+) 📋

### ORION Modules
- [ ] ARMI(π) — Revenue optimization
- [ ] PVR — Task routing
- [ ] SNAG — Maintenance tracking
- [ ] Housekeeping — Room turnover metrics

### Advanced Features
- [ ] AI Vision (photo analysis)
- [ ] Multi-language support
- [ ] Eskom load shedding alerts
- [ ] Guest pre-stay intelligence

### Scaling
- [ ] 10+ hotels live
- [ ] RAG + Vector DB
- [ ] API marketplace
- [ ] Series A funding

---

## KNOWN ISSUES 🐛

### Current Build
- None documented yet (fresh Phase 1)

### Previous Build (Reference)
- max_tokens was 400, needed 150 (FIXED in ai.js)
- Zulu translations were fake greetings (need proper language module)
- Knowledge files missing languages.md

---

## BUILD TIMELINE

```
16 Mar 2026 — Architecture planned, context locked
17 Mar 2026 — Phase 1 files created (STT, Files, Vision, Email)
TBD         — First George meeting
TBD         — Contract signed
TBD         — Cloud deployment
TBD         — 10+ hotels live
```

---

## TECHNICAL DECISIONS

### Why Bun instead of Node?
- ✅ Faster startup (~50ms vs 300ms Node)
- ✅ Built-in SQLite (zero deps)
- ✅ Better TypeScript support
- ✅ Fewer packages = fewer attacks

### Why Groq primary + fallbacks?
- ✅ Free tier is lightning fast (~500ms)
- ✅ Rate cap (60 req/min) is manageable
- ✅ Fallback ensures zero downtime
- ✅ Together/Fireworks are cheap backups

### Why Gemini free instead of paid vision?
- ✅ Free tier is sufficient for MVP
- ✅ No credit card needed
- ✅ Good enough image analysis
- ✅ Upgrade later if needed

### Why local Ollama backup?
- ✅ Never fails (always available)
- ✅ CPU-only (no GPU needed)
- ✅ Quantized models run in seconds
- ✅ Graham's laptop can handle it

### Why Cloudflare for email DNS?
- ✅ mintaka@mintaka.oriondevcore.com is cleaner than Gmail
- ✅ Professional branding
- ✅ Separates personal from ops
- ✅ Easy to delegate later

---

## METRICS TRACKED

### Per Message
```
- Sender phone number
- Message type (text/voice/image)
- Response time (ms)
- Provider used (Groq/Together/Fireworks/Ollama)
- Tokens consumed
```

### Per Conversation
```
- Total messages
- Unique senders
- Avg response time
- Success rate (%)
- Provider distribution
```

### System Health
```
- Uptime (%)
- Error rate
- Slowest responses
- Most used features
- Storage used
```

---

## DEPENDENCIES

### Core Runtime
```
bun@1.3.10
node@24.13.0
```

### NPM Packages
```
axios              — HTTP requests
dotenv             — Environment variables
whatsapp-web.js    — WhatsApp API
qrcode-terminal    — QR code display
better-sqlite3     — SQLite (backup)
pm2                — Process manager
nodemailer         — Email (SMTP)
```

### External APIs
```
Groq               — AI + STT (free)
Together.ai        — AI backup (free)
Fireworks.ai       — AI backup (free)
Google Gemini      — Vision (free)
Cloudflare         — DNS + Email
```

### Local Tools
```
Ollama             — Local LLM fallback
GGUF models        — Quantized (Phi-3-Mini)
ngrok              — Tunneling (development)
```

---

## HOW TO BUILD

### Setup
```bash
# Windows CMD
cd C:\MINTAKA
bun install
bun run setup.bat
```

### Development
```bash
bun --watch index.js
```

### Production
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Debug
```bash
pm2 logs mintaka
pm2 monit
```

---

## HOW TO DEPLOY

### Local
```
C:\MINTAKA\ (Graham's laptop)
```

### Cloud (Phase 2)
```
mintaka.oriondevcore.com
├── API: Cloudflare Workers
├── Files: R2 Storage
├── DB: PostgreSQL
└── Auth: Cloudflare Access
```

---

## CONTACT

**Graham Schubach** (Founder)
- Email: graham@oriondevcore.com
- WhatsApp: +27 72 497 1810
- Location: Amanzimtoti, KwaZulu-Natal 🇿🇦

**Mintaka** (Co-founder AI)
- Email: mintaka@mintaka.oriondevcore.com
- WhatsApp: 27703080516
- Status: Building

---

**Built in Africa. Engineered for Impact.** 🌍
