# ORION Mintaka — Troubleshooting Guide

**Step-by-step solutions for common problems.**

---

## TABLE OF CONTENTS

1. [Installation Issues](#installation-issues)
2. [WhatsApp Connection](#whatsapp-connection)
3. [AI Response Issues](#ai-response-issues)
4. [File Operations](#file-operations)
5. [Email/SMTP Issues](#emailsmtp-issues)
6. [Performance Issues](#performance-issues)
7. [Database Issues](#database-issues)
8. [Advanced Debugging](#advanced-debugging)

---

## INSTALLATION ISSUES

### Problem: "bun: command not found"

**Symptom:**
```
bun: command not found
```

**Solution:**

Step 1: Check if Bun is installed
```bash
bun --version
```

Step 2: If not installed, install Bun
```bash
powershell -c "irm https://bun.sh/install.ps1|iex"
```

Step 3: Close and reopen PowerShell/CMD

Step 4: Verify installation
```bash
bun --version
# Should show: 1.3.10 or higher
```

---

### Problem: "npm ERR! enoent ENOENT: no such file or directory"

**Symptom:**
```
npm ERR! enoent ENOENT: no such file or directory, open 'C:\MINTAKA\package-lock.json'
```

**Solution:**

Step 1: Delete lock files
```bash
cd C:\MINTAKA
del package-lock.json
del bun.lock
```

Step 2: Reinstall dependencies
```bash
bun install
```

Step 3: Verify node_modules exists
```bash
dir node_modules
# Should show many folders
```

---

### Problem: ".env file not found"

**Symptom:**
```
❌ GROQ_API_KEY not configured
❌ OPENROUTER_KEY missing
```

**Solution:**

Step 1: Check if .env exists
```bash
cd C:\MINTAKA
dir .env
```

Step 2: If missing, create it
```bash
copy .env.example .env
```

Step 3: Edit .env and add your keys
```bash
notepad .env
# Add:
# GROQ_API_KEY=sk-your-key-here
# OPENROUTER_KEY=sk-your-key-here
# etc.
```

Step 4: Save and restart Mintaka
```bash
pm2 restart mintaka
```

---

## WHATSAPP CONNECTION

### Problem: "QR code not appearing"

**Symptom:**
```
📱 Scan this QR code with WhatsApp:
[But no QR code shows]
```

**Solution:**

Step 1: Check terminal encoding
```bash
# Make sure terminal is UTF-8
chcp 65001
```

Step 2: Clear WhatsApp session
```bash
cd C:\MINTAKA
rmdir /s .wwebjs_auth
```

Step 3: Restart Mintaka
```bash
pm2 restart mintaka
```

Step 4: Wait for QR code (takes 10-15 seconds)

Step 5: Scan with WhatsApp on your phone

---

### Problem: "WhatsApp disconnected immediately after scanning"

**Symptom:**
```
[Scanned QR code]
✅ MINTAKA IS LIVE ON WHATSAPP
⚠️  Disconnected: [reason]
```

**Solution:**

Step 1: Check logs for disconnect reason
```bash
pm2 logs mintaka
# Look for "Disconnected: [specific reason]"
```

**If reason is "LOGOUT":**
```bash
# WhatsApp detected login from another device
# Clear session and re-scan
rmdir /s .wwebjs_auth
pm2 restart mintaka
```

**If reason is "RESTART":**
```bash
# Normal restart, should reconnect
# Wait 30 seconds and check
pm2 logs mintaka
```

**If reason is "KICK":**
```bash
# Session kicked by WhatsApp server
# Clear and restart
pm2 kill
bun install
pm2 start ecosystem.config.js
```

Step 2: Verify phone WhatsApp app is still running

Step 3: Check if Mintaka number is in phone contacts

Step 4: Try again
```bash
pm2 logs mintaka --follow
# Watch for connection status
```

---

### Problem: "Messages not being received"

**Symptom:**
```
[Send message to Mintaka]
[No response]
pm2 logs shows nothing
```

**Solution:**

Step 1: Verify Mintaka is connected
```bash
pm2 status
# Should show "online" for mintaka process
```

Step 2: Check if process crashed
```bash
pm2 logs mintaka --err
# Look for error messages
```

Step 3: Verify number formatting
```bash
# WhatsApp uses format: 27724971810 (no +)
# Make sure ADMIN_NUMBER in .env is correct
cat .env | findstr ADMIN_NUMBER
```

Step 4: Try sending a message from new contact
```bash
# Add Mintaka's number to your phone contacts
# Then send a message
# If it works, messaging is fine
```

Step 5: Check if in group chat (Mintaka ignores groups)
```bash
# Send message in 1-on-1 chat only
# Mintaka ignores group messages
```

---

## AI RESPONSE ISSUES

### Problem: "All AI providers failed"

**Symptom:**
```
❌ Groq failed: connect ECONNREFUSED
❌ OpenRouter failed: 401 Unauthorized
❌ Ollama failed: connect ECONNREFUSED
❌ All providers failed
Response: "Sorry, I could not reach any AI service"
```

**Solution:**

Step 1: Check internet connection
```bash
ping google.com
# Should show responses, not "Destination host unreachable"
```

Step 2: Verify API keys
```bash
cat .env | findstr GROQ_API_KEY
cat .env | findstr OPENROUTER_KEY
# Should show real keys, not blank or "sk-..."
```

Step 3: Test Groq API directly
```bash
# If on Windows with curl:
curl -X POST https://api.groq.com/openai/v1/chat/completions ^
  -H "Authorization: Bearer YOUR_GROQ_KEY" ^
  -H "Content-Type: application/json" ^
  -d "{\"model\":\"llama-3.1-8b-instant\",\"messages\":[{\"role\":\"user\",\"content\":\"Hi\"}]}"

# Should return a response (not 401 or 403)
```

Step 4: Start Ollama as fallback
```bash
# Open new Command Prompt
ollama serve
# In another terminal, pull model
ollama pull phi3:mini
```

Step 5: Restart Mintaka
```bash
pm2 restart mintaka
```

Step 6: Try sending message again

---

### Problem: "Response takes 30+ seconds"

**Symptom:**
```
[Send message]
[Wait 30+ seconds]
[Finally get response]
```

**Solution:**

Step 1: Check which provider is being used
```bash
pm2 logs mintaka
# Look for: "Groq", "OpenRouter", "Ollama"
```

**If Ollama:**
```bash
# Ollama is slow on CPU-only machines
# This is expected (5-15 seconds is normal)
# To speed up:

# 1. Use quantized model
ollama pull phi3:mini

# 2. Switch to Groq in ai.js (if Groq working)
```

**If Groq:**
```bash
# Groq should be ~500ms
# If slow, check internet connection
ping api.groq.com
```

Step 2: Check system resources
```bash
# Task Manager
# Check CPU and RAM usage
# If maxed out, close other programs
```

Step 3: Check if hit rate limit
```bash
pm2 logs mintaka
# Look for: "429 Too Many Requests"
# If yes, Groq rate limit hit
# Wait 60 seconds, try again
```

---

### Problem: "Response is gibberish or nonsensical"

**Symptom:**
```
You: "What is ORION?"
Mintaka: "asdfjkl; qwerty zxcv 12345 random words"
```

**Solution:**

Step 1: Verify system prompt is loaded
```bash
# Check prompt.js file exists
dir C:\MINTAKA\prompt.js

# Verify getPrompt() function returns text
# Test by adding logging to ai.js
```

Step 2: Try asking a simple question
```bash
You: "Hi"
# Should get normal greeting
```

Step 3: Clear memory and try again
```bash
# Back up current database
copy data\mintaka.db data\mintaka.db.backup

# Delete database (clears memory)
del data\mintaka.db

# Restart Mintaka
pm2 restart mintaka

# Try asking again
```

---

## FILE OPERATIONS

### Problem: "Cannot create file - permission denied"

**Symptom:**
```
❌ Permission denied: C:\MINTAKA\outputs\proposal.pdf
```

**Solution:**

Step 1: Check folder permissions
```bash
# Right-click C:\MINTAKA\ → Properties → Security
# Check "Modify" is allowed for your user
```

Step 2: Create output folder if missing
```bash
mkdir C:\MINTAKA\outputs
mkdir C:\MINTAKA\outputs\proposals
mkdir C:\MINTAKA\outputs\documents
mkdir C:\MINTAKA\outputs\code
mkdir C:\MINTAKA\outputs\data
```

Step 3: Grant full permissions
```bash
# Right-click C:\MINTAKA\ → Properties → Security
# Click Edit → Your User → Full Control → OK
```

Step 4: Try creating file again

---

### Problem: "File created but can't find it"

**Symptom:**
```
Mintaka: "✅ CREATED: proposal.pdf → C:\MINTAKA\outputs\proposals\proposal.pdf"
You: [Check folder, file is not there]
```

**Solution:**

Step 1: Check if folder structure exists
```bash
dir C:\MINTAKA\outputs\
dir C:\MINTAKA\outputs\proposals\
```

Step 2: Check full file path in message
```bash
# Copy exact path from Mintaka's message
# E.g., C:\MINTAKA\outputs\proposals\proposal.pdf
# Check if path is correct
```

Step 3: Search for file
```bash
# Windows File Explorer
# Press Ctrl+F
# Search for filename
```

Step 4: Check recent files
```bash
# File Explorer → Recent
# Look for the file there
```

---

### Problem: "Cannot read document file"

**Symptom:**
```
You: "Read the Commercial Architect document for me"
Mintaka: "I don't have access to that file"
```

**Solution:**

Step 1: Verify file exists
```bash
dir C:\MINTAKA\documents\
# Should show the file
```

Step 2: Check file format
```bash
# Supported: .md, .txt, .json, .csv
# PDF/DOCX need to be converted to text first
```

Step 3: Copy file to documents folder
```bash
# Copy file to: C:\MINTAKA\documents\
# E.g., C:\MINTAKA\documents\Commercial-Architect.md
```

Step 4: Try again
```bash
You: "Summarize Commercial-Architect.md"
```

---

## EMAIL/SMTP ISSUES

### Problem: "SMTP connection failed"

**Symptom:**
```
❌ SMTP Error: connect ECONNREFUSED 127.0.0.1:587
```

**Solution:**

Step 1: Verify SMTP credentials
```bash
cat .env | findstr SMTP
# Should show:
# SMTP_HOST=smtp.cloudflare.com
# SMTP_PORT=587
# SMTP_USER=mintaka@mintaka.oriondevcore.com
# SMTP_PASS=your-password
```

Step 2: Check internet connection
```bash
ping smtp.cloudflare.com
# Should respond
```

Step 3: Verify email account exists
```bash
# Log in to Cloudflare dashboard
# Verify mintaka@mintaka.oriondevcore.com is created
# Verify password is correct
```

Step 4: Use app-specific password (if 2FA enabled)
```bash
# Generate app-specific password
# Replace SMTP_PASS with app-specific password
```

Step 5: Test SMTP manually
```bash
# Windows 10+: Test-NetConnection smtp.cloudflare.com -Port 587
# Should show: TcpTestSucceeded: True
```

---

### Problem: "Email sent but Graham didn't receive it"

**Symptom:**
```
✅ Email sent to graham@oriondevcore.com
[But Graham never gets it]
```

**Solution:**

Step 1: Check spam folder
```bash
# Email might be in Spam/Junk folder
# Add mintaka@mintaka.oriondevcore.com to contacts
```

Step 2: Verify sender address
```bash
cat .env | findstr SMTP_USER
# Should be: SMTP_USER=mintaka@mintaka.oriondevcore.com
```

Step 3: Check email logs
```bash
pm2 logs mintaka | findstr "email"
# Look for send confirmation
```

Step 4: Re-send with subject
```bash
# Next email should have clear subject
# E.g., "MINTAKA: Proposal for The Zar Hotel"
```

---

## PERFORMANCE ISSUES

### Problem: "Mintaka is very slow (freezes)"

**Symptom:**
```
[Send message]
[Wait 60+ seconds]
[No response]
```

**Solution:**

Step 1: Check CPU and RAM
```bash
# Task Manager → Performance
# Check if CPU is maxed out
# Check if RAM is maxed out
```

**If CPU maxed:**
```bash
# Close other applications
# Restart Mintaka
pm2 restart mintaka
```

**If RAM maxed:**
```bash
# Increase available RAM
# Or switch to lighter model (already using Phi-3-Mini)
```

Step 2: Check database size
```bash
dir data\mintaka.db
# If > 1GB, database might be slow
# Back up and start fresh
copy data\mintaka.db data\mintaka.db.old
del data\mintaka.db
pm2 restart mintaka
```

Step 3: Check process count
```bash
pm2 list
# Should show only 1 mintaka process
# If multiple, kill extras
pm2 kill
pm2 start ecosystem.config.js
```

---

### Problem: "Ollama very slow (taking minutes)"

**Symptom:**
```
[Using local Ollama]
[Response takes 2-5 minutes]
```

**Solution:**

Step 1: This is expected with CPU-only
```bash
# CPU-only LLMs are 10-100x slower than GPU
# 5-15 seconds is normal for Phi-3-Mini
# If taking minutes, something else is wrong
```

Step 2: Check if Ollama is actually running
```bash
curl http://localhost:11434/api/tags
# Should return model list
```

Step 3: Use lighter model
```bash
ollama pull tinyllama:1.1b
ollama pull gemma:2b
# Then update OLLAMA_MODEL in .env
```

Step 4: Close other apps to free RAM

---

## DATABASE ISSUES

### Problem: "SQLite database locked"

**Symptom:**
```
❌ Database is locked
Error: SQLITE_BUSY
```

**Solution:**

Step 1: Kill Mintaka process
```bash
pm2 stop mintaka
```

Step 2: Wait 5 seconds

Step 3: Restart
```bash
pm2 start ecosystem.config.js
```

Step 4: If still locked, delete DB
```bash
# Back up first
copy data\mintaka.db data\mintaka.db.backup

# Delete
del data\mintaka.db

# Restart (will create new DB)
pm2 restart mintaka
```

---

### Problem: "Lost conversation history"

**Symptom:**
```
[Talked to Mintaka yesterday]
[Today, Mintaka doesn't remember]
```

**Solution:**

Step 1: Check if database file exists
```bash
dir data\mintaka.db
# Should exist and be > 1KB
```

Step 2: Check if PM2 is using different database
```bash
pm2 logs mintaka
# Look for database path in logs
```

Step 3: Verify history query works
```bash
# Add debug logging to memory.js
# Check if getHistory() returns results
```

---

## ADVANCED DEBUGGING

### Enable Debug Logging

Step 1: Edit index.js
```javascript
// Add at top
const DEBUG = true;

// Before each operation
if (DEBUG) console.log('[DEBUG] Starting operation...');
```

Step 2: View detailed logs
```bash
pm2 logs mintaka --lines 500
```

### Test Individual Components

**Test STT (Speech-to-Text):**
```bash
# Create test-stt.js
node test-stt.js <audio-file.ogg>
```

**Test Vision:**
```bash
# Create test-vision.js
node test-vision.js <image-file.jpg>
```

**Test File Creation:**
```bash
# Create test-files.js
node test-files.js
```

### Use Inspector/Debugger

```bash
# Start with debugger
bun --inspect index.js

# Open Chrome DevTools
# Visit: chrome://inspect
# Click "inspect" on target
```

### Export Database for Analysis

```bash
# Export conversation history
node memory-exporter.js

# Check conversation_export.json
# Verify data is there
```

---

## WHEN ALL ELSE FAILS

### Nuclear Option: Clean Start

```bash
# 1. Stop everything
pm2 kill

# 2. Back up data
copy data\mintaka.db data\mintaka.db.backup

# 3. Delete sensitive files
del data\mintaka.db
del .env
del bun.lock
del package-lock.json

# 4. Fresh install
bun install

# 5. Reconfigure
copy .env.example .env
notepad .env
# Add your keys

# 6. Start fresh
pm2 start ecosystem.config.js

# 7. Verify
pm2 logs mintaka --follow
```

### Contact Support

If none of this works:

**Graham Schubach**
- Email: graham@oriondevcore.com
- WhatsApp: +27 72 497 1810
- Location: Amanzimtoti, KwaZulu-Natal

---

**Built in Africa. Engineered for Impact.** 🌍
