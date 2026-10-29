# PhishGuard AI

<p align="center">
  <img src="https://img.shields.io/badge/Status-Active%20Security%20Dashboard-0ea5e9?style=for-the-badge&logo=shield" alt="Project status" />
  <img src="https://img.shields.io/badge/AI%20Analysis-Gemini%20Powered-8b5cf6?style=for-the-badge" alt="Gemini powered" />
  <img src="https://img.shields.io/badge/Type-React%20%2B%20Node-22c55e?style=for-the-badge" alt="React and Node" />
</p>

<p align="center">
  <strong>AI-powered phishing detection and security intelligence dashboard</strong>
</p>

PhishGuard AI is a modern security analysis tool built to help users detect, investigate, and understand phishing and spoofing threats before they cause damage. It combines multiple layers of signal analysis — lexical URL inspection, HTML/DOM indicators, visual similarity checks, and AI-based reasoning — into a single dashboard designed for speed, clarity, and operational awareness.

This project is especially useful for:

- Security analysts and SOC teams
- Incident response workflows
- Cybersecurity demos and training
- Threat intelligence investigations
- Browserless phishing triage and URL risk review

## Why this project exists

Phishing attacks are no longer obvious. Attackers craft pages that look familiar, abuse trusted brands, mimic login flows, and hide malicious patterns inside seemingly normal URLs or scripts. Traditional blacklists and simple URL checks are often too slow or too narrow.

PhishGuard AI addresses that gap by analyzing suspicious URLs across multiple perspectives:

- Does the URL look like a spoofed or deceptive domain?
- Does the domain metadata suggest suspicious registration or short life?
- Are there signs of dynamic scripts, obfuscation, or hidden form behavior?
- Does the page visually resemble a trusted brand or login template?
- How confident is the system in labeling the result as safe, suspicious, or malicious?

The result is a practical dashboard that exposes those signals in a digestible format.

## What PhishGuard AI does

PhishGuard AI provides a real-time phishing investigation interface with these core capabilities:

- URL scanning and threat scoring
- Multi-signal verdict generation: Threat, Warning, or Safe
- Lexical and DNS/Whois style inspection
- HTML form action, JS obfuscation, and zero-width character analysis
- Visual similarity assessment and brand spoof detection
- Actionable audit history for previously scanned URLs
- Searchable investigation records and exportable JSON intelligence snapshots
- AI-assisted threat reasoning using Google Gemini when configured
- Heuristic fallback logic for offline or unsupported environments

## Core features

### 1. Threat Scanner Dashboard
The main dashboard lets a user enter a URL and trigger an analysis. The tool runs a fast security evaluation and displays:

- Verdict
- Confidence percentage
- Risk composition across lexical, HTML, and visual layers
- Suspicion summary
- Timeline-style scan record

### 2. AI Insights View
This is the deep-dive investigation panel. It breaks the result into analysis segments:

- Lexical & DNS risk signals
- HTML / DOM logic anomalies
- Visual CNN-style matching and brand impersonation cues

This gives analysts a clearer understanding of why a site was flagged.

### 3. Audit Database
All scanned URLs are stored in an in-memory history list. Analysts can:

- Search by URL or trace ID
- Filter by verdict
- Sort by time or confidence
- Export inspection records as JSON
- Clear records when resetting the environment

### 4. Security Monitoring Panel
The application is designed like a security operations cockpit, with live-looking telemetry and system status indicators to simulate a real posture-monitoring console.

### 5. AI + Heuristic Hybrid Detection
PhishGuard AI uses a hybrid approach:

- Real Gemini API if a valid `GEMINI_API_KEY` is provided
- Fallback heuristic analysis if the API is unavailable or misconfigured

This ensures the application remains useful in local demos, development environments, and constrained setups.

## Benefits

PhishGuard AI is designed to provide practical value to teams and users who need quick, readable risk signals without building a heavy enterprise platform from scratch.

### For security teams
- Faster triage of suspicious links
- Better visibility into phishing patterns
- More context before blocking or escalating a case

### For developers and researchers
- A strong reference implementation for AI-assisted threat detection
- Easy-to-run dashboard for demo and experimentation
- Extensible foundation for security tooling

