// routes/memberRoutes.js
const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');

// Rute untuk menampilkan semua anggota
router.get('/members', memberController.getAllMembers);

// Rute untuk menambahkan anggota baru
router.post('/members', memberController.addMember);

// Rute untuk menampilkan detail anggota berdasarkan kode anggota
router.get('/members/:code', memberController.getMemberByCode);

// Rute untuk mengubah data anggota berdasarkan kode anggota
router.put('/members/:code', memberController.updateMember);

// Rute untuk menghapus anggota berdasarkan kode anggota
router.delete('/members/:code', memberController.deleteMember);

module.exports = router;
