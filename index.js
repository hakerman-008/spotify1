const axios = require('axios');
const express = require('express');
const app = express();

const apiKeys = [
    'b38444b5b7mshc6ce6bcd5c9e446p154fa1jsn7bbcfb025b3b',
   '719775e815msh65471c929a0203bp10fe44jsndcb70c04bc42',

  '0c162a35d2msh1999dc27302c23bp15ac06jsnb872ad3d865a',

  'a2743acb5amsh6ac9c5c61aada87p156ebcjsnd25f1ef87037',

  'dbb7d1cb38mshaef57d448300fe7p1226f0jsn0e6f12ae7abf'
    // Add more keys as needed
];

let currentApiKeyIndex = 0;
let requestCount = 0;
const maxRequestsPerApiKey = 490;

async function fetchTrackURLs(query) {
    const apiKey = apiKeys[currentApiKeyIndex];
    const options = {
        method: 'GET',
        url: 'https://spotify23.p.rapidapi.com/search/',
        params: {
            q: query,
            type: 'tracks',
            offset: '0',
            limit: '10',
            numberOfTopResults: '5'
        },
        headers: {
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        const trackURLs = response.data.tracks.items.map(item => `https://open.spotify.com/track/${item.data.id}`);
        return trackURLs;
    } catch (error) {
        console.error(error);
        return [];
    }
}

app.get('/spotify', async (req, res) => {
    try {
        const { query: q } = req.query;

        if (!q) {
            return res.status(400).json({ error: 'Query parameter "query" is required' });
        }

        const trackURLs = await fetchTrackURLs(q);

        // Update request count and switch to the next API key if needed
        requestCount++;
        if (requestCount >= maxRequestsPerApiKey) {
            currentApiKeyIndex = (currentApiKeyIndex + 1) % apiKeys.length;
            requestCount = 0; // Reset request count
        }

        return res.json({ trackURLs });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
