import { useEffect, lazy, Suspense } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserStats } from "@/hooks/useUserStats";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useNotes } from "@/hooks/useNotes";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Clock,
  Flame,
  Trophy,
  Target,
  Brain,
  ArrowRight,
  GraduationCap,
  Notebook,
  Zap,
  Star,
  TrendingUp,
  Loader2
} from "lucide-react";
import AIAssistant from "@/components/AIAssistant";
import NotesPanel from "@/components/NotesPanel";
import AchievementBadges from "@/components/AchievementBadges";
import DailyGoals from "@/components/DailyGoals";
import LeaderboardWidget from "@/components/LeaderboardWidget";
const RobotModel = lazy(() => import("@/components/RobotModel"));
import BookmarksPanel from "@/components/BookmarksPanel";
import StudyGoalsWidget from "@/components/StudyGoalsWidget";
import LearningPreferencesPanel from "@/components/LearningPreferencesPanel";
import { useQuery } from "@tanstack/react-query";
import { courseService } from "@/services/courseService";

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { stats } = useUserStats(user?.id);
  const { progress, isModuleUnlocked } = useUserProgress(user?.id);
  const { notes } = useNotes(user?.id);

  // Fetch modules
  const { data: courseModules = [], isLoading: modulesLoading } = useQuery({
    queryKey: ["modules"],
    queryFn: courseService.getModules,
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/signin");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-secondary animate-pulse" />
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const statCards = [
    { icon: BookOpen, label: "Lessons Completed", value: stats.lessonsCompleted, color: "from-primary to-primary/60" },
    { icon: Clock, label: "Hours Learned", value: stats.hoursLearned.toFixed(1), color: "from-secondary to-secondary/60" },
    { icon: Flame, label: "Current Streak", value: `${stats.currentStreak} days`, color: "from-accent to-accent/60" },
    { icon: Zap, label: "XP Points", value: stats.xpPoints.toLocaleString(), color: "from-primary to-secondary" },
  ];

  // Get current/next module to continue
  const currentModuleIndex = Math.max(0, progress.currentModule - 1);
  const currentModule = courseModules.length > 0 ? (courseModules[currentModuleIndex] || courseModules[0]) : null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8 pt-24">
        {/* Welcome Section */}
        <div className="mb-8 flex items-center gap-6">
          <div className="hidden md:block w-40 h-40 relative">
            <Suspense fallback={<div className="w-full h-full rounded-full bg-muted/20 animate-pulse" />}>
              <RobotModel scale={2.5} className="w-full h-full" autoRotate />
            </Suspense>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">
                Welcome back{user.email ? `, ${user.email.split("@")[0]}` : ""}!
              </h1>
              <Badge variant="secondary" className="gap-1">
                <Star className="h-3 w-3" />
                Level {Math.floor(stats.xpPoints / 1000) + 1}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              Continue your journey to Next.js mastery
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, i) => (
            <Card key={i} className="border-primary/10 hover:border-primary/30 transition-colors">
              <CardContent className="p-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                  <stat.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Continue Learning */}
            {modulesLoading ? (
              <Card className="border-primary/20">
                <CardHeader><div className="h-6 w-1/3 bg-muted animate-pulse rounded" /></CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="h-6 w-3/4 bg-muted animate-pulse rounded" />
                      <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : currentModule && (
              <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-primary" />
                        Continue Learning
                      </CardTitle>
                      <CardDescription>Pick up where you left off</CardDescription>
                    </div>
                    <Badge variant="outline" className="text-secondary border-secondary/30">
                      Module {currentModule.id} of {courseModules.length}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{currentModule.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{currentModule.description}</p>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <Progress value={((progress.modules[currentModule.id]?.lessonsCompleted || 0) / currentModule.lessons_count) * 100} className="h-2" />
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {progress.modules[currentModule.id]?.lessonsCompleted || 0}/{currentModule.lessons_count} lessons
                        </span>
                      </div>
                    </div>
                    <Link to={`/lesson/${currentModule.id}`}>
                      <Button variant="gradient" className="gap-2">
                        Continue
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Course Modules */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  Your Course Progress
                </CardTitle>
                <CardDescription>
                  {courseModules.filter((_, i) => isModuleUnlocked(i + 1)).length} of {courseModules.length} modules unlocked
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {modulesLoading ? (
                    Array(3).fill(0).map((_, i) => (
                      <div key={i} className="flex items-center gap-4 p-3 rounded-lg border bg-muted/10">
                        <div className="w-10 h-10 rounded-lg bg-muted animate-pulse" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 w-1/3 bg-muted animate-pulse rounded" />
                          <div className="h-3 w-1/4 bg-muted animate-pulse rounded" />
                        </div>
                      </div>
                    ))
                  ) : (
                    courseModules.slice(0, 5).map((module, i) => {
                      const unlocked = isModuleUnlocked(module.id);
                      const moduleProgress = progress.modules[module.id];

                      return (
                        <Link
                          key={module.id}
                          to={unlocked ? `/lesson/${module.id}` : "#"}
                          className={`block ${!unlocked && "cursor-not-allowed opacity-50"}`}
                        >
                          <div className={`flex items-center gap-4 p-3 rounded-lg border transition-colors ${unlocked ? "hover:bg-muted/50 hover:border-primary/30" : "bg-muted/20"
                            }`}>
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${moduleProgress?.examPassed
                              ? "bg-secondary text-secondary-foreground"
                              : unlocked
                                ? "bg-primary/20 text-primary"
                                : "bg-muted text-muted-foreground"
                              }`}>
                              {moduleProgress?.examPassed ? (
                                <Trophy className="h-5 w-5" />
                              ) : (
                                <span className="font-bold">{module.id}</span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{module.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {module.lessons_count} lessons • {module.difficulty}
                              </p>
                            </div>
                            {unlocked && (
                              <div className="text-right">
                                <p className="text-sm font-medium">
                                  {moduleProgress?.lessonsCompleted || 0}/{module.lessons_count}
                                </p>
                                <p className="text-xs text-muted-foreground">completed</p>
                              </div>
                            )}
                          </div>
                        </Link>
                      );
                    })
                  )}
                </div>
                <Link to="/curriculum" className="block mt-4">
                  <Button variant="outline" className="w-full">
                    View All Modules
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Notes Section */}
            <NotesPanel compact />

            {/* Achievements */}
            <AchievementBadges />

            {/* Learning Preferences */}
            <LearningPreferencesPanel />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Daily Goals */}
            <DailyGoals />

            {/* Study Goals */}
            <StudyGoalsWidget />

            {/* Bookmarks */}
            <BookmarksPanel />

            {/* Leaderboard */}
            <LeaderboardWidget />

            {/* AI Assistant */}
            <AIAssistant variant="compact" />

            {/* Weekly Goal */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Weekly Goal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Lessons this week</span>
                    <span className="font-medium">{Math.min(stats.lessonsCompleted, 5)}/5</span>
                  </div>
                  <Progress value={Math.min(stats.lessonsCompleted, 5) * 20} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {stats.lessonsCompleted >= 5
                      ? "🎉 Goal reached! Keep going!"
                      : `${5 - Math.min(stats.lessonsCompleted, 5)} more lessons to reach your goal`
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
