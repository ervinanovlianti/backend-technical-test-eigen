// services/bookService.js
const Book = require('../models/Book');

class BookService {
    async getAllBooks() {
        return await Book.find();
    }

    async getBookByCode(code) {
        return await Book.findOne({ code });
    }

    async borrowBook(bookCode) {
        const book = await Book.findOne({ code: bookCode });
        if (!book)
        {
            throw new Error('Book not found');
        }
        if (book.isBorrowed)
        {
            throw new Error('Book is already borrowed');
        }
        book.isBorrowed = true;
        await book.save();
        return book;
    }

    async returnBook(bookCode) {
        const book = await Book.findOne({ code: bookCode });
        if (!book)
        {
            throw new Error('Book not found');
        }
        book.isBorrowed = false;
        await book.save();
        return book;
    }
}

module.exports = new BookService();