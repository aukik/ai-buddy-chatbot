require('dotenv').config();

// Fail fast: all four Azure OpenAI vars must be set before we accept any traffic.
// This prevents silent "works but always errors" states in production.
const REQUIRED_ENV = [
  'AZURE_OPENAI_API_KEY',
  'AZURE_OPENAI_ENDPOINT',
  'AZURE_OPENAI_DEPLOYMENT_NAME',
  'AZURE_OPENAI_API_VERSION',
];
const missing = REQUIRED_ENV.filter((k) => !process.env[k]);
if (missing.length) {
  console.error(`ERROR: Missing required environment variables: ${missing.join(', ')}`);
  console.error('Copy .env.example to .env and fill in your Azure OpenAI credentials.');
  process.exit(1);
}

const express = require('express');
const cors = require('cors');
const chatRoutes = require('./routes/chat');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS is open so the chatbot widget can be embedded on aibud.ca (Next.js)
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    deployment: process.env.AZURE_OPENAI_DEPLOYMENT_NAME,
    endpoint: process.env.AZURE_OPENAI_ENDPOINT,
  });
});

app.use('/api', chatRoutes);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`AI Buddy chatbot server running on http://localhost:${PORT}`);
  console.log(`  Deployment: ${process.env.AZURE_OPENAI_DEPLOYMENT_NAME}`);
  console.log(`  Endpoint:   ${process.env.AZURE_OPENAI_ENDPOINT}`);
});
