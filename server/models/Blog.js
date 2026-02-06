const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    excerpt: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        name: { type: String, required: true },
        avatar: { type: String, default: '' },
        role: { type: String, default: 'Author' }
    },
    category: {
        type: String,
        required: true,
        enum: ['Tutorial', 'Guide', 'News', 'Tips', 'Case Study', 'Interview']
    },
    tags: [{
        type: String
    }],
    coverImage: {
        type: String,
        default: ''
    },
    readTime: {
        type: Number,
        default: 5
    },
    featured: {
        type: Boolean,
        default: false
    },
    published: {
        type: Boolean,
        default: true
    },
    views: {
        type: Number,
        default: 0
    },
    likes: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Auto-generate slug from title if not provided
blogSchema.pre('save', function (next) {
    if (!this.slug) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
    next();
});

module.exports = mongoose.model('Blog', blogSchema);
