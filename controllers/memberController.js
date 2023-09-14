// controllers/memberController.js
const Member = require('../models/Member');

// Controller untuk menampilkan semua anggota
exports.getAllMembers = async (req, res) => {
    try
    {
        const members = await Member.find();
        res.json(members);
    } catch (error)
    {
        res.status(500).json({ error: 'Terjadi kesalahan dalam mengambil data anggota.' });
    }
};

// Controller untuk menambahkan anggota baru
exports.addMember = async (req, res) => {
    const { code, name } = req.body;
    if (!code || !name)
    {
        return res.status(400).json({ error: 'Kode dan nama anggota harus diisi.' });
    }

    try
    {
        const newMember = new Member({ code, name });
        await newMember.save();
        res.status(201).json(newMember);
    } catch (error)
    {
        res.status(500).json({ error: 'Terjadi kesalahan dalam menambahkan anggota.' });
    }
};

// Controller untuk menampilkan detail anggota berdasarkan kode anggota
exports.getMemberByCode = async (req, res) => {
    const { code } = req.params;

    try
    {
        const member = await Member.findOne({ code });
        if (!member)
        {
            return res.status(404).json({ error: 'Anggota tidak ditemukan.' });
        }
        res.json(member);
    } catch (error)
    {
        res.status(500).json({ error: 'Terjadi kesalahan dalam mengambil data anggota.' });
    }
};

// Controller untuk mengubah data anggota
exports.updateMember = async (req, res) => {
    const { code } = req.params;
    const { name } = req.body;

    try
    {
        const updatedMember = await Member.findOneAndUpdate(
            { code },
            { name },
            { new: true }
        );
        if (!updatedMember)
        {
            return res.status(404).json({ error: 'Anggota tidak ditemukan.' });
        }
        res.json(updatedMember);
    } catch (error)
    {
        res.status(500).json({ error: 'Terjadi kesalahan dalam mengubah data anggota.' });
    }
};

// Controller untuk menghapus anggota berdasarkan kode anggota
exports.deleteMember = async (req, res) => {
    const { code } = req.params;

    try
    {
        const deletedMember = await Member.findOneAndDelete({ code });
        if (!deletedMember)
        {
            return res.status(404).json({ error: 'Anggota tidak ditemukan.' });
        }
        res.json(deletedMember);
    } catch (error)
    {
        res.status(500).json({ error: 'Terjadi kesalahan dalam menghapus anggota.' });
    }
};
