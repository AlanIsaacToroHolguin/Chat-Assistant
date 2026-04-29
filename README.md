# Chat Assistant AI

A fullstack AI chat application with real-time streaming responses, JWT authentication, and local persistence — built as a portfolio demo.

![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=flat&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=flat&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?style=flat&logo=tailwindcss&logoColor=white)

---

## Features

- **Streaming responses** — typewriter effect via Server-Sent Events
- **JWT authentication** — secure login with demo credentials provided
- **Multiple conversations** — create, rename, and delete chat sessions
- **Local persistence** — conversations stored in `localStorage` (no database required)
- **Markdown rendering** — with syntax-highlighted code blocks
- **Copy to clipboard** — on every message bubble
- **Responsive design** — collapsible sidebar on mobile
- **Groq AI (free)** — powered by `llama-3.3-70b-versatile`, or swap to OpenAI

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 · TypeScript · Vite · Tailwind CSS |
| **State** | Zustand (persisted to `localStorage`) |
| **Backend** | Python · FastAPI · Uvicorn |
| **AI** | Groq API (free) or OpenAI |
| **Auth** | JWT — `python-jose` + `passlib bcrypt` |
| **Deploy** | Frontend → Vercel · Backend → Railway |

---

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+
- A free [Groq API key](https://console.groq.com)

### 1. Clone the repo

```bash
git clone https://github.com/your-username/chat-assistant.git
cd chat-assistant
```

### 2. Backend

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # macOS / Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env → add your GROQ_API_KEY
```

Start the server:

```bash
uvicorn main:app --reload --port 8000
```

API docs available at: `http://localhost:8000/docs`

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open: `http://localhost:5173`

---

## Demo Login

The app ships with built-in demo credentials shown directly on the login screen:

| Field | Value |
|-------|-------|
| Email | `demo@assistant.com` |
| Password | `demo123` |

> Credentials are configurable via environment variables (`DEMO_EMAIL`, `DEMO_PASSWORD`).

---

## Project Structure

```
chat-assistant/
├── backend/
│   ├── main.py                  # FastAPI entry point
│   ├── requirements.txt
│   ├── Procfile                 # Railway deployment
│   ├── .env.example
│   └── app/
│       ├── config.py            # Settings (pydantic-settings)
│       ├── dependencies.py      # JWT auth dependency
│       ├── routers/
│       │   ├── auth.py          # POST /api/auth/login, GET /api/auth/me
│       │   └── chat.py          # POST /api/chat/stream (SSE)
│       ├── schemas/
│       │   ├── auth.py
│       │   └── message.py
│       ├── services/
│       │   └── ai_service.py    # Groq / OpenAI streaming
│       └── utils/
│           └── jwt.py
└── frontend/
    ├── vercel.json              # Vercel SPA routing
    ├── .env.example
    └── src/
        ├── App.tsx              # Routes (protected / public)
        ├── pages/
        │   ├── Login.tsx        # Demo credentials shown here
        │   └── Chat.tsx         # Main layout
        ├── components/
        │   ├── Sidebar.tsx      # Conversation list
        │   ├── ChatWindow.tsx   # Message feed + auto-scroll
        │   ├── MessageBubble.tsx # Markdown + copy button
        │   ├── InputBar.tsx     # Auto-grow textarea
        │   └── SkeletonLoader.tsx
        ├── hooks/
        │   ├── useAuth.ts
        │   ├── useChat.ts       # SSE stream reader
        │   └── useConversations.ts
        ├── store/
        │   └── index.ts         # Zustand (auth + chat, persisted)
        ├── api/
        │   └── axios.ts         # Axios + JWT interceptor
        └── types/
            └── index.ts
```

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/login` | — | Returns JWT token |
| `GET` | `/api/auth/me` | JWT | Current user info |
| `POST` | `/api/chat/stream` | JWT | **Stream AI response (SSE)** |

### Stream request body

```json
{
  "messages": [
    { "role": "user", "content": "Hello!" },
    { "role": "assistant", "content": "Hi, how can I help?" },
    { "role": "user", "content": "Explain recursion" }
  ]
}
```

### Stream response format (SSE)

```
data: {"content": "Recursion "}
data: {"content": "is when..."}
data: [DONE]
```

---

## Environment Variables

### Backend (`.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `JWT_SECRET` | Secret key for signing tokens | *(required)* |
| `JWT_EXPIRE_HOURS` | Token expiry | `24` |
| `DEMO_EMAIL` | Login email shown on UI | `demo@assistant.com` |
| `DEMO_PASSWORD` | Login password shown on UI | `demo123` |
| `AI_PROVIDER` | `groq` or `openai` | `groq` |
| `GROQ_API_KEY` | Groq API key | *(required)* |
| `GROQ_MODEL` | Model name | `llama-3.3-70b-versatile` |
| `OPENAI_API_KEY` | OpenAI key (if using OpenAI) | — |
| `FRONTEND_URL` | Allowed CORS origin | `http://localhost:5173` |

### Frontend (`.env.local`)

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend base URL | `http://localhost:8000` |

---

## Deployment

### Frontend → Vercel

1. Push repo to GitHub
2. Import project in [vercel.com](https://vercel.com)
3. Set root directory to `frontend`
4. Add environment variable: `VITE_API_URL=https://your-backend.railway.app`
5. Deploy

### Backend → Railway

1. Connect repo in [railway.app](https://railway.app)
2. Set root directory to `backend`
3. Add environment variables (copy from `.env.example`)
4. Railway auto-detects the `Procfile` and deploys

---

## License

MIT
