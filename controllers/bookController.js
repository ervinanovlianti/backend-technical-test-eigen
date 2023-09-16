const Book = require('../models/Book');

// Controller untuk menampilkan semua buku
exports.getAllBooks = async (req, res) => {
    try
    {
        const books = await Book.find();
        res.json(books);
    } catch (error)
    {
        res.status(500).json({ error: 'Terjadi kesalahan dalam mengambil data buku.' });
    }
};

// Controller untuk menambahkan buku baru
exports.addBook = async (req, res) => {
    const { code, title, author, stock } = req.body;
    if (!code || !title || !author || !stock)
    {
        return res.status(400).json({ error: 'Semua field harus diisi.' });
    }

    try
    {
        const newBook = new Book({ code, title, author, stock });
        await newBook.save();
        res.status(201).json(newBook);
    } catch (error)
    {
        res.status(500).json({ error: 'Terjadi kesalahan dalam menambahkan buku.' });
    }
};

// Controller untuk menampilkan detail buku berdasarkan kode buku
exports.getBookByCode = async (req, res) => {
    const { code } = req.params;

    try
    {
        const book = await Book.findOne({ code });
        if (!book)
        {
            return res.status(404).json({ error: 'Buku tidak ditemukan.' });
        }
        res.json(book);
    } catch (error)
    {
        res.status(500).json({ error: 'Terjadi kesalahan dalam mengambil data buku.' });
    }
};

// Controller untuk mengubah data buku
exports.updateBook = async (req, res) => {
    const { code } = req.params;
    const { title, author, stock } = req.body;

    try
    {
        const updatedBook = await Book.findOneAndUpdate(
            { code },
            { title, author, stock },
            { new: true }
        );
        if (!updatedBook)
        {
            return res.status(404).json({ error: 'Buku tidak ditemukan.' });
        }
        res.json(updatedBook);
    } catch (error)
    {
        res.status(500).json({ error: 'Terjadi kesalahan dalam mengubah data buku.' });
    }
};

// Controller untuk menghapus buku berdasarkan kode buku
exports.deleteBook = async (req, res) => {
    const { code } = req.params;

    try
    {
        const deletedBook = await Book.findOneAndDelete({ code });
        if (!deletedBook)
        {
            return res.status(404).json({ error: 'Buku tidak ditemukan.' });
        }
        res.json(deletedBook);
    } catch (error)
    {
        res.status(500).json({ error: 'Terjadi kesalahan dalam menghapus buku.' });
    }
};
