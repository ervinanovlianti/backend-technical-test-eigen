// routes/bookRoutes.js
const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

// Rute untuk menampilkan semua buku
router.get('/books', bookController.getAllBooks);

// Rute untuk menambahkan buku baru
router.post('/books', bookController.addBook);

// Rute untuk menampilkan detail buku berdasarkan kode buku
router.get('/books/:code', bookController.getBookByCode);

// Rute untuk mengubah data buku berdasarkan kode buku
router.put('/books/:code', bookController.updateBook);

// Rute untuk menghapus buku berdasarkan kode buku
router.delete('/books/:code', bookController.deleteBook);

module.exports = router;
