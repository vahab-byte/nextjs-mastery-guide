import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { courseService } from "@/services/courseService";

export interface UserStats {
  lessonsCompleted: number;
  hoursLearned: number;
  currentStreak: number;
  xpPoints: number;
  quizzesPassed: number;
  certificatesEarned: number;
  lastActiveDate: string;
  codeExercises: number;
  // Aliases for compatibility
  totalHours: number;
  streak: number;
  xp: number;
  examsPassed: number;
}

const DEFAULT_STATS: UserStats = {
  lessonsCompleted: 0,
  hoursLearned: 0,
  currentStreak: 0,
  xpPoints: 0,
  quizzesPassed: 0,
  certificatesEarned: 0,
  lastActiveDate: new Date().toISOString().split('T')[0],
  codeExercises: 0,
  totalHours: 0,
  streak: 0,
  xp: 0,
  examsPassed: 0,
};

export const useUserStats = (userId?: string) => {
  const queryClient = useQueryClient();

  // Fetch stats from API
  const { data: apiStats, isLoading } = useQuery({
    queryKey: ["userStats", userId],
    queryFn: () => userId ? courseService.getUserStats(userId) : Promise.resolve(null),
    enabled: !!userId,
  });

  const [stats, setStats] = useState<UserStats>(DEFAULT_STATS);

  useEffect(() => {
    if (apiStats) {
      setStats({
        lessonsCompleted: apiStats.lessons_completed || 0,
        hoursLearned: apiStats.hours_learned || 0,
        currentStreak: apiStats.current_streak || 0,
        xpPoints: apiStats.xp_points || 0,
        quizzesPassed: apiStats.quizzes_passed || 0,
        certificatesEarned: apiStats.certificates_earned || 0,
        lastActiveDate: apiStats.last_active_date || new Date().toISOString().split('T')[0],
        codeExercises: apiStats.code_exercises_completed || 0,
        totalHours: apiStats.hours_learned || 0,
        streak: apiStats.current_streak || 0,
        xp: apiStats.xp_points || 0,
        examsPassed: apiStats.quizzes_passed || 0, // Mapping quizzes to exams for now or separate
      });
    }
  }, [apiStats]);

  const updateStatsMutation = useMutation({
    mutationFn: async (updates: any) => {
      if (!userId) return;
      return courseService.updateUserStats(userId, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userStats", userId] });
    },
  });

  // Check and update streak logic could be server-side or client-side check on mount
  useEffect(() => {
    if (userId && apiStats) {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      const lastActive = apiStats.last_active_date;

      let newStreak = apiStats.current_streak || 0;
      let shouldUpdate = false;

      if (lastActive !== today) {
        if (lastActive === yesterday) {
          // Continued yesterday, updated when action taken today?
          // Or strictly speaking, if I login today, streak counts?
          // Usually streak updates when you DO something.
          // But if I missed a day, streak should reset.
        } else {
          // Missed more than 1 day
          if (newStreak > 0) {
            newStreak = 0;
            shouldUpdate = true;
          }
        }
      }

      if (shouldUpdate) {
        // Reset streak
        updateStatsMutation.mutate({ current_streak: 0, last_active_date: today });
      }
    }
  }, [userId, apiStats, updateStatsMutation]);

  const completeLesson = useCallback((xpEarned: number = 50, duration: number = 0.5) => {
    if (!userId) return;

    // Optimistic update
    setStats(prev => {
      const today = new Date().toISOString().split('T')[0];
      const isNewDay = prev.lastActiveDate !== today;
      const newHours = Math.round((prev.hoursLearned + duration) * 10) / 10;
      const newStreak = isNewDay ? prev.currentStreak + 1 : prev.currentStreak;
      const newXP = prev.xpPoints + xpEarned;

      updateStatsMutation.mutate({
        lessons_completed: prev.lessonsCompleted + 1,
        hours_learned: newHours,
        xp_points: newXP,
        current_streak: newStreak,
        last_active_date: today
      });

      return {
        ...prev,
        lessonsCompleted: prev.lessonsCompleted + 1,
        hoursLearned: newHours,
        totalHours: newHours,
        xpPoints: newXP,
        xp: newXP,
        currentStreak: newStreak,
        streak: newStreak,
        lastActiveDate: today,
      };
    });
  }, [userId, updateStatsMutation]);

  const completeCodeExercise = useCallback((xpEarned: number = 25) => {
    if (!userId) return;
    setStats(prev => {
      const newXP = prev.xpPoints + xpEarned;
      const newCount = prev.codeExercises + 1;

      updateStatsMutation.mutate({
        xp_points: newXP,
        code_exercises_completed: newCount
      });

      return {
        ...prev,
        codeExercises: newCount,
        xpPoints: newXP,
        xp: newXP,
      };
    });
  }, [userId, updateStatsMutation]);

  const passQuiz = useCallback((xpEarned: number = 100) => {
    if (!userId) return;
    setStats(prev => {
      const newCount = prev.quizzesPassed + 1;
      const newXP = prev.xpPoints + xpEarned;

      updateStatsMutation.mutate({
        quizzes_passed: newCount,
        xp_points: newXP
      });

      return {
        ...prev,
        quizzesPassed: newCount,
        examsPassed: newCount,
        xpPoints: newXP,
        xp: newXP,
      };
    });
  }, [userId, updateStatsMutation]);

  const earnCertificate = useCallback((xpEarned: number = 500) => {
    if (!userId) return;
    setStats(prev => {
      const newCount = prev.certificatesEarned + 1;
      const newXP = prev.xpPoints + xpEarned;

      updateStatsMutation.mutate({
        certificates_earned: newCount,
        xp_points: newXP
      });

      return {
        ...prev,
        certificatesEarned: newCount,
        xpPoints: newXP,
      };
    });
  }, [userId, updateStatsMutation]);

  const addXP = useCallback((amount: number) => {
    if (!userId) return;
    setStats(prev => {
      const newXP = prev.xpPoints + amount;
      updateStatsMutation.mutate({ xp_points: newXP });
      return { ...prev, xpPoints: newXP, xp: newXP };
    });
  }, [userId, updateStatsMutation]);

  const resetStats = useCallback(() => {
    // API reset?
    // Not implementing for now.
    setStats(DEFAULT_STATS);
  }, []);

  return {
    stats,
    completeLesson,
    completeCodeExercise,
    passQuiz,
    earnCertificate,
    addXP,
    resetStats,
  };
};
