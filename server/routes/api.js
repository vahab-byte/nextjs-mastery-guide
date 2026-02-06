const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Module = require('../models/Module');
const Question = require('../models/Question');
const User = require('../models/User');
const Progress = require('../models/Progress');
const Note = require('../models/Note');
const DailyReward = require('../models/DailyReward');
const Achievement = require('../models/Achievement');
const Certificate = require('../models/Certificate');
const Snippet = require('../models/Snippet');
const Project = require('../models/Project');

// Helper: Resolve userId - can be MongoDB ObjectId, Supabase UUID, or email
const resolveUserId = async (identifier) => {
    if (!identifier) return null;

    // Try MongoDB ObjectId first
    if (mongoose.Types.ObjectId.isValid(identifier) && identifier.length === 24) {
        const user = await User.findById(identifier);
        if (user) return user._id.toString();
    }

    // Try external_id (Supabase UUID)
    let user = await User.findOne({ external_id: identifier });
    if (user) return user._id.toString();

    // Try email
    user = await User.findOne({ email: identifier });
    if (user) return user._id.toString();

    return null;
};

// --- HEALTH CHECK ---
router.get('/', (req, res) => {
    res.json({
        status: 'ok',
        message: 'NextJS Mastery API is running!',
        version: '1.0.0',
        endpoints: [
            '/api/modules',
            '/api/blogs',
            '/api/projects',
            '/api/auth/login',
            '/api/auth/sync',
            '/api/progress/:userId',
            '/api/notes/:userId',
            '/api/achievements/:userId',
            '/api/subscription/:userId',
            '/api/leaderboard',
            '/api/plans'
        ]
    });
});

