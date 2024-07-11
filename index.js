const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = 3000;

const SPOTIFY_CLIENT_ID = 'e2e3873a132c42a5b7a47bd1c4ee2e6c';
const SPOTIFY_CLIENT_SECRET = '5fbe456341f24578898379081ce624f5';

let spotifyToken = ''; 

const getSpotifyToken = async () => {
  const response = await axios.post('https://accounts.spotify.com/api/token', 
  'grant_type=client_credentials', {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
    },
  });
  spotifyToken = response.data.access_token;
};

app.get('/spotify', async (req, res) => {
  const songName = req.query.query;

  if (!spotifyToken) {
    await getSpotifyToken();
  }

  try {
    const response = await axios.get(`https://api.spotify.com/v1/search`, {
      headers: {
        'Authorization': `Bearer ${spotifyToken}`
      },
      params: {
        q: songName,
        type: 'track',
        limit: 10
      }
    });

    const trackURLs = response.data.tracks.items.map(track => track.external_urls.spotify);

    res.json({ trackURLs });
  } catch (error) {
    console.error('Error fetching data from Spotify API:', error.message);
    res.status(500).json({ error: 'Failed to fetch data from Spotify API' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
