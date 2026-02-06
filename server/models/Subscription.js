const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    user_id: { type: String, required: true },
    plan: {
        type: String,
        enum: ['starter', 'professional', 'team', 'enterprise'],
        default: 'starter'
    },
    status: {
        type: String,
        enum: ['active', 'cancelled', 'expired', 'trial'],
        default: 'active'
    },
    price: { type: Number, default: 0 },
    billing_cycle: { type: String, enum: ['monthly', 'yearly', 'lifetime'], default: 'monthly' },
    trial_ends_at: { type: Date },
    current_period_start: { type: Date, default: Date.now },
    current_period_end: { type: Date },
    cancelled_at: { type: Date },
    features: {
        lessons_limit: { type: Number, default: 5 },
        has_ai_assistant: { type: Boolean, default: false },
        has_certificates: { type: Boolean, default: false },
        has_priority_support: { type: Boolean, default: false },
        team_members: { type: Number, default: 1 }
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

subscriptionSchema.index({ user_id: 1 });

module.exports = mongoose.model('Subscription', subscriptionSchema);
