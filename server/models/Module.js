const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true }, // Keeping numeric ID for frontend compatibility
    title: { type: String, required: true },
    description: String,
    lessons_count: { type: Number, default: 0 },
    difficulty: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        default: 'Beginner'
    },
    content_overview: String,
    content_code_example: String,
    content_topics: [String],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Module', moduleSchema);
