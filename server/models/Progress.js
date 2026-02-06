const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    module_id: { type: Number, required: true },
    is_completed: { type: Boolean, default: false },
    last_accessed_at: { type: Date, default: Date.now },
    lesson_details: { type: mongoose.Schema.Types.Mixed, default: {} }, // JSON object
    exam_passed: { type: Boolean, default: false },
    exam_score: Number
});

// Compound index to ensure one progress entry per user per module
progressSchema.index({ user_id: 1, module_id: 1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema);
