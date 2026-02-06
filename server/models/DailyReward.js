const mongoose = require('mongoose');

const dailyRewardSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    claimedAt: { type: Date, required: true },
    xpAwarded: { type: Number, default: 25 },
    streakBonus: { type: Number, default: 0 },
    dayNumber: { type: Number, default: 1 } // Day N of streak
});

// Index to quickly find user's rewards
dailyRewardSchema.index({ user_id: 1, claimedAt: -1 });

module.exports = mongoose.model('DailyReward', dailyRewardSchema);
