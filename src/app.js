const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const urlRoutes = require('./routes/urlRoutes'); // your API routes
const logger = require('./middleware/logger');

dotenv.config();
const app = express();

app.use(express.json());
app.use(logger);

// Serve frontend static files from /public folder
app.use(express.static(path.join(__dirname, '..', 'public')));

// **Mount your API under /api to avoid route clashes**
app.use('/api', urlRoutes);


// Redirect shortcodes to original URLs
const { redirectToOriginal } = require('./controllers/urlController');
app.get('/:shortcode', redirectToOriginal);

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('DB Error:', err));
