const mongoose = require('mongoose');

const userAchievementSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    achievement_key: { type: String, required: true },
    unlocked: { type: Boolean, default: false },
    progress: { type: Number, default: 0 }, // 0-100 percentage
    unlockedAt: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

// Compound index to ensure one achievement per user
userAchievementSchema.index({ user_id: 1, achievement_key: 1 }, { unique: true });

module.exports = mongoose.model('UserAchievement', userAchievementSchema);
