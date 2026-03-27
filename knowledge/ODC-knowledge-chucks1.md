# Orion Dev Core Knowledge Chunks

Each chunk is designed to be a self-contained module of information (e.g., Business Vision, Technical Architecture, etc.) that your local AI can digest one by one.

## Chunk 1: Professional Background & Identity

Context: Use this to establish the "who" and "why" behind Orion Dev Core.

Founder: Graham Schubach.

Experience: 26 years in hospitality operations (JW Marriott Marquis, Nedbank Golf Challenge).

Role: Lead Architect/Owner of Orion Dev Core.

Philosophy: "Blaze Genius" (Visionary/People) paired with "Steel Genius" AI (Systems/Logic).

Mission: Building Africa's first Agentic AI Hospitality system for children's future and financial stability.

Chunk 2: Hardware & Software Stack (Zero Budget)
Context: The constraints and tools available for local development.

Hardware: Dell i5 Laptop, 16GB RAM, 1TB SSD, 200mb Fibre.

OS: Windows 11 / PowerShell 7.

Runtime: Node.js (prefer Bun) and Python 3.12+.

AI Tools: Ollama (Llama 3, Phi models), OpenRouter API, Google GenAI SDK (Gemini).

Frontend/DB: HTML/Alpine.js/Tailwind, SQLite (hotel.db), ChromaDB (Vector Search).

Chunk 3: Orion Hotel Suite - Business Strategy
Context: The market positioning and entry strategy.

Problem: Hotels (specifically ZAR Hotel & View Boutique) are failing to answer WhatsApp lines, leading to lost revenue.

Solution: AI WhatsApp Concierge that handles queries 24/7.

Target: Boutique Hotels, Safari Lodges, and Guesthouses in Africa.

Revenue Model: Monthly SaaS fee ($40 - $120/month).

Chunk 4: Technical Architecture - WhatsApp AI
Context: Phase 1 implementation details.

Library: whatsapp-web.js (runs on laptop, connects via QR scan).

Logic: Guest Message → WhatsApp Session → Orion AI Listener → Intent Detection → Knowledge Base → Reply.

Intent Map: Includes BOOKING, SPA, MAINTENANCE, HOUSEKEEPING, COMPLAINT.

Safety: AI captures leads (dates, guests, room type) but never confirms bookings; it forwards leads to human staff.

Chunk 5: Multi-Agent System (Orion Dev Core v2)
Context: Internal AI workforce structure.

Supervisor: Routes messages to specialized agents.

Bolt: Customer/WhatsApp AI.

Mintaka: Research AI (Internet search/Knowledge building).

Vega: Coding/Developer AI.

Justus: Legal/Compliance AI.

Forge: Builder/Systems implementation.

Chunk 6: System Utilities (Scanner & Sorter)
Context: Tools for managing the "rats nest" of local files.

Orion Scanner: Recursively scans folders to find duplicates, large files, and versioned documents (v1, final, etc.).

File Sorter: Automatically organizes files into /code, /docs, /images, and /archives based on extensions to clean up the development environment.

Chunk 7: Hospitality Knowledge Engine
Context: Capturing the 26 years of domain expertise.

Method: AI Interview Mode (AI asks Graham questions to extract operational wisdom).

Content: Hospitality operations protocols, guest psychology, and crisis management (e.g., water failure response).

Storage: Knowledge files (markdown) converted into Vector embeddings for RAG (Retrieval-Augmented Generation).

Chunk 8: Dashboard & Control Center
Context: The management interface (Full Futuristic/Cyberpunk style).

Backend: FastAPI.

Features: Agent status monitoring, System metrics (CPU/RAM), Token/Cost monitors (USD/ZAR).

Widgets: EskomSePush (load shedding), Weather, CO2 Emissions, Occupancy, and Revenue tracking.
