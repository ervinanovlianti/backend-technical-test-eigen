const Member = require('../models/Member');
const Book = require('../models/Book');

class memberController {
    // Controller untuk menampilkan semua anggota
    async getAllMembers(req, res) {
        try
        {
            const members = await Member.find();
            res.status(200).json(members);
        } catch (error)
        {
            res.status(500).json({ error: 'Terjadi kesalahan dalam mengambil data anggota.' });
        }
    }
    async addMember(req, res) {
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
    async getMemberByCode(req, res) {
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
    async updateMember(req, res) {
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
    async deleteMember(req, res) {
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

    async borrowBook(req, res) {
        const { code } = req.params;
        const { bookCode } = req.body;

        try
        {
            const member = await Member.findOne({ code });
            const book = await Book.findOne({ code: bookCode });

            if (!member || !book)
            {
                return res.status(400).json({ error: 'Member or book not found' });
            }

            // Implementasikan aturan peminjaman di sini, seperti cek stok buku, apakah buku sudah dipinjam, dll.
            if (member.borrowedBooks.length >= 2)
            {
                return res.status(400).json({ error: 'Member cannot borrow more than 2 books' });
            }

            if (book.isBorrowed && book.stock == 0)
            {
                return res.status(400).json({ error: 'Book is already borrowed' });
            }
            // Periksa apakah buku sudah pernah dipinjam oleh anggota ini sebelumnya
            if (member.borrowedBooks.includes(bookCode))
            {
                return res.status(400).json({ error: 'Member has already borrowed this book' });
            }

            member.borrowedBooks.push(bookCode);
            await member.save();

            book.isBorrowed = true;
            book.borrowedBy.push(member.code);
            book.stock--; // Kurangi stok buku
            await book.save();

            res.status(200).json({ message: 'Book borrowed successfully' });
        } catch (error)
        {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };

    // Metode untuk mengembalikan buku oleh anggota
    async returnBook(req, res) {
        const { code } = req.params;
        const { bookCode } = req.body;

        try
        {
            const member = await Member.findOne({ code });
            const book = await Book.findOne({ code: bookCode });

            if (!member || !book)
            {
                return res.status(404).json({ error: 'Member or book not found' });
            }

            // Periksa apakah buku adalah buku yang dipinjam oleh anggota ini
            if (!member.borrowedBooks.includes(bookCode))
            {
                return res.status(400).json({ error: 'Book does not belong to the member' });
            }

            // Hapus kode buku dari daftar buku yang dipinjam oleh anggota
            member.borrowedBooks = member.borrowedBooks.filter(code => code !== bookCode);
            await member.save();

            // Hapus nilai borrowedBy pada buku
            book.borrowedBy = book.borrowedBy.filter(memberCode => memberCode !== member.code);

            // Tambahkan stok buku karena buku dikembalikan
            book.stock++;
            await book.save();

            res.status(200).json({ message: 'Book returned successfully' });
        } catch (error)
        {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };

}
module.exports = new memberController();

