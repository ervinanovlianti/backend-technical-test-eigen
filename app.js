const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Gunakan middleware body-parser
app.use(bodyParser.json()); // Untuk mengurai permintaan JSON
app.use(bodyParser.urlencoded({ extended: false })); // Untuk mengurai permintaan formulir

// Import rute-rute
const memberRoutes = require('./routes/memberRoutes');
const bookRoutes = require('./routes/bookRoutes');

// Hubungkan ke MongoDB

mongoose.connect('mongodb://localhost:27017/perpustakaan', { useNewUrlParser: true, useUnifiedTopology: true });

// Gunakan rute-rute
app.use('/api', memberRoutes); // contoh path '/api/members'
app.use('/api', bookRoutes);   // contoh path '/api/books'

// Mulai server Express
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server berjalan di port ${port}`);
});

module.exports = app;