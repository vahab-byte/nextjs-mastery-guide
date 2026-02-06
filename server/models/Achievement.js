const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true }, // e.g. "first_steps", "code_warrior"
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, default: 'Trophy' }, // Icon name like "BookOpen", "Code2"
    color: { type: String, default: 'from-green-500 to-emerald-500' },
    xp: { type: Number, default: 50 },
    category: { type: String, enum: ['learning', 'streak', 'coding', 'social', 'special'], default: 'learning' },
    requirement: {
        type: { type: String }, // "lessons_completed", "streak_days", "code_lines", etc.
        value: { type: Number }
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Achievement', achievementSchema);
