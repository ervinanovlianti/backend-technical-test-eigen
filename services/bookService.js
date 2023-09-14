// services/bookService.js
const Book = require('../models/Book');

// Layanan untuk menampilkan semua buku
exports.getAllBooks = async () => {
    try
    {
        const books = await Book.find();
        return books;
    } catch (error)
    {
        throw new Error('Terjadi kesalahan dalam mengambil data buku.');
    }
};

// Layanan untuk menambahkan buku baru
exports.addBook = async (code, title, author, stock) => {
    try
    {
        const newBook = new Book({ code, title, author, stock });
        await newBook.save();
        return newBook;
    } catch (error)
    {
        throw new Error('Terjadi kesalahan dalam menambahkan buku.');
    }
};

// Layanan untuk menampilkan detail buku berdasarkan kode buku
exports.getBookByCode = async (code) => {
    try
    {
        const book = await Book.findOne({ code });
        if (!book)
        {
            throw new Error('Buku tidak ditemukan.');
        }
        return book;
    } catch (error)
    {
        throw new Error('Terjadi kesalahan dalam mengambil data buku.');
    }
};

// Layanan untuk mengubah data buku
exports.updateBook = async (code, title, author, stock) => {
    try
    {
        const updatedBook = await Book.findOneAndUpdate(
            { code },
            { title, author, stock },
            { new: true }
        );
        if (!updatedBook)
        {
            throw new Error('Buku tidak ditemukan.');
        }
        return updatedBook;
    } catch (error)
    {
        throw new Error('Terjadi kesalahan dalam mengubah data buku.');
    }
};

// Layanan untuk menghapus buku berdasarkan kode buku
exports.deleteBook = async (code) => {
    try
    {
        const deletedBook = await Book.findOneAndDelete({ code });
        if (!deletedBook)
        {
            throw new Error('Buku tidak ditemukan.');
        }
        return deletedBook;
    } catch (error)
    {
        throw new Error('Terjadi kesalahan dalam menghapus buku.');
    }
};
