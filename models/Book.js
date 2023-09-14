// models/Book.js
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    borrowedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member',
        default: null,
    },
    dueDate: {
        type: Date,
        default: null,
    },
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
