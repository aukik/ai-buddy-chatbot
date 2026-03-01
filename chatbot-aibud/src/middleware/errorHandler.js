function errorHandler(err, req, res, next) {
  console.error('[ErrorHandler]', err);

  // OpenAI SDK errors (including Azure) expose a `status` property
  const status = err.status;

  if (status === 401) {
    return res.status(502).json({ error: 'Authentication error with the AI service. Please contact support.' });
  }

  if (status === 429) {
    return res.status(429).json({ error: "We're a bit busy right now. Please try again in a moment." });
  }

  if (status === 529 || status === 503) {
    return res.status(503).json({ error: 'The AI service is overloaded. Please try again shortly.' });
  }

  if (status) {
    return res.status(502).json({ error: 'The AI service returned an error. Please try again.' });
  }

  // Network-level errors
  const code = err.code;
  if (code === 'ECONNRESET' || code === 'ETIMEDOUT' || code === 'ENOTFOUND') {
    return res.status(503).json({ error: 'Could not reach the AI service. Please check your connection and try again.' });
  }

  // Fallback
  return res.status(500).json({ error: 'Something went wrong. Please try again.' });
}

module.exports = errorHandler;
