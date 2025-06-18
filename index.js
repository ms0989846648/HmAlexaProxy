import express from 'express';
import axios from 'axios';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 4000;

async function fetchAccessToken() {
  const resp = await axios.post(
    'https://api.amazon.com/auth/o2/token',
    new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: process.env.LWA_REFRESH_TOKEN,
      client_id: process.env.LWA_CLIENT_ID,
      client_secret: process.env.LWA_CLIENT_SECRET,
    }),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );
  return resp.data.access_token;
}

app.get('/api/devices', async (req, res) => {
  try {
    const token = await fetchAccessToken();
    const { data } = await axios.get(
      'https://api.amazonalexa.com/v1/devices',
      { headers: { Authorization: `Bearer ${token}` } }
    );
    res.json(data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to fetch devices' });
  }
});

app.listen(PORT, () =>
  console.log(`🌐 HmAlexaProxy running on port ${PORT}`)
);
