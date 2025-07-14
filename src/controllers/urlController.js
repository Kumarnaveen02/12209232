// src/controllers/urlController.js
const Url = require('../models/Url');
const { nanoid } = require('nanoid');

// Helper to get expiry date
const getExpiryDate = (minutes) => {
  return new Date(Date.now() + minutes * 60 * 1000);
};

// Create short URL
exports.createShortUrl = async (req, res) => {
  try {
    const { url, validity = 30, shortcode } = req.body;

    if (!url) return res.status(400).json({ error: "URL is required" });

    let code = shortcode || nanoid(6);

    // Check if custom code already exists
    const existing = await Url.findOne({ shortCode: code });
    if (existing) {
      return res.status(409).json({ error: "Shortcode already taken" });
    }

    const shortUrl = new Url({
      shortCode: code,
      longUrl: url,
      expiresAt: getExpiryDate(validity)
    });

    await shortUrl.save();

    const fullShortLink = `${req.protocol}://${req.get('host')}/${code}`;
    return res.status(201).json({
      shortLink: fullShortLink,
      expiry: shortUrl.expiresAt.toISOString()
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Redirect
exports.redirectToOriginal = async (req, res) => {
  try {
    const { shortcode } = req.params;
    const url = await Url.findOne({ shortCode: shortcode });

    if (!url) return res.status(404).json({ error: "Shortcode not found" });

    if (url.expiresAt < new Date()) {
      return res.status(410).json({ error: "Short link expired" });
    }

    // Track click
    url.clickCount += 1;
    url.clickData.push({
      referrer: req.get('referrer') || "Direct",
      location: "India" // or use IP lookup service in future
    });
    await url.save();

    return res.redirect(url.longUrl);

  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Analytics
exports.getAnalytics = async (req, res) => {
  try {
    const { shortcode } = req.params;
    const url = await Url.findOne({ shortCode: shortcode });

    if (!url) return res.status(404).json({ error: "Shortcode not found" });

    return res.status(200).json({
      clicks: url.clickCount,
      originalUrl: url.longUrl,
      createdAt: url.createdAt,
      expiry: url.expiresAt,
      clickData: url.clickData
    });

  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
