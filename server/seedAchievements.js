const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Achievement = require('./models/Achievement');

dotenv.config();

const achievements = [
    {
        key: 'first_steps',
        title: 'First Steps',
        description: 'Complete your first lesson',
        icon: 'BookOpen',
        color: 'from-green-500 to-emerald-500',
        xp: 50,
        category: 'learning',
        requirement: { type: 'lessons_completed', value: 1 }
    },
    {
        key: 'code_warrior',
        title: 'Code Warrior',
        description: 'Write 100 lines of code',
        icon: 'Code2',
        color: 'from-blue-500 to-cyan-500',
        xp: 100,
        category: 'coding',
        requirement: { type: 'code_lines', value: 100 }
    },
    {
        key: 'quick_learner',
        title: 'Quick Learner',
        description: 'Complete 5 lessons in one day',
        icon: 'Zap',
        color: 'from-yellow-500 to-orange-500',
        xp: 150,
        category: 'learning',
        requirement: { type: 'daily_lessons', value: 5 }
    },
    {
        key: 'week_warrior',
        title: 'Week Warrior',
        description: 'Maintain a 7-day streak',
        icon: 'Flame',
        color: 'from-orange-500 to-red-500',
        xp: 200,
        category: 'streak',
        requirement: { type: 'streak_days', value: 7 }
    },
    {
        key: 'module_master',
        title: 'Module Master',
        description: 'Complete an entire module',
        icon: 'Target',
        color: 'from-purple-500 to-pink-500',
        xp: 250,
        category: 'learning',
        requirement: { type: 'modules_completed', value: 1 }
    },
    {
        key: 'perfectionist',
        title: 'Perfectionist',
        description: 'Score 100% on 3 exams',
        icon: 'Star',
        color: 'from-amber-500 to-yellow-500',
        xp: 300,
        category: 'learning',
        requirement: { type: 'perfect_exams', value: 3 }
    },
    {
        key: 'night_owl',
        title: 'Night Owl',
        description: 'Study after midnight',
        icon: 'Sparkles',
        color: 'from-indigo-500 to-purple-500',
        xp: 100,
        category: 'special',
        requirement: { type: 'night_study', value: 1 }
    },
    {
        key: 'champion',
        title: 'Champion',
        description: 'Reach the Expert level',
        icon: 'Crown',
        color: 'from-amber-400 to-yellow-300',
        xp: 500,
        category: 'special',
        requirement: { type: 'level', value: 10 }
    }
];

const seedAchievements = async () => {
    try {
        await connectDB();
        console.log('Connected to MongoDB');

        // Clear existing achievements
        await Achievement.deleteMany({});
        console.log('Cleared existing achievements');

        // Insert new achievements
        await Achievement.insertMany(achievements);
        console.log(`Inserted ${achievements.length} achievements`);

        console.log('Seed completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Seed error:', err);
        process.exit(1);
    }
};

seedAchievements();
