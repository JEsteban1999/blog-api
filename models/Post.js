const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {type: String, required: true},
    content: {type: String, required: true},
    category: {type: String, required: true},
    tags: [String],
}, {timestamps: true});

module.exports = mongoose.model('Post', postSchema);