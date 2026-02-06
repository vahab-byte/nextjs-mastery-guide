const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    user_id: { type: String, required: true }, // Changed to String to accept Supabase UUID
    module_id: Number,
    lesson_id: String,
    title: { type: String, required: true },
    content: { type: String, default: '' },
    tags: { type: [String], default: [] },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Index for faster queries
noteSchema.index({ user_id: 1, updatedAt: -1 });

module.exports = mongoose.model('Note', noteSchema);
