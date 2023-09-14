// models/Member.js
const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    booksBorrowed: {
        type: Number,
        default: 0,
    },
    penalty: {
        type: Boolean,
        default: false,
    },
});

const Member = mongoose.model('Member', memberSchema);

module.exports = Member;