router.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// --- MODULES ---
router.get('/modules', async (req, res) => {
    try {
        const modules = await Module.find({}).sort({ id: 1 });
        res.json(modules);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/modules/:id', async (req, res) => {
    try {
        const module = await Module.findOne({ id: req.params.id });
        if (!module) return res.status(404).json({ message: 'Module not found' });
        res.json(module);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/modules/:id/questions', async (req, res) => {
    try {
        const questions = await Question.find({ module_id: req.params.id });
        res.json(questions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- AUTH (JWT Authentication) ---
const { generateToken, protect } = require('../middleware/auth');

// Register new user
router.post('/auth/register', async (req, res) => {
    try {
        const { email, password, full_name } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create user
        const user = await User.create({
            email,
            password,
            full_name: full_name || email.split('@')[0]
        });

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            token,
            user: {
                _id: user._id,
                email: user.email,
                full_name: user.full_name,
                role: user.role,
                xp_points: user.xp_points
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Login user
router.post('/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find user with password
        const user = await User.findOne({ email }).select('+password');
        if (!user || !user.password) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Update last active
        user.last_active_date = new Date();
        await user.save();

        // Generate token
        const token = generateToken(user._id);

        res.json({
            success: true,
            token,
            user: {
                _id: user._id,
                email: user.email,
                full_name: user.full_name,
                role: user.role,
                xp_points: user.xp_points,
                current_streak: user.current_streak
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get current user
router.get('/auth/me', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.json({
            success: true,
            user
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Sync Supabase user - creates or updates MongoDB user from Supabase auth
router.post('/auth/sync', async (req, res) => {
    try {
        const { id, email, full_name, avatar_url } = req.body;

        if (!id || !email) {
            return res.status(400).json({ message: 'id and email are required' });
        }

        // Find by external_id first, then by email
        let user = await User.findOne({ external_id: id });
        if (!user) {
            user = await User.findOne({ email });
        }

        if (user) {
            // Update existing user
            user.external_id = id;
            if (full_name) user.full_name = full_name;
            if (avatar_url) user.avatar_url = avatar_url;
            user.last_active_date = new Date();
            await user.save();
        } else {
            // Create new user
            user = await User.create({
                external_id: id,
                email,
                full_name: full_name || email.split('@')[0],
                avatar_url
            });
        }

        res.json({
            success: true,
            user: {
                _id: user._id,
                external_id: user.external_id,
                email: user.email,
                full_name: user.full_name,
                xp_points: user.xp_points,
                current_streak: user.current_streak
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- PROGRESS ---
router.get('/progress/:userId', async (req, res) => {
    try {
        // Resolve the userId (handles ObjectId, UUID, or email)
        const resolvedId = await resolveUserId(req.params.userId);
        if (!resolvedId) {
            return res.json([]); // Return empty if user not found
        }
        const progress = await Progress.find({ user_id: resolvedId });
        res.json(progress);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/progress', async (req, res) => {
    const { user_id, module_id, ...updates } = req.body;
    try {
        const progress = await Progress.findOneAndUpdate(
            { user_id, module_id },
            { $set: updates },
            { new: true, upsert: true } // Create if not exists
        );
        res.json(progress);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- NOTES ---
router.get('/notes/:userId', async (req, res) => {
    try {
        const resolvedId = await resolveUserId(req.params.userId);
        if (!resolvedId) {
            return res.json([]);
        }
        const notes = await Note.find({ user_id: resolvedId }).sort({ updatedAt: -1 });
        res.json(notes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/notes', async (req, res) => {
    try {
        const note = await Note.create(req.body);
        res.status(201).json(note);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.put('/notes/:id', async (req, res) => {
    try {
        const note = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(note);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/notes/:id', async (req, res) => {
    try {
        await Note.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- STATS / LEADERBOARD ---
router.get('/leaderboard', async (req, res) => {
    try {
        const users = await User.find({})
            .sort({ xp_points: -1 })
            .limit(10)
            .select('id full_name xp_points current_streak avatar_url');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- USERS ---
router.get('/users/:id', async (req, res) => {
    try {
        // If ID is mongo objectID, findById. If checking by custom ID/email, diff logic.
        // The frontend passes a UUID string from Supabase usually.
        // But here we might have Mongo _id.
        // For compatibility, if we are migrating users, we might store their old ID or just use _id.
        // Let's assume for now we look up by _id (if valid) or 'email' or fallback.
        // Actually, `User` schema has only `email` as unique (besides _id).
        // Let's try to find by _id.
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(user);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.post('/users/:id/activity', async (req, res) => {
    try {
        const { action, description } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            {
                $push: {
                    activityLog: {
                        action,
                        description,
                        timestamp: new Date()
                    }
                }
            },
            { new: true }
        );
        res.json(user);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// --- AI CHAT ---
router.post('/chat', async (req, res) => {
    try {
        const { messages, context } = req.body;
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

        if (!GEMINI_API_KEY) {
            return res.status(500).json({ error: "AI service is not configured (GEMINI_API_KEY missing)" });
        }

        const systemPrompt = `You are an expert Next.js and React instructor. You help students learn web development with clear, practical explanations.
      
      Your teaching style:
      - Use simple language and analogies when explaining complex concepts
      - Provide code examples in TypeScript/React when helpful
      - Break down problems step by step
      - Encourage best practices and modern patterns
      - Be encouraging and supportive
      
      Context about the student:
      ${context ? `- Currently studying: ${context.currentModule || "Next.js fundamentals"}
      - Skill level: ${context.skillLevel || "intermediate"}` : "- General Next.js learning"}
      
      Always format code blocks with proper syntax highlighting markers (use \`\`\`typescript or \`\`\`jsx).
      Keep responses focused and actionable.`;

        const geminiBody = {
            systemInstruction: {
                parts: [{ text: systemPrompt }]
            },
            contents: messages.map(m => ({
                role: m.role === "assistant" ? "model" : "user",
                parts: [{ text: m.content }]
            })),
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1024,
            }
        };

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(geminiBody),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Gemini API Error", errorText);
            return res.status(response.status).json({ error: "Gemini API Error", details: errorText });
        }

        const data = await response.json();
        const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "I apologize, but I couldn't generate a response.";

        // Return standard JSON response
        res.json({ response: aiResponse });

    } catch (err) {
        console.error("AI Chat Error:", err);
        res.status(500).json({ message: err.message });
    }
});

// --- SNIPPETS ---


router.get('/snippets', async (req, res) => {
    try {
        const snippets = await Snippet.find().sort({ createdAt: -1 });
        res.json(snippets);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/snippets', async (req, res) => {
    const { title, code, language, userId } = req.body;
    try {
        const snippet = await Snippet.create({ title, code, language, userId });
        res.status(201).json(snippet);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// --- ACHIEVEMENTS ---

const UserAchievement = require('../models/UserAchievement');

// Get all achievements with user's progress
router.get('/achievements/:userId', async (req, res) => {
    try {
        const achievements = await Achievement.find({});
        const userAchievements = await UserAchievement.find({ user_id: req.params.userId });

        const userAchievementMap = {};
        userAchievements.forEach(ua => {
            userAchievementMap[ua.achievement_key] = ua;
        });

        const result = achievements.map(a => ({
            id: a._id,
            key: a.key,
            title: a.title,
            description: a.description,
            icon: a.icon,
            color: a.color,
            xp: a.xp,
            category: a.category,
            unlocked: userAchievementMap[a.key]?.unlocked || false,
            progress: userAchievementMap[a.key]?.progress || 0,
            unlockedAt: userAchievementMap[a.key]?.unlockedAt || null
        }));

        res.json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Unlock achievement for user
router.post('/achievements/unlock', async (req, res) => {
    const { userId, achievementKey } = req.body;
    try {
        const achievement = await Achievement.findOne({ key: achievementKey });
        if (!achievement) {
            return res.status(404).json({ message: 'Achievement not found' });
        }

        const userAchievement = await UserAchievement.findOneAndUpdate(
            { user_id: userId, achievement_key: achievementKey },
            {
                unlocked: true,
                progress: 100,
                unlockedAt: new Date()
            },
            { upsert: true, new: true }
        );

        // Add XP to user
        await User.findByIdAndUpdate(userId, {
            $inc: { xp_points: achievement.xp }
        });

        res.json({ achievement, userAchievement, xpAwarded: achievement.xp });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update achievement progress
router.post('/achievements/progress', async (req, res) => {
    const { userId, achievementKey, progress } = req.body;
    try {
        const userAchievement = await UserAchievement.findOneAndUpdate(
            { user_id: userId, achievement_key: achievementKey },
            { progress: Math.min(progress, 100) },
            { upsert: true, new: true }
        );
        res.json(userAchievement);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- DAILY REWARDS ---


// Check daily reward status
router.get('/daily-reward/status/:userId', async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const resolvedId = await resolveUserId(req.params.userId);
        if (!resolvedId) {
            // Treat as new user or valid request but no data
            return res.json({ canClaim: true, currentStreak: 1, nextRewardXP: 25, lastClaimedAt: null });
        }

        const lastReward = await DailyReward.findOne({
            user_id: resolvedId
        }).sort({ claimedAt: -1 });

        let canClaim = true;
        let currentStreak = 1;
        let nextRewardXP = 25;

        if (lastReward) {
            const lastClaimDate = new Date(lastReward.claimedAt);
            lastClaimDate.setHours(0, 0, 0, 0);

            // Check if already claimed today
            if (lastClaimDate.getTime() === today.getTime()) {
                canClaim = false;
            }

            // Check streak
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);

            if (lastClaimDate.getTime() === yesterday.getTime()) {
                currentStreak = lastReward.dayNumber + 1;
            } else if (lastClaimDate.getTime() !== today.getTime()) {
                currentStreak = 1; // Streak broken
            } else {
                currentStreak = lastReward.dayNumber;
            }

            // Bonus XP for streak (5 XP per day, max 50 bonus)
            nextRewardXP = 25 + Math.min(currentStreak * 5, 50);
        }

        res.json({
            canClaim,
            currentStreak,
            nextRewardXP,
            lastClaimedAt: lastReward?.claimedAt || null
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Claim daily reward
router.post('/daily-reward/claim', async (req, res) => {
    const { userId } = req.body;
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const resolvedId = await resolveUserId(userId);
        if (!resolvedId) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if already claimed
        const existingClaim = await DailyReward.findOne({
            user_id: resolvedId,
            claimedAt: { $gte: today }
        });

        if (existingClaim) {
            return res.status(400).json({ message: 'Already claimed today', alreadyClaimed: true });
        }

        // Calculate streak
        const lastReward = await DailyReward.findOne({ user_id: resolvedId }).sort({ claimedAt: -1 });
        let dayNumber = 1;

        if (lastReward) {
            const lastClaimDate = new Date(lastReward.claimedAt);
            lastClaimDate.setHours(0, 0, 0, 0);

            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);

            if (lastClaimDate.getTime() === yesterday.getTime()) {
                dayNumber = lastReward.dayNumber + 1;
            }
        }

        // Calculate XP
        const baseXP = 25;
        const streakBonus = Math.min(dayNumber * 5, 50);
        const totalXP = baseXP + streakBonus;

        // Create reward record
        const reward = await DailyReward.create({
            user_id: resolvedId,
            claimedAt: new Date(),
            xpAwarded: baseXP,
            streakBonus,
            dayNumber
        });

        // Update user XP and streak
        await User.findByIdAndUpdate(resolvedId, {
            $inc: { xp_points: totalXP },
            current_streak: dayNumber,
            last_active_date: new Date()
        });

        // Log activity
        await User.findByIdAndUpdate(resolvedId, {
            $push: {
                activityLog: {
                    action: 'Claimed Daily Reward',
                    description: `Earned ${totalXP} XP (Day ${dayNumber} streak)`,
                    timestamp: new Date()
                }
            }
        });

        res.json({
            success: true,
            xpAwarded: totalXP,
            streakBonus,
            dayNumber,
            reward
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- CERTIFICATES ---


// Get user certificates
router.get('/certificates/:userId', async (req, res) => {
    try {
        const certificates = await Certificate.find({ user_id: req.params.userId });
        res.json(certificates);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Award certificate
router.post('/certificates', async (req, res) => {
    const { userId, type, name, level, requirements } = req.body;
    try {
        // Check if already has this certificate
        const existing = await Certificate.findOne({ user_id: userId, type });
        if (existing) {
            return res.status(400).json({ message: 'Certificate already earned' });
        }

        // Generate credential ID
        const typeCode = type.substring(0, 3).toUpperCase();
        const year = new Date().getFullYear();
        const randomId = Math.floor(Math.random() * 9000) + 1000;
        const credentialId = `NXJ-${typeCode}-${year}-${randomId}`;

        const certificate = await Certificate.create({
            user_id: userId,
            type,
            name,
            level,
            credentialId,
            requirements
        });

        // Update user stats
        await User.findByIdAndUpdate(userId, {
            $inc: { certificates_earned: 1, xp_points: 500 }
        });

        // Log activity
        await User.findByIdAndUpdate(userId, {
            $push: {
                activityLog: {
                    action: 'Earned Certificate',
                    description: `Completed ${name}`,
                    timestamp: new Date()
                }
            }
        });

        res.status(201).json(certificate);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- USER STREAK & STATS ---
router.get('/user-streak/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Calculate week progress
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Monday
        startOfWeek.setHours(0, 0, 0, 0);

        const rewards = await DailyReward.find({
            user_id: req.params.userId,
            claimedAt: { $gte: startOfWeek }
        });

        const weekProgress = [false, false, false, false, false, false, false];
        rewards.forEach(r => {
            const day = new Date(r.claimedAt).getDay();
            const adjustedDay = day === 0 ? 6 : day - 1; // Convert to Mon=0, Sun=6
            weekProgress[adjustedDay] = true;
        });

        // Get longest streak from rewards
        const allRewards = await DailyReward.find({ user_id: req.params.userId }).sort({ dayNumber: -1 }).limit(1);
        const longestStreak = allRewards[0]?.dayNumber || 0;

        // Total active days
        const totalDays = await DailyReward.countDocuments({ user_id: req.params.userId });

        res.json({
            currentStreak: user.current_streak || 0,
            longestStreak: Math.max(longestStreak, user.current_streak || 0),
            totalDays,
            weekProgress
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- SUBSCRIPTIONS ---
const Subscription = require('../models/Subscription');

// Plan configurations
const PLANS = {
    starter: {
        price: 0,
        lessons_limit: 5,
        has_ai_assistant: false,
        has_certificates: false,
        has_priority_support: false,
        team_members: 1
    },
    professional: {
        price: 49,
        lessons_limit: -1, // unlimited
        has_ai_assistant: true,
        has_certificates: true,
        has_priority_support: true,
        team_members: 1
    },
    team: {
        price: 199,
        lessons_limit: -1,
        has_ai_assistant: true,
        has_certificates: true,
        has_priority_support: true,
        team_members: 10
    },
    enterprise: {
        price: 0, // Custom
        lessons_limit: -1,
        has_ai_assistant: true,
        has_certificates: true,
        has_priority_support: true,
        team_members: -1 // unlimited
    }
};

// Get user subscription
router.get('/subscription/:userId', async (req, res) => {
    try {
        let subscription = await Subscription.findOne({ user_id: req.params.userId });

        // If no subscription, create starter plan
        if (!subscription) {
            subscription = await Subscription.create({
                user_id: req.params.userId,
                plan: 'starter',
                status: 'active',
                price: 0,
                features: PLANS.starter
            });
        }

        res.json(subscription);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Subscribe / Upgrade plan
router.post('/subscription/subscribe', async (req, res) => {
    const { userId, plan, billingCycle = 'monthly' } = req.body;

    if (!PLANS[plan]) {
        return res.status(400).json({ message: 'Invalid plan' });
    }

    try {
        const planConfig = PLANS[plan];
        const now = new Date();
        const periodEnd = new Date(now);

        if (billingCycle === 'yearly') {
            periodEnd.setFullYear(periodEnd.getFullYear() + 1);
        } else {
            periodEnd.setMonth(periodEnd.getMonth() + 1);
        }

        // Check if user has a subscription
        let subscription = await Subscription.findOne({ user_id: userId });

        if (subscription) {
            // Upgrade existing subscription
            subscription = await Subscription.findOneAndUpdate(
                { user_id: userId },
                {
                    plan,
                    status: plan === 'professional' ? 'trial' : 'active',
                    price: planConfig.price,
                    billing_cycle: billingCycle,
                    trial_ends_at: plan === 'professional' ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : null,
                    current_period_start: now,
                    current_period_end: periodEnd,
                    features: planConfig,
                    updatedAt: now
                },
                { new: true }
            );
        } else {
            // Create new subscription
            subscription = await Subscription.create({
                user_id: userId,
                plan,
                status: plan === 'professional' ? 'trial' : 'active',
                price: planConfig.price,
                billing_cycle: billingCycle,
                trial_ends_at: plan === 'professional' ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : null,
                current_period_start: now,
                current_period_end: periodEnd,
                features: planConfig
            });
        }

        // Log activity
        await User.findByIdAndUpdate(userId, {
            $push: {
                activityLog: {
                    action: 'Subscription Updated',
                    description: `Upgraded to ${plan} plan`,
                    timestamp: now
                }
            }
        }).catch(() => { }); // Ignore if user not found

        res.json({
            success: true,
            subscription,
            message: `Successfully subscribed to ${plan} plan!`
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Cancel subscription
router.post('/subscription/cancel', async (req, res) => {
    const { userId } = req.body;

    try {
        const subscription = await Subscription.findOneAndUpdate(
            { user_id: userId },
            {
                status: 'cancelled',
                cancelled_at: new Date(),
                updatedAt: new Date()
            },
            { new: true }
        );

        if (!subscription) {
            return res.status(404).json({ message: 'Subscription not found' });
        }

        res.json({
            success: true,
            subscription,
            message: 'Subscription cancelled. You can still use your plan until the end of the billing period.'
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all plans (public)
router.get('/plans', (req, res) => {
    const plans = [
        {
            id: 'starter',
            name: 'Starter',
            price: 0,
            period: '',
            description: 'Perfect for exploring the basics',
            features: ['5 Free Lessons', 'Basic Code Editor', 'Community Forum Access', 'Email Support']
        },
        {
            id: 'professional',
            name: 'Professional',
            price: 49,
            period: '/month',
            description: 'Best for individual developers',
            popular: true,
            features: ['All 62+ Lessons', 'Live Code Editor', 'HD Video Content', 'AI Learning Assistant', 'Practice Exams', 'Certification Included', 'Priority Support']
        },
        {
            id: 'team',
            name: 'Team',
            price: 199,
            period: '/month',
            description: 'For growing development teams',
            features: ['Everything in Professional', 'Up to 10 Team Members', 'Team Analytics Dashboard', 'Custom Learning Paths', 'Dedicated Success Manager', 'Slack Integration']
        },
        {
            id: 'enterprise',
            name: 'Enterprise',
            price: 0,
            period: '',
            description: 'For large organizations',
            features: ['Unlimited Team Members', 'SSO & Advanced Security', 'Custom Content & Branding', 'API Access', 'On-premise Deployment', '24/7 Phone Support', 'SLA Guarantee']
        }
    ];

    res.json(plans);
});

// --- BLOGS ---
const Blog = require('../models/Blog');

// Get all blogs with filtering
router.get('/blogs', async (req, res) => {
    try {
        const { category, tag, featured, search, limit = 20 } = req.query;
        let query = { published: true };

        if (category) query.category = category;
        if (tag) query.tags = tag;
        if (featured === 'true') query.featured = true;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { excerpt: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } }
            ];
        }

        const blogs = await Blog.find(query)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit));
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get single blog by slug
router.get('/blogs/:slug', async (req, res) => {
    try {
        const blog = await Blog.findOne({ slug: req.params.slug });
        if (!blog) return res.status(404).json({ message: 'Blog not found' });

        // Increment view count
        blog.views += 1;
        await blog.save();

        res.json(blog);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new blog
router.post('/blogs', async (req, res) => {
    try {
        const blog = await Blog.create(req.body);
        res.status(201).json(blog);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a blog
router.put('/blogs/:id', async (req, res) => {
    try {
        const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!blog) return res.status(404).json({ message: 'Blog not found' });
        res.json(blog);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a blog
router.delete('/blogs/:id', async (req, res) => {
    try {
        await Blog.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Like a blog
router.post('/blogs/:id/like', async (req, res) => {
    try {
        const blog = await Blog.findByIdAndUpdate(
            req.params.id,
            { $inc: { likes: 1 } },
            { new: true }
        );
        if (!blog) return res.status(404).json({ message: 'Blog not found' });
        res.json({ likes: blog.likes });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get blog categories
router.get('/blog-categories', async (req, res) => {
    try {
        const categories = await Blog.distinct('category');
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- PROJECTS ---


// Get all projects with filtering
router.get('/projects', async (req, res) => {
    try {
        const { category, tech, featured, search, limit = 20 } = req.query;
        let query = { published: true };

        if (category) query.category = category;
        if (featured === 'true') query.featured = true;
        if (tech) {
            query.techStack = { $regex: tech, $options: 'i' };
        }
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const projects = await Project.find(query)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit));
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get single project
router.get('/projects/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        // Increment view count
        project.views += 1;
        await project.save();

        res.json(project);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create project
router.post('/projects', async (req, res) => {
    try {
        const project = await Project.create(req.body);
        res.status(201).json(project);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update project
router.put('/projects/:id', async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.json(project);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete project
router.delete('/projects/:id', async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Like project
router.post('/projects/:id/like', async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(
            req.params.id,
            { $inc: { likes: 1 } },
            { new: true }
        );
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.json({ likes: project.likes });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Star project
router.post('/projects/:id/star', async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(
            req.params.id,
            { $inc: { stars: 1 } },
            { new: true }
        );
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.json({ stars: project.stars });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get project categories
router.get('/project-categories', async (req, res) => {
    try {
        const categories = await Project.distinct('category');
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get project stats
router.get('/project-stats', async (req, res) => {
    try {
        const totalProjects = await Project.countDocuments({ published: true });
        const totalStars = await Project.aggregate([{ $group: { _id: null, total: { $sum: '$stars' } } }]);
        const totalViews = await Project.aggregate([{ $group: { _id: null, total: { $sum: '$views' } } }]);
        const featuredCount = await Project.countDocuments({ featured: true });

        res.json({
            totalProjects,
            totalStars: totalStars[0]?.total || 0,
            totalViews: totalViews[0]?.total || 0,
            featuredCount
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ============================
// --- ADMIN API ROUTES ---
// ============================
const { adminOnly } = require('../middleware/auth');

// Admin Dashboard Stats
router.get('/admin/stats', protect, adminOnly, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const activeUsers = await User.countDocuments({
            last_active_date: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        });
        const totalModules = await Module.countDocuments();
        const totalProjects = await Project.countDocuments();
        const totalBlogs = await Blog.countDocuments();
        const totalCertificates = await Certificate.countDocuments();

        // Revenue stats
        const subscriptions = await Subscription.find({ plan: { $ne: 'starter' }, status: 'active' });
        const monthlyRevenue = subscriptions.reduce((sum, sub) => sum + (sub.price || 0), 0);

        // User growth (last 7 days)
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const newUsersThisWeek = await User.countDocuments({ createdAt: { $gte: weekAgo } });

        // Top learners
        const topLearners = await User.find()
            .sort({ xp_points: -1 })
            .limit(5)
            .select('full_name email xp_points avatar_url');

        res.json({
            overview: {
                totalUsers,
                activeUsers,
                totalModules,
                totalProjects,
                totalBlogs,
                totalCertificates,
                monthlyRevenue,
                newUsersThisWeek
            },
            topLearners
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Admin: Get all users
router.get('/admin/users', protect, adminOnly, async (req, res) => {
    try {
        const { page = 1, limit = 20, search, role } = req.query;
        const skip = (page - 1) * limit;

        let query = {};
        if (role) query.role = role;
        if (search) {
            query.$or = [
                { email: { $regex: search, $options: 'i' } },
                { full_name: { $regex: search, $options: 'i' } }
            ];
        }

        const users = await User.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .select('-password');

        const total = await User.countDocuments(query);

        res.json({
            users,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Admin: Update user role
router.put('/admin/users/:id/role', protect, adminOnly, async (req, res) => {
    try {
        const { role } = req.body;
        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        ).select('-password');

        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ success: true, user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Admin: Delete user
router.delete('/admin/users/:id', protect, adminOnly, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Also delete related data
        await Progress.deleteMany({ user_id: req.params.id });
        await Note.deleteMany({ user_id: req.params.id });

        res.json({ success: true, message: 'User and related data deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Admin: Content analytics
router.get('/admin/analytics', protect, adminOnly, async (req, res) => {
    try {
        // Views per module
        const moduleViews = await Progress.aggregate([
            { $group: { _id: '$module_id', views: { $sum: 1 } } },
            { $sort: { views: -1 } },
            { $limit: 10 }
        ]);

        // User activity by day (last 30 days)
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const userActivity = await User.aggregate([
            { $match: { last_active_date: { $gte: thirtyDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$last_active_date' } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Subscription distribution
        const planDistribution = await Subscription.aggregate([
            { $group: { _id: '$plan', count: { $sum: 1 } } }
        ]);

        res.json({
            moduleViews,
            userActivity,
            planDistribution
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Admin: Make user admin (for setup)
router.post('/admin/promote', async (req, res) => {
    try {
        const { email, secret } = req.body;

        // Simple secret check for initial setup
        if (secret !== 'nextjs-mastery-admin-2026') {
            return res.status(403).json({ message: 'Invalid secret' });
        }

        const user = await User.findOneAndUpdate(
            { email },
            { role: 'admin' },
            { new: true }
        );

        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ success: true, message: `${email} is now an admin` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
