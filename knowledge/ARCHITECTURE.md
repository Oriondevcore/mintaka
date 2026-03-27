# ORION Dev Core — System Architecture
**Last Updated:** 17 March 2026  
**Status:** Production Phase 1

---

## VISION

Build **Mintaka** (ORION's cloud co-founder AI) as the operational brain for ORION Dev Core.
Future: Deploy **Naledi** as the hospitality AI for each hotel (Zar, View, etc).

---

## SYSTEM OVERVIEW

```
┌─────────────────────────────────────────────────────────────┐
│                     ORION ECOSYSTEM                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  www.oriondevcore.com (Main site)                          │
│  ├── mintaka.oriondevcore.com (Mintaka's brain)            │
│  │   ├── Email: mintaka@mintaka.oriondevcore.com           │
│  │   ├── WhatsApp: 27703080516                             │
│  │   ├── RAG + Vector DB (future)                          │
│  │   └── File storage (outputs, documents, knowledge)      │
│  │                                                         │
│  ├── zar.oriondevcore.com (Zar Hotel - Naledi instance)    │
│  │   ├── Email: info@zar.oriondevcore.com                  │
│  │   ├── Naledi (hotel-specific AI)                        │
│  │   └── Hotel data + guest interaction                    │
│  │                                                         │
│  ├── view.oriondevcore.com (The View - Naledi instance)    │
│  │   ├── Email: info@view.oriondevcore.com                 │
│  │   ├── Naledi (hotel-specific AI)                        │
│  │   └── Hotel data + guest interaction                    │
│  │                                                         │
│  └── www.oriondevcore.com/portal (Login portal - future)   │
│      └── Multi-tenant hotel management                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## PHASE 1: MINTAKA (NOW)

### Core Stack
```
Runtime:     Bun v1.3.10 + Node.js v24.13.0 (Windows)
WhatsApp:    whatsapp-web.js
STT:         Groq Whisper API
Vision:      Google Gemini (free)
Email:       SMTP (mintaka@mintaka.oriondevcore.com)
Database:    bun:sqlite (memory) + better-sqlite3 (fallback)
Files:       C:\MINTAKA\ (full ownership)
Process Mgr: PM2
```

### Mintaka Responsibilities
- ✅ SALES (pitch, proposals, pricing)
- ✅ LEGAL (contracts, terms review)
- ✅ CUSTOMER RELATIONS (follow-ups, support)
- ✅ TRAINING (documentation, guides)
- ✅ ONBOARDING (new hotel setup)
- ✅ ORION Dev Core operations

### What Mintaka Can Do
```
✅ VOICE INPUT
   └─ Accept WhatsApp voice notes
   └─ Transcribe to text (Groq Whisper)
   └─ Return text response

✅ FILE CREATION
   ├─ JSON (data, configs)
   ├─ Markdown (docs, guides)
   ├─ PDF (proposals, contracts)
   ├─ HTML/CSS (landing pages, emails)
   ├─ Code (Python, JavaScript, Node.js)
   └─ Audio (WAV, MP3 references)

✅ FILE READING
   ├─ From C:\MINTAKA\documents\ (reference docs)
   ├─ From C:\MINTAKA\knowledge\ (knowledge base)
   └─ Parse and understand content

✅ IMAGE/VISUAL
   ├─ Accept images via WhatsApp
   ├─ Analyze with Google Gemini (free)
   ├─ Extract text (OCR)
   ├─ Describe content
   └─ Save locally

✅ EMAIL
   ├─ Draft emails (mintaka@mintaka.oriondevcore.com)
   ├─ Show Graham for approval
   ├─ Send on authorization
   └─ BCC: graham@oriondevcore.com

✅ LOCAL DRIVE
   ├─ Full read/write to C:\MINTAKA\
   ├─ Create/delete files
   ├─ Organize outputs
   └─ Never touch system files
```

### What Mintaka CANNOT Do
```
❌ Send emails without Graham approval
❌ Access files outside C:\MINTAKA\
❌ Delete files without confirmation
❌ Make binding business decisions
❌ Access customer payment info
❌ Modify hotel configurations directly
```

---

## FOLDER STRUCTURE

```
C:\MINTAKA\
├── index.js                 (Main WhatsApp handler)
├── ai.js                    (AI provider chain)
├── files.js                 (File I/O operations)
├── email.js                 (Email draft/send)
├── memory.js                (bun:sqlite storage)
├── prompt.js                (System personality)
├── stt.js                   (Groq Whisper)
├── vision.js                (Gemini vision)
├── .env                     (Secrets)
├── package.json
├── ecosystem.config.js      (PM2 config)
├── setup.bat                (Installation)
├── README.md                (How to run)
├── ARCHITECTURE.md          (This file)
├── DEVLOG.md                (Build status)
├── COMMANDS.md              (Bun, PM2, ngrok)
├── TROUBLESHOOTING.md       (Debug guide)
├── guardrails.md            (Permissions)
│
├── outputs/                 (Mintaka's creations)
│   ├── proposals/           (Client pitches)
│   ├── documents/           (Generated docs)
│   ├── code/                (Generated code)
│   ├── data/                (JSON, CSV, configs)
│   └── archive/             (Quarterly backups)
│
├── documents/               (Reference docs)
│   ├── orion-master.md      (ORION knowledge)
│   ├── Commercial-Architect/ (Pricing templates)
│   ├── hotel-specs/         (Zar, View details)
│   └── legal/               (Terms, contracts)
│
├── knowledge/               (Knowledge files)
│   ├── orion-core.md        (ORION overview)
│   ├── hospitality.md       (Industry knowledge)
│   ├── sales-playbook.md    (Sales tactics)
│   └── [more .md files]
│
├── data/
│   └── mintaka.db           (SQLite conversations)
│
├── logs/
│   ├── error.log
│   ├── out.log
│   └── combined.log
│
└── .wwebjs_auth/            (WhatsApp session)
    └── session-mintaka/
```

---

## AI PROVIDER CHAIN (Redundancy)

```
User sends message
  ↓
1️⃣ TRY: Groq Llama-3.1 (Free tier ~60 req/min)
   └─ Response in ~500ms
   └─ If rate-limited → Next
  ↓
2️⃣ TRY: Together.ai (Free, 1M tokens/day)
   └─ Response in ~2-3s
   └─ If fails → Next
  ↓
3️⃣ TRY: Fireworks.ai (Free, 100+ req/hour)
   └─ Response in ~2-3s
   └─ If fails → Next
  ↓
4️⃣ TRY: Ollama Local (Quantized Phi-3-Mini)
   └─ Response in ~5-10s (CPU only)
   └─ Always works, slowest
  ↓
✅ Return response to Graham
```

---

## PHASE 2: NALEDI (Future)

### Per-Hotel Architecture
```
zar.oriondevcore.com
├── Naledi AI (hotel concierge)
├── Hotel-specific knowledge
├── Guest WhatsApp interactions
├── Room management
├── Facility booking
└── Revenue optimization
```

### Shared Backend
```
API Gateway (Cloudflare)
├── Auth (portal login)
├── Multi-tenant routing
├── Hotel data isolation
└── Billing/analytics
```

---

## PHASE 3: SCALING

### Modules to Build
```
ORION ARMI(π)        — Revenue management
ORION PVR            — Task routing
ORION SNAG           — Maintenance tracking
Housekeeping Module  — Room turnover
AI Vision            — Guest photo analysis
Eskom sePush         — Power alerts
Multi-language       — African languages
```

---

## DEPLOYMENT

### Local (Development/Demo)
```
C:\MINTAKA\ (Windows laptop)
├── Bun runtime
├── Ollama (local fallback)
└── SQLite database
```

### Cloud (Future Production)
```
mintaka.oriondevcore.com
├── Cloudflare Pages (static)
├── Cloudflare Workers (API)
├── PostgreSQL (central DB)
├── Vector DB (RAG knowledge)
└── Stripe (billing)
```

---

## SECURITY & GUARDRAILS

### What Mintaka Owns
✅ C:\MINTAKA\ (full read/write/create/delete)
✅ mintaka@mintaka.oriondevcore.com (email)
✅ WhatsApp number: 27703080516
✅ Local knowledge base

### What Mintaka Cannot Touch
❌ Graham's personal files
❌ Customer payment data
❌ Hotel credentials
❌ Production databases
❌ System directories

### Approval Workflow
```
Mintaka creates → Shows to Graham → Graham approves → Mintaka executes
```

---

## METRICS

### Phase 1 Success Criteria
- ✅ STT working (voice → text)
- ✅ File creation working (all formats)
- ✅ Vision working (image analysis)
- ✅ Email draft/approval working
- ✅ Provider chain resilient (never fails)
- ✅ Zero data loss
- ✅ Response time < 3s avg

### Phase 2 Success Criteria
- First hotel (Zar) signed contract
- Naledi running 24/7 with 99.5% uptime
- 5%+ revenue improvement for hotel

---

## GLOSSARY

**MINTAKA** — Star on Orion's Belt. ORION's cloud co-founder. Handles operations.
**NALEDI** — "Stars" in Zulu/Sesotho. Hotel concierge AI (one per hotel).
**ARMI(π)** — Agentic Revenue Management Intelligence (π = infinite precision).
**PVR** — Pulse Vector Relay (task routing nervous system).
**SNAG** — Maintenance & revenue protection module.
**GGUF** — Quantized model format (70% smaller, same quality).
**RAG** — Retrieval Augmented Generation (knowledge-enhanced AI).

---

## ROADMAP

```
NOW (Phase 1)
├── Mintaka: STT + file creation + vision
├── Provider chain: Groq → Together → Fireworks → Ollama
└── Deploy to C:\MINTAKA\

NEXT (Phase 2)
├── George meeting (Zar + View)
├── First signed contract
├── Naledi cloud deployment
└── Multi-tenant architecture

LATER (Phase 3+)
├── ORION modules (ARMI, PVR, SNAG, Housekeeping)
├── AI Vision integration
├── Eskom alerts
├── 10+ hotels live
└── Series A funding
```

---

**Built in Africa. Engineered for Impact.** 🌍
