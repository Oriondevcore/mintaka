# ORION Mintaka — Command Reference

**Quick cheat sheet for development, debugging, and production.**

---

## BUN COMMANDS

### Installation & Setup
```bash
# Install Bun (if not installed)
powershell -c "irm https://bun.sh/install.ps1|iex"

# Check Bun version
bun --version

# Install dependencies
bun install

# Update dependencies
bun update
```

### Development
```bash
# Run with hot reload (watch for changes)
bun --watch index.js

# Run once (no watch)
bun run index.js

# Run a specific script from package.json
bun run dev
bun run start

# Check what scripts are available
bun run

# Run in debug mode
bun --inspect index.js
```

### Testing & Debugging
```bash
# Test a single file
bun test memory-system.js

# Run all tests
bun test

# Dry run (show what would execute)
bun --dry-run index.js

# Check for errors without running
bun check index.js
```

### Bundling & Build
```bash
# Bundle for production
bun build index.js --target node --outfile mintaka.js

# Bundle with tree-shaking
bun build index.js --target node --minify

# Check bundle size
bun build index.js --target node --print-size
```

### Package Management
```bash
# Add a new package
bun add axios
bun add --dev @types/node

# Remove a package
bun remove axios

# Clean node_modules
bun install --force

# List installed packages
bun pm ls

# Check for outdated packages
bun update --latest
```

---

## PM2 COMMANDS

### Installation
```bash
# Install PM2 globally
npm install -g pm2
bun add -g pm2

# Verify installation
pm2 --version
```

### Starting & Stopping
```bash
# Start Mintaka (using ecosystem.config.js)
pm2 start ecosystem.config.js

# Start with specific name
pm2 start index.js --name "mintaka"

# Restart Mintaka
pm2 restart mintaka

# Stop Mintaka
pm2 stop mintaka

# Delete from PM2
pm2 delete mintaka

# Stop all processes
pm2 stop all

# Restart all processes
pm2 restart all

# Delete all processes
pm2 delete all
```

### Monitoring
```bash
# Show all running processes
pm2 list
pm2 ps

# Monitor in real-time
pm2 monit

# Show detailed info about one process
pm2 info mintaka

# Show process logs
pm2 logs mintaka

# Show last 100 lines of logs
pm2 logs mintaka --lines 100

# Show logs for all processes
pm2 logs

# Clear logs
pm2 flush
```

### Logs Management
```bash
# Show errors only
pm2 logs mintaka --err

# Show output only
pm2 logs mintaka --out

# Follow logs (like tail -f)
pm2 logs mintaka --follow

# Show logs with timestamps
pm2 logs mintaka --timestamp

# Save logs to file (already configured in ecosystem.config.js)
# Check: ./logs/error.log and ./logs/out.log
```

### Startup & Persistence
```bash
# Make PM2 start on boot (Windows)
pm2 startup

# Save current process list to auto-start
pm2 save

# Restore saved process list
pm2 resurrect

# Remove startup hook
pm2 unstartup
```

### Process File Management
```bash
# Save configuration
pm2 save

# Load saved configuration
pm2 resurrect

# Dump to JSON
pm2 dump

# Restore from JSON
pm2 kill
pm2 start ecosystem.config.js
```

### Environment Variables
```bash
# Set env variables for process
pm2 start index.js --env "NODE_ENV=production"

# Use .env file (already loaded in code)
# Make sure .env exists with all secrets

# View process environment
pm2 env mintaka
```

### Advanced
```bash
# Cluster mode (multi-core)
pm2 start index.js -i max --name mintaka

# Watch for file changes and restart
pm2 start index.js --watch

# Ignore specific directories
pm2 start index.js --ignore-watch="node_modules,logs"

# Graceful shutdown (timeout in ms)
pm2 start index.js --kill-timeout 5000

# Max memory (restart if exceeded)
pm2 start index.js --max-memory-restart 500M
```

### Debugging PM2
```bash
# Show PM2 daemon status
pm2 status

# Show PM2 config
pm2 show

# Check if PM2 is running
pm2 pid

# Kill PM2 daemon (clean restart)
pm2 kill

# Flush all logs and database
pm2 flush

# Check PM2 version
pm2 --version
```

---

## NGROK COMMANDS (Tunneling for Development)

### Installation
```bash
# Download from https://ngrok.com/download
# Or via chocolatey on Windows
choco install ngrok

# Verify installation
ngrok --version

# Authenticate (get token from https://dashboard.ngrok.com/auth)
ngrok config add-authtoken YOUR_AUTH_TOKEN
```

### Basic Tunneling
```bash
# Expose local HTTP server (port 3000)
ngrok http 3000

# Expose with custom subdomain (paid feature)
ngrok http 3000 --subdomain=mintaka

# Expose with specific region
ngrok http 3000 --region=us

# Expose with custom domain (paid feature)
ngrok http 3000 --domain=mintaka.example.com
```

### WhatsApp Webhook
```bash
# Expose REST API on port 3000
ngrok http 3000 --region=us

# Copy the forwarding URL: https://XXXXX.ngrok.io
# Use in WhatsApp webhook: https://XXXXX.ngrok.io/webhook

# Test webhook
curl https://XXXXX.ngrok.io/health
```

### Advanced Features
```bash
# TCP tunneling (not HTTP)
ngrok tcp 5432

# UDP tunneling
ngrok udp 5000

# Label a tunnel (helpful for multiple tunnels)
ngrok http 3000 --labels="env=dev,app=mintaka"

# Tunnel multiple ports
ngrok start api web

# Show tunnel dashboard
# Navigate to: http://localhost:4040

# Save ngrok session
ngrok config save

# View saved configuration
ngrok config show
```