### For learning and training
- Helps explain why URLs look dangerous
- Demonstrates how phishing signals can be analyzed across multiple dimensions
- Makes anti-phishing analysis more understandable and teachable

### For operations
- Reduced ambiguity in phishing verdicts
- Centralized historical records for investigation continuity
- Simple local deployment pathway for testing and exploration

## How it works

PhishGuard AI analyzes a URL through multiple checks:

1. Lexical analysis
   - URL length and entropy
   - Common phishing keywords such as login, secure, verify, update, support, auth
   - Domain naming anomalies and spoofing patterns
   - Domain metadata and age signals

2. HTML and DOM inspection
   - Form action destinations
   - JavaScript obfuscation indicators
   - Hidden or deceptive character usage
   - Suspicious DOM patterns and behaviors

3. Visual similarity assessment
   - Brand impersonation clues
   - Layout similarity against known login or brand templates
   - Visual mismatch evaluation and spoofing indicators

4. AI scoring and verdict generation
   - Gemini model interprets the evidence and returns a structured JSON verdict
   - Risk confidence is calculated and surfaced in the UI

5. Historical tracking
   - Each result is stored in the session history for follow-up review and export

## Tech stack

This project is built with a modern frontend and lightweight backend:

- React + Vite
- TypeScript
- Express server
- Google Generative AI SDK
- Lucide icons and polished dashboard UI
- Docker support for containerized deployment

## Project structure

```text
phishguard-ai/
├── README.md
├── DOCKER.md
├── Dockerfile
├── docker-compose.yml
├── server.ts
├── package.json
├── tsconfig.json
├── vite.config.ts
├── index.html
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── types.ts
│   ├── index.css
│   └── components/
│       ├── Dashboard.tsx
│       ├── History.tsx
│       ├── AiInsights.tsx
│       ├── SystemMonitor.tsx
│       ├── AuditLog.tsx
│       ├── Settings.tsx
│       └── ui/
└── metadata.json
```

## Getting started

### Prerequisites

- Node.js 18+
- npm
- A Google Gemini API key (optional but recommended for full AI analysis)

### Install dependencies

```bash
npm install
```

The app loads environment variables with dotenv and uses the Gemini client automatically when available.

### Run locally

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```
or 

vercel link: 
```text
https://phishdetect-ai-hsad-bice.vercel.app/
```

## Development commands

```bash
npm run dev     # run the local development server
npm run build   # create production build
npm run start   # run built server
npm run lint    # TypeScript validation
```

## Docker deployment

The repository includes Docker support for containerized runs.

### Quick Docker start

```bash
docker build -t phishguard-ai:latest .
docker run -p 3000:3000 -e GEMINI_API_KEY=your_api_key_here phishguard-ai:latest
```

For compose-based setup, see [docker-compose.yml](docker-compose.yml) and [DOCKER.md](DOCKER.md).

## API behavior

PhishGuard AI exposes a lightweight backend API:

- `GET /api/history` — returns the scanned URL history
- `POST /api/analyze` — submits a URL and receives a verdict result

Example request:

```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"url":"http://secure-login-update-paypal.com/auth"}'
```

The response returns a structured object containing:

- verdict
- confidence
- composition scores
- threat metadata
- AI-generated insights
- URL analysis details

## Use cases

PhishGuard AI is useful for:

- Manual phishing investigation workflows
- Cybersecurity training and demos
- URL classification prototype projects
- Security dashboards and analyst tooling
- Internal threat knowledge exercises

## Potential extensions

This project is a strong starting point for future enhancements such as:

- real threat intelligence API integration
- browser automation for page rendering checks
- URL reputation scoring from external services
- rule-based detections with ML model pipelines
- authentication and user role management
- production-grade persistence and storage

## Security note

This repository is a demonstration and analysis dashboard. It is meant for research, internal evaluation, and educational use. Use it responsibly and do not treat outputs as a substitute for a production-grade phishing defense stack.

## License

This project is provided as-is for educational and cybersecurity demo purposes. Please check the repository’s license terms before commercial use.

## Final takeaway

PhishGuard AI turns suspicious URL investigation into a clear, visual, analyst-friendly workflow. It helps show not just whether a link looks risky, but why it looks risky — across lexical, HTML, and visual evidence. That makes it a valuable tool for understanding and responding to modern phishing threats.
