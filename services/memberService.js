// services/memberService.js
const Member = require('../models/Member');

// Layanan untuk menampilkan semua anggota
exports.getAllMembers = async () => {
    try
    {
        const members = await Member.find();
        return members;
    } catch (error)
    {
        throw new Error('Terjadi kesalahan dalam mengambil data anggota.');
    }
};

// Layanan untuk menambahkan anggota baru
exports.addMember = async (code, name) => {
    try
    {
        const newMember = new Member({ code, name });
        await newMember.save();
        return newMember;
    } catch (error)
    {
        throw new Error('Terjadi kesalahan dalam menambahkan anggota.');
    }
};

// Layanan untuk menampilkan detail anggota berdasarkan kode anggota
exports.getMemberByCode = async (code) => {
    try
    {
        const member = await Member.findOne({ code });
        if (!member)
        {
            throw new Error('Anggota tidak ditemukan.');
        }
        return member;
    } catch (error)
    {
        throw new Error('Terjadi kesalahan dalam mengambil data anggota.');
    }
};

// Layanan untuk mengubah data anggota
exports.updateMember = async (code, name) => {
    try
    {
        const updatedMember = await Member.findOneAndUpdate(
            { code },
            { name },
            { new: true }
        );
        if (!updatedMember)
        {
            throw new Error('Anggota tidak ditemukan.');
        }
        return updatedMember;
    } catch (error)
    {
        throw new Error('Terjadi kesalahan dalam mengubah data anggota.');
    }
};

// Layanan untuk menghapus anggota berdasarkan kode anggota
exports.deleteMember = async (code) => {
    try
    {
        const deletedMember = await Member.findOneAndDelete({ code });
        if (!deletedMember)
        {
            throw new Error('Anggota tidak ditemukan.');
        }
        return deletedMember;
    } catch (error)
    {
        throw new Error('Terjadi kesalahan dalam menghapus anggota.');
    }
};
