const { Router } = require('express');
const { AzureOpenAI } = require('openai');
const { SYSTEM_PROMPT } = require('../systemPrompt');
const data = require('../../aibud-chatbot-import.json');

const router = Router();

const client = new AzureOpenAI({
  apiVersion: process.env.AZURE_OPENAI_API_VERSION,
});
const DEPLOYMENT = process.env.AZURE_OPENAI_DEPLOYMENT_NAME;

const MAX_MESSAGES = 40;
const VALID_ROLES = new Set(['user', 'assistant']);

router.get('/suggested-questions', (req, res) => {
  res.json({ questions: data.suggested_questions });
});

// Expose the default system prompt so the UI's settings panel can pre-fill it.
router.get('/system-prompt', (req, res) => {
  res.json({ systemPrompt: SYSTEM_PROMPT });
});

router.post('/chat', async (req, res, next) => {
  try {
    // systemPromptOverride lets the test UI's settings panel override the default
    // system prompt live without restarting the server — useful for testing personas.
    const { messages, systemPromptOverride } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages must be a non-empty array.' });
    }

    for (const msg of messages) {
      if (!VALID_ROLES.has(msg.role)) {
        return res.status(400).json({ error: `Invalid role "${msg.role}". Must be "user" or "assistant".` });
      }
      if (typeof msg.content !== 'string' || msg.content.trim() === '') {
        return res.status(400).json({ error: 'Each message must have a non-empty content string.' });
      }
    }

    if (messages[messages.length - 1].role !== 'user') {
      return res.status(400).json({ error: 'The last message must have role "user".' });
    }

    const trimmed = messages.slice(-MAX_MESSAGES);
    const activeSystemPrompt = (typeof systemPromptOverride === 'string' && systemPromptOverride.trim())
      ? systemPromptOverride.trim()
      : SYSTEM_PROMPT;

    const response = await client.chat.completions.create({
      model: DEPLOYMENT,
      max_completion_tokens: 16384,
      messages: [
        { role: 'system', content: activeSystemPrompt },
        ...trimmed,
      ],
    });

    const reply = response.choices[0].message.content;
    // Return token usage so the UI's model info panel can show it
    const usage = response.usage || null;
    res.json({ reply, usage });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
