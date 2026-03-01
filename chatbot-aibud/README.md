# AI Buddy (aibud.ca) Chatbot Content Pack

Chatbot copy and knowledge for the AI Buddy website: friendly tone with optional 80s/90s pop-culture references (Hollywood/Bollywood blockbusters, rock/pop/world hits).

## Files

| File | Use |
|------|-----|
| **TONE.md** | Voice and style guide for the bot. Give this to writers and to the LLM/system prompt so answers stay on-brand. |
| **KNOWLEDGE-BASE.md** | Full reference: company summary, products, FAQ, suggested questions, handoff rules. Human-readable; can be used as context or converted for ingestion. |
| **aibud-chatbot-import.json** | Single importable payload: `tone`, `company_summary`, `suggested_questions`, `faq`, `products`, `cta`. Use for chatbot platforms or custom backends. |

## Suggested questions (widget)

Use these as clickable prompts so visitors know what to ask:

1. What does AI Buddy do?
2. Who is it for?
3. What is DocDirector?
4. How much does it cost?
5. How do I get started?
6. What integrations do you support?
7. How are you different from other agencies?
8. How can I contact you?

## Tone in short

- **Friendly** first; clear and helpful.
- **Optional** light 80s/90s references (movies, music) when they fit naturally—one per answer max, often none.
- When in doubt, drop the reference and keep the answer solid.

Source: [aibud.ca](https://aibud.ca/).

---

## Backend Server

### Setup

```bash
cp .env.example .env   # fill in your Azure OpenAI credentials
npm install
npm run dev            # nodemon, port 3000
```

### Required environment variables

| Variable | Description |
|----------|-------------|
| `AZURE_OPENAI_API_KEY` | Your Azure OpenAI API key |
| `AZURE_OPENAI_ENDPOINT` | e.g. `https://your-resource.openai.azure.com` |
| `AZURE_OPENAI_DEPLOYMENT_NAME` | Your deployment name (e.g. `gpt-4o`) |
| `AZURE_OPENAI_API_VERSION` | e.g. `2024-10-01-preview` |

### REST API

#### `GET /health`
Returns server and deployment info.
```json
{ "status": "ok", "deployment": "gpt-4o", "endpoint": "https://..." }
```

#### `GET /api/suggested-questions`
Returns clickable prompt chips for the chat UI.
```json
{ "questions": ["What does AI Buddy do?", "How much does it cost?", ...] }
```

#### `POST /api/chat`
Send the full conversation history; the server is **stateless**.

**Request:**
```json
{
  "messages": [
    { "role": "user", "content": "What does AI Buddy do?" },
    { "role": "assistant", "content": "AI Buddy is..." },
    { "role": "user", "content": "How much does it cost?" }
  ]
}
```

**Response (200):**
```json
{ "reply": "Pricing depends on..." }
```

**Error response:**
```json
{ "error": "Human-readable error message" }
```

### Next.js integration (aibud.ca)

Call the chatbot API from a Next.js API route or directly from a client component. CORS is open so browser-side `fetch` works too.

```ts
// Example: /app/api/chat/route.ts (proxying from Next.js)
export async function POST(req: Request) {
  const { messages } = await req.json();
  const res = await fetch(`${process.env.CHATBOT_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  });
  const data = await res.json();
  return Response.json(data, { status: res.status });
}
```

Or call the chatbot server directly from the browser if it's on the same domain or CORS is allowed:

```ts
const res = await fetch('https://your-chatbot-server.com/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ messages }),
});
const { reply } = await res.json();
```
