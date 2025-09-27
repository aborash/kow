const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/scrape', async (req, res) => {
    try {
        const url = req.query.url;
        if (!url) return res.status(400).send('URL manquante');

        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const street = $('[itemprop="streetAddress"]').text().trim();
        const postalCode = $('[itemprop="postalCode"]').text().trim();
        const locality = $('[itemprop="addressLocality"]').text().trim();
        const country = $('[itemprop="addressCountry"]').text().trim();
        const adresse = `${street}, ${postalCode} ${locality}, ${country}`;

        res.json({ adresse });
    } catch (error) {
        console.error("Erreur :", error.message);
        res.status(500).send('Erreur lors du scraping');
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
