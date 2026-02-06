const mongoose = require('mongoose');

const snippetSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        default: 'Untitled Snippet'
    },
    code: {
        type: String,
        required: true
    },
    language: {
        type: String,
        default: 'javascript'
    },
    userId: {
        type: String, // Can store Supabase UUID or Mongo _id
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Snippet', snippetSchema);
