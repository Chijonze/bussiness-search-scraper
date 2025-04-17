require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
if (!GOOGLE_API_KEY) {
    console.error("Missing GOOGLE_API_KEY in environment.");
    process.exit(1);
}

// 🟢 1️⃣ Fetch Clothing Stores in Idaho from Google Places API
app.get('/businesses', async (req, res) => {
    try {
        const { query } = req.query; // Get query from frontend
        if (!query) return res.status(400).json({ error: 'Query parameter is required' });

        const googlePlacesURL = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${GOOGLE_API_KEY}`;
        
        const response = await axios.get(googlePlacesURL);
        const businesses = await Promise.all(response.data.results.map(async (biz) => {
            let website = biz.website || null;
            let phone = null;

            // Fetch website and phone using Place Details API
            const placeDetailsURL = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${biz.place_id}&fields=website,formatted_phone_number&key=${GOOGLE_API_KEY}`;
            const detailsResponse = await axios.get(placeDetailsURL);
            if (detailsResponse.data.result) {
                website = detailsResponse.data.result.website || website;
                phone = detailsResponse.data.result.formatted_phone_number || null;
            }

            return {
                name: biz.name,
                address: biz.formatted_address,
                place_id: biz.place_id,
                website: website,
                phone: phone
            };
        }));

        res.json(businesses);
    } catch (error) {
        console.error('Google API Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch businesses' });
    }
});

// 🟢 2️⃣ Scrape Emails and Phone Numbers from Business Websites
app.get('/scrape-contact', async (req, res) => {
    try {
        let { website } = req.query;
        if (!website) return res.status(400).json({ error: 'Website URL required' });
        
        // Ensure the website URL includes an HTTP protocol
        if (!/^https?:\/\//i.test(website)) {
            website = 'http://' + website;
        }
        
        try {
            const { data } = await axios.get(website, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });
            const $ = cheerio.load(data);

            // Scrape Email
            let email = $('a[href^="mailto:"]').first().attr('href');
            if (email) {
                email = email.replace('mailto:', '');
            } else {
                // Fallback: search for email using regex
                const emailMatch = data.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g);
                email = emailMatch ? emailMatch[0] : 'Not found';
            }

            // Scrape Phone Number
            const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
            const phoneMatches = data.match(phoneRegex);
            let phone = phoneMatches ? phoneMatches[0] : 'Not found';

            // Clean up phone number (remove non-numeric characters except '+')
            if (phone !== 'Not found') {
                phone = phone.replace(/[^\d+]/g, '');
            }

            res.json({ website, email, phone });
        } catch (error) {
            if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
                return res.status(400).json({ error: 'Invalid website URL or server is down' });
            }
            throw error;
        }
    } catch (error) {
        console.error('Scraping Error:', error.message);
        res.status(500).json({ error: 'Failed to scrape contact information' });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));