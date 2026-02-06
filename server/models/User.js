const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    external_id: { type: String, unique: true, sparse: true }, // Supabase UUID
    full_name: String,
    avatar_url: String,
    password: { type: String, select: false }, // Hidden by default
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    xp_points: { type: Number, default: 0 },
    current_streak: { type: Number, default: 0 },
    hours_learned: { type: Number, default: 0 },
    lessons_completed: { type: Number, default: 0 },
    quizzes_passed: { type: Number, default: 0 },
    certificates_earned: { type: Number, default: 0 },
    code_exercises_completed: { type: Number, default: 0 },
    last_active_date: { type: Date, default: Date.now },
    activityLog: [{
        action: String,
        description: String,
        timestamp: { type: Date, default: Date.now }
    }],
    preferences: {
        theme: { type: String, default: 'system' },
        notifications: { type: Boolean, default: true }
    },
    createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || !this.password) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

