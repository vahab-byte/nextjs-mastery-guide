import { api, Module, Question, UserProgress } from './api';

export type { Module, Question, UserProgress };

export const courseService = {
    getModules: () => api.modules.getAll(),
    getModule: (id: number) => api.modules.getById(id),
    getQuestions: (moduleId: number) => api.modules.getQuestions(moduleId),
    getUserProgress: (userId: string) => api.progress.getByUser(userId),
    markModuleComplete: (userId: string, moduleId: number) => api.progress.markComplete(userId, moduleId),
    updateProgress: (userId: string, moduleId: number, updates: Partial<UserProgress>) => api.progress.update(userId, moduleId, updates),
    getUserStats: (userId: string) => api.stats.getUserStats(userId),
    updateUserStats: async (userId: string, updates: any) => {
        // Not fully implemented on new API yet, but we can assume user update
        // For now, return success mock or implement user update endpoint in api.ts
        return { success: true };
    },
    getLeaderboard: (limit?: number) => api.stats.getLeaderboard(limit),
    getAchievements: (userId: string) => api.achievements.getAll(userId),
    unlockAchievement: (userId: string, key: string) => api.achievements.unlock(userId, key),
    updateAchievementProgress: (userId: string, key: string, progress: number) => api.achievements.updateProgress(userId, key, progress),
    getDailyRewardStatus: (userId: string) => api.dailyReward.getStatus(userId),
    claimDailyReward: (userId: string) => api.dailyReward.claim(userId),
    getCertificates: (userId: string) => api.certificates.getAll(userId),
    earnCertificate: (userId: string, type: string, name: string, level: string, requirements: number) =>
        api.certificates.earn({ userId, type, name, level, requirements }),
    getUserStreak: (userId: string) => api.stats.getUserStreak(userId),
    logActivity: (userId: string, action: string, description: string) => api.stats.logActivity(userId, action, description)
};
