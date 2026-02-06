import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { courseService, UserProgress as APIUserProgress } from "@/services/courseService";

export interface LessonProgress {
  lessonId: string;
  moduleId: number;
  completed: boolean;
  completedAt?: string;
  timeSpent: number; // in minutes
}

export interface ModuleProgress {
  moduleId: number;
  lessonsCompleted: number;
  totalLessons: number;
  examPassed: boolean;
  examScore?: number;
  startedAt?: string;
  completedAt?: string;
}

interface UserProgress {
  lessons: Record<string, LessonProgress>;
  modules: Record<number, ModuleProgress>;
  currentModule: number;
  overallProgress: number;
}

const DEFAULT_PROGRESS: UserProgress = {
  lessons: {},
  modules: {},
  currentModule: 1,
  overallProgress: 0,
};

export const useUserProgress = (userId?: string) => {
  const queryClient = useQueryClient();

  // Fetch progress from API
  const { data: apiProgress, isLoading } = useQuery({
    queryKey: ["userProgress", userId],
    queryFn: () => userId ? courseService.getUserProgress(userId) : Promise.resolve([]),
    enabled: !!userId,
  });

  // Transform API data to local state format
  const [progress, setProgress] = useState<UserProgress>(DEFAULT_PROGRESS);

  useEffect(() => {
    if (apiProgress && apiProgress.length > 0) {
      const newLessons: Record<string, LessonProgress> = {};
      const newModules: Record<number, ModuleProgress> = {};
      let maxModuleId = 1;

      apiProgress.forEach((p) => {
        // Parse lesson details
        if (p.lesson_details && typeof p.lesson_details === 'object') {
          Object.assign(newLessons, p.lesson_details);
        }

        // Module progress
        // Calculate lessons completed from lesson details for this module
        const moduleLessons = Object.values(newLessons).filter((l: any) => l.moduleId === p.module_id);
        const lessonsCompleted = moduleLessons.filter((l: any) => l.completed).length;

        newModules[p.module_id] = {
          moduleId: p.module_id,
          lessonsCompleted: lessonsCompleted,
          totalLessons: 10, // heuristic, ideally should come from module data
          examPassed: p.exam_passed,
          examScore: p.exam_score || undefined,
          startedAt: p.last_accessed_at,
          completedAt: p.is_completed ? p.last_accessed_at : undefined,
        };

        if (p.module_id > maxModuleId) maxModuleId = p.module_id;
      });

      // Calculate next available module
      // If module 1 is passed, unlock 2.
      // Find highest module that is unlocked.
      // Simple logic: max module from DB + 1 (if last one passed) or just max module.
      // Actually we want the current active module.
      let currentModule = 1;
      for (let i = 1; i <= 100; i++) { // limit loop
        const mod = newModules[i];
        if (mod && mod.examPassed) {
          currentModule = i + 1;
        } else {
          // If we have progress but exam not passed, this is current.
          // If we don't have progress, this is current (if prev was passed).
          currentModule = i;
          break;
        }
      }

      // Overall calculations
      const totalLessonsCompleted = Object.values(newLessons).filter((l: any) => l.completed).length;
      const overallProgress = Math.min(100, Math.round((totalLessonsCompleted / 100) * 100));

      setProgress({
        lessons: newLessons,
        modules: newModules,
        currentModule,
        overallProgress,
      });
    }
  }, [apiProgress]);

  // Mutation to update progress
  const updateProgressMutation = useMutation({
    mutationFn: async ({ moduleId, updates }: { moduleId: number, updates: any }) => {
      if (!userId) return;
      return courseService.updateProgress(userId, moduleId, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProgress", userId] });
    },
  });

  const completeLesson = useCallback((moduleId: number, lessonId: string, timeSpent: number = 30) => {
    if (!userId) return;

    // Update local state optimistically
    setProgress(prev => {
      const newLesson: LessonProgress = {
        lessonId,
        moduleId,
        completed: true,
        completedAt: new Date().toISOString(),
        timeSpent,
      };

      const newLessons = { ...prev.lessons, [lessonId]: newLesson };

      // We need to persist this entire lessons object for the module?
      // Or just merge. Database stores JSON for the module.
      // Let's get all lessons for this module to save.
      const moduleLessons = Object.values(newLessons).filter(l => l.moduleId === moduleId);
      const lessonsMap = moduleLessons.reduce((acc, l) => ({ ...acc, [l.lessonId]: l }), {});

      updateProgressMutation.mutate({
        moduleId,
        updates: {
          lesson_details: lessonsMap,
          last_accessed_at: new Date().toISOString()
        }
      });

      return {
        ...prev,
        lessons: newLessons

        // Note: module/overall progress update will happen on refetch or we can duplicate logic here.
        // For simplicity, relying on refetch for derived stats is safer but slower UI.
        // Let's just update lessons here for immediate feedback if any components use it directly.
      };
    });
  }, [userId, updateProgressMutation]);

  const passExam = useCallback((moduleId: number, score: number) => {
    if (!userId) return;

    updateProgressMutation.mutate({
      moduleId,
      updates: {
        exam_passed: true,
        exam_score: score,
        is_completed: true // Assuming passing exam completes module
      }
    });

    setProgress(prev => ({
      ...prev,
      currentModule: Math.max(prev.currentModule, moduleId + 1)
    }));
  }, [userId, updateProgressMutation]);

  const isLessonCompleted = useCallback((lessonId: string) => {
    return progress.lessons[lessonId]?.completed ?? false;
  }, [progress.lessons]);

  const isModuleUnlocked = useCallback((moduleId: number) => {
    if (moduleId === 1) return true;
    const prevModule = progress.modules[moduleId - 1];
    return prevModule?.examPassed ?? false;
  }, [progress.modules]);

  const getModuleProgress = useCallback((moduleId: number) => {
    return progress.modules[moduleId] || null;
  }, [progress.modules]);

  const resetProgress = useCallback(() => {
    // Reset API? or just local?
    // Not implementing API reset for now.
    setProgress(DEFAULT_PROGRESS);
  }, []);

  return {
    progress,
    completeLesson,
    passExam,
    isLessonCompleted,
    isModuleUnlocked,
    getModuleProgress,
    resetProgress,
    isLoading
  };
};
