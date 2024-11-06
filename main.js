require('dotenv').config(); 

const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Send API Key from the server-side to the client 
// as part of the API response 
app.get('/config', (req, res) => {
  res.json({ apiKey: process.env.API_KEY });
});

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Send 'index.html' as the response to any request
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});