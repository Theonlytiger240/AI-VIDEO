const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;

app.get('/', (req, res) => {
  res.send('Replicate Proxy Server is running.');
});

app.post('/generate', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Missing prompt' });

  try {
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: 'b88b7f80e2d7a14775bb394489b9b4b6a354f31d7a86a146973f230b4d04397d',
        input: { prompt },
      }),
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

const port = process.env.PORT || 3000;
const host = '0.0.0.0';

app.listen(port, host, () => {
  console.log(`Server listening on http://${host}:${port}`);
});
