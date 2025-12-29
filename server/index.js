const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check endpoint for keep-alive pings
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Secure API key endpoint - key stored in environment variable
app.get('/api/config', (req, res) => {
  const deepgramKey = process.env.DEEPGRAM_API_KEY;

  if (!deepgramKey) {
    return res.status(500).json({ error: 'Deepgram API key not configured' });
  }

  res.json({
    DEEPGRAM_API_KEY: deepgramKey,
  });
});

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});