### Multi-Port Tunneling
**Create ngrok.yml config file:**
```yaml
version: 2
tunnels:
  api:
    addr: 3000
    proto: http
    domain: mintaka-api.ngrok.io

  redis:
    addr: 6379
    proto: tcp

  postgres:
    addr: 5432
    proto: tcp
```

**Then run:**
```bash
# Start all configured tunnels
ngrok start --all

# Or specific tunnel
ngrok start api
```

### Debugging Ngrok
```bash
# Show tunnel status
ngrok status

# Check active tunnels
# Visit: http://localhost:4040/

# View tunnel logs
ngrok log -follow

# Test tunnel connectivity
curl -I https://XXXXX.ngrok.io

# Get tunnel info (JSON)
curl http://localhost:4040/api/tunnels
```

---

## QUICK WORKFLOWS

### Daily Development
```bash
# 1. Start Bun with hot reload
bun --watch index.js

# 2. In another terminal, monitor logs
pm2 logs mintaka --follow

# 3. Test WhatsApp messages
# Send message to Mintaka's WhatsApp

# 4. Check memory/DB
bun run memory.js --stats

# 5. When ready to stop
Ctrl+C (in Bun terminal)
```

### Production Deployment
```bash
# 1. Install dependencies
bun install --production

# 2. Start with PM2
pm2 start ecosystem.config.js

# 3. Save for auto-restart
pm2 save

# 4. Make sure startup hook is active
pm2 startup

# 5. Monitor
pm2 monit
```

### Testing WhatsApp Webhook
```bash
# 1. Start ngrok tunnel
ngrok http 3000

# 2. Copy the HTTPS URL (https://xxxxx.ngrok.io)

# 3. Configure webhook in WhatsApp Business API:
# Webhook URL: https://xxxxx.ngrok.io/webhook
# Verify Token: your-secret-token-here

# 4. Watch ngrok dashboard
# Visit: http://localhost:4040

# 5. Send test message to bot

# 6. Check logs
pm2 logs mintaka
```

### Troubleshooting Issues
```bash
# 1. Check what's running
pm2 list

# 2. View recent errors
pm2 logs mintaka --err

# 3. Restart the process
pm2 restart mintaka

# 4. Check system resources
pm2 monit

# 5. View detailed process info
pm2 info mintaka

# 6. Clear everything and start fresh
pm2 kill
pm2 start ecosystem.config.js
pm2 save
```

### File Monitoring
```bash
# Watch file changes and restart (already in ecosystem.config.js)
pm2 start ecosystem.config.js

# View which files are being watched
pm2 show mintaka

# Ignore specific files from restarting
# Edit ecosystem.config.js:
# ignore_watch: ['node_modules', 'logs', '.git']
```

---

## ENVIRONMENT VARIABLES

**Create `.env` file in C:\MINTAKA\:**

```bash
# WhatsApp
ADMIN_NUMBER=27724971810
API_PORT=3000
API_SECRET=your-secret-key-here

# AI Providers
GROQ_API_KEY=your-groq-key
GROQ_LLM_API_KEY=your-groq-llm-key
GROQ_LLM_MODEL=mixtral-8x7b-32768

OPENROUTER_API_KEY=your-openrouter-key
OR_MODEL=openrouter/free

TOGETHER_API_KEY=your-together-key
FIREWORKS_API_KEY=your-fireworks-key

# Vision
GEMINI_API_KEY=your-gemini-key

# Email (Cloudflare)
SMTP_HOST=smtp.cloudflare.com
SMTP_PORT=587
SMTP_USER=mintaka@mintaka.oriondevcore.com
SMTP_PASS=your-email-password

# Local AI
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=phi3:mini

# Node Environment
NODE_ENV=production

# Admin Name
ADMIN_NAME=Graham
```

---

## QUICK REFERENCE TABLE

| Task | Command |
|------|---------|
| **Start Mintaka** | `bun run start` or `pm2 start ecosystem.config.js` |
| **Stop Mintaka** | `pm2 stop mintaka` |
| **Restart Mintaka** | `pm2 restart mintaka` |
| **View logs** | `pm2 logs mintaka` |
| **Monitor** | `pm2 monit` |
| **Watch mode** | `bun --watch index.js` |
| **Test tunnel** | `ngrok http 3000` |
| **Save PM2** | `pm2 save` |
| **Startup on boot** | `pm2 startup && pm2 save` |
| **Kill all** | `pm2 kill` |

---

## COMMON ISSUES & FIXES

### "Port 3000 already in use"
```bash
# Find process using port 3000
netstat -ano | findstr :3000

# Kill process
taskkill /PID <PID> /F

# Or use different port
API_PORT=3001 bun run start
```

### "GROQ_API_KEY not found"
```bash
# Verify .env file exists
cat .env

# Check it has GROQ_API_KEY=xxxxx
# Restart Bun/PM2
```

### "WhatsApp not connecting"
```bash
# Check logs
pm2 logs mintaka

# Restart client
pm2 restart mintaka

# Re-scan QR code
# Check .wwebjs_auth/session-mintaka/ folder
```

### "Ollama not responding"
```bash
# Start Ollama
ollama serve

# In another terminal, pull model
ollama pull phi3:mini

# Test connection
curl http://localhost:11434/api/tags
```

### "Ngrok tunnel not working"
```bash
# Check authentication
ngrok config show

# Re-authenticate
ngrok config add-authtoken YOUR_TOKEN

# Restart ngrok
ngrok http 3000 --region=us
```

---

**For more info, visit:**
- Bun: https://bun.sh/docs
- PM2: https://pm2.keymetrics.io/docs
- ngrok: https://ngrok.com/docs
- Groq: https://console.groq.com/keys

**Built in Africa. Engineered for Impact.** 🌍
