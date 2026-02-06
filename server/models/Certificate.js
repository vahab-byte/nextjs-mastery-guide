const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true }, // "foundations", "professional", "expert", "master"
    name: { type: String, required: true },
    level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Master'], required: true },
    credentialId: { type: String, required: true, unique: true },
    earnedAt: { type: Date, default: Date.now },
    requirements: { type: Number, default: 0 },
    verified: { type: Boolean, default: true }
});

certificateSchema.index({ user_id: 1, type: 1 });

module.exports = mongoose.model('Certificate', certificateSchema);
