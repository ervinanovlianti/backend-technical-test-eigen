const Member = require('../models/Member');
const Book = require('../models/Book');


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

// Kasus 1: Anggota meminjam buku
exports.borrowBook = async (req, res) => {
    try
    {
        const memberCode = req.params.code;
        const bookCode = req.body.code;

        // Temukan anggota dan buku yang dipinjam berdasarkan kode
        const member = await Member.findOne({ code: memberCode });
        const book = await Book.findOne({ code: bookCode });

        if (!member)
        {
            return res.status(404).json({ error: 'Member or book not found' });
        }

        // // Periksa syarat peminjaman
        // if (member.booksBorrowed.length >= 2)
        // {
        //     return res.status(400).json({ error: 'Member cannot borrow more than 2 books' });
        // }

        if (book.isBorrowed)
        {
            return res.status(400).json({ error: 'Book is already borrowed' });
        }

        // Tambahkan buku ke daftar buku yang dipinjam oleh anggota
        member.booksBorrowed.push(bookCode); // Menggunakan bookCode sebagai referensi
        book.isBorrowed = true;
        book.borrowedBy = memberCode; // Menyimpan kode anggota yang meminjam buku

        // Simpan perubahan ke basis data
        await member.save();
        await book.save();

        res.status(200).json({ message: 'Book borrowed successfully' });
    } catch (error)
    {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


// Kasus 2: Anggota mengembalikan buku
// exports.returnBook = async (req, res) => {
//     try
//     {
//         const code = req.params.code;
//         const bookCode = req.body.code;
//         const returnDate = new Date(req.body.returnDate);

//         // Temukan anggota dan buku yang dikembalikan
//         const member = await Member.findOne({ code: code });
//         const book = await Book.findOne({ code: bookCode, borrowedBy: code });

//         if (!member || !book)
//         {
//             return res.status(404).json({ error: 'Member or book not found' });
//         }

//         // Periksa apakah buku dikembalikan lebih dari 7 hari
//         const currentDate = new Date();
//         if (currentDate > returnDate)
//         {
//             // Terapkan hukuman pada anggota
//             member.penaltyStartDate = currentDate;
//             await member.save();
//             return res.status(400).json({ error: 'Book returned late. Penalty applied.' });
//         }

//         // Mengembalikan buku
//         book.isBorrowed = false;
//         book.borrowedBy = null;

//         // Simpan perubahan ke basis data
//         await book.save();

//         res.status(200).json({ message: 'Book returned successfully' });
//     } catch (error)
//     {
//         console.error(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// }