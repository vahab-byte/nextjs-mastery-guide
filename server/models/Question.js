const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    module_id: { type: Number, required: true },
    question: { type: String, required: true },
    options: [String],
    correct_answer: Number,
    explanation: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Question', questionSchema);
