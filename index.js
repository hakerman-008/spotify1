const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const options = {
  method: 'POST',
  url: 'https://all-media-downloader1.p.rapidapi.com/pinterest_name',
  headers: {
    'content-type': 'application/json',
    'X-RapidAPI-Key': 'b38444b5b7mshc6ce6bcd5c9e446p154fa1jsn7bbcfb025b3b',
    'X-RapidAPI-Host': 'all-media-downloader1.p.rapidapi.com'
  }
};

app.get('/spotify', async (req, res) => {
  try {
    const { query } = req.query;
    options.data = { q: query };

    const response = await axios.request(options);
    const trackURLs = response.data.result.data.map(track => track.url);

    return res.json({ trackURLs });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
