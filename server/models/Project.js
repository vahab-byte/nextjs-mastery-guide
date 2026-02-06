const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: ''
    },
    author: {
        name: { type: String, required: true },
        avatar: { type: String, default: '' }
    },
    techStack: [{
        type: String
    }],
    liveUrl: {
        type: String,
        default: ''
    },
    githubUrl: {
        type: String,
        default: ''
    },
    category: {
        type: String,
        required: true
    },
    stars: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    },
    likes: {
        type: Number,
        default: 0
    },
    featured: {
        type: Boolean,
        default: false
    },
    published: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);
