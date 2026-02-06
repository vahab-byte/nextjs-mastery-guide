import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Clock,
  Target,
  Award,
  Flame,
  BookOpen,
  Code2,
  CheckCircle,
  Calendar,
  Zap,
  Trophy,
  BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AnalyticsDashboardProps {
  className?: string;
  variant?: "compact" | "full";
}

const AnalyticsDashboard = ({ className, variant = "full" }: AnalyticsDashboardProps) => {
  const stats = {
    totalLessons: 62,
    completedLessons: 34,
    hoursLearned: 47.5,
    streak: 12,
    xpPoints: 4850,
    rank: "Advanced",
    weeklyGoal: 70,
    certificatesEarned: 3,
  };

  const weeklyProgress = [
    { day: "Mon", hours: 2.5, target: 2 },
    { day: "Tue", hours: 1.8, target: 2 },
    { day: "Wed", hours: 3.2, target: 2 },
    { day: "Thu", hours: 2.0, target: 2 },
    { day: "Fri", hours: 1.5, target: 2 },
    { day: "Sat", hours: 0, target: 2 },
    { day: "Sun", hours: 0, target: 2 },
  ];

  const recentAchievements = [
    { name: "First API Route", icon: Code2, date: "Today" },
    { name: "7-Day Streak", icon: Flame, date: "Yesterday" },
    { name: "Module Master", icon: Trophy, date: "3 days ago" },
  ];

  const skillProgress = [
    { name: "React Fundamentals", progress: 95 },
    { name: "Next.js Routing", progress: 85 },
    { name: "Data Fetching", progress: 70 },
    { name: "Authentication", progress: 45 },
    { name: "Deployment", progress: 30 },
  ];

  if (variant === "compact") {
    return (
      <Card className={cn("border-primary/20 bg-card/50 backdrop-blur", className)}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <span className="font-semibold">Your Progress</span>
            </div>
            <Badge variant="secondary" className="bg-secondary/20 text-secondary">
              <Flame className="h-3 w-3 mr-1" />
              {stats.streak} day streak
            </Badge>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Course Progress</span>
                <span className="font-medium">{Math.round((stats.completedLessons / stats.totalLessons) * 100)}%</span>
              </div>
              <Progress value={(stats.completedLessons / stats.totalLessons) * 100} className="h-2" />
            </div>
            <div className="grid grid-cols-3 gap-2 pt-2">
              <div className="text-center p-2 rounded-lg bg-muted/30">
                <div className="text-lg font-bold text-primary">{stats.completedLessons}</div>
                <div className="text-[10px] text-muted-foreground">Lessons</div>
              </div>
              <div className="text-center p-2 rounded-lg bg-muted/30">
                <div className="text-lg font-bold text-secondary">{stats.hoursLearned}h</div>
                <div className="text-[10px] text-muted-foreground">Learned</div>
              </div>
              <div className="text-center p-2 rounded-lg bg-muted/30">
                <div className="text-lg font-bold text-accent">{stats.xpPoints}</div>
                <div className="text-[10px] text-muted-foreground">XP</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Main Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-primary/20 bg-card/50 backdrop-blur">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.completedLessons}/{stats.totalLessons}</div>
                <div className="text-xs text-muted-foreground">Lessons Completed</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-secondary/20 bg-card/50 backdrop-blur">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
                <Clock className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.hoursLearned}h</div>
                <div className="text-xs text-muted-foreground">Hours Learned</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-accent/20 bg-card/50 backdrop-blur">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                <Flame className="h-5 w-5 text-accent" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.streak}</div>
                <div className="text-xs text-muted-foreground">Day Streak 🔥</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-card/50 backdrop-blur">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.xpPoints}</div>
                <div className="text-xs text-muted-foreground">XP Points</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Activity */}
        <Card className="lg:col-span-2 border-primary/20 bg-card/50 backdrop-blur">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Weekly Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between h-32 gap-2">
              {weeklyProgress.map((day, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col items-center justify-end h-24">
                    <div
                      className={cn(
                        "w-full rounded-t-md transition-all",
                        day.hours > 0 
                          ? day.hours >= day.target 
                            ? "bg-gradient-to-t from-secondary to-secondary/60" 
                            : "bg-gradient-to-t from-primary to-primary/60"
                          : "bg-muted/30"
                      )}
                      style={{ height: `${Math.max((day.hours / 4) * 100, 8)}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{day.day}</span>
                  <span className="text-xs font-medium">{day.hours}h</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Weekly Goal: 14h</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-secondary">11h completed</span>
                <Progress value={stats.weeklyGoal} className="w-20 h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Achievements */}
        <Card className="border-accent/20 bg-card/50 backdrop-blur">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="h-5 w-5 text-accent" />
              Recent Achievements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentAchievements.map((achievement, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center">
                  <achievement.icon className="h-5 w-5 text-accent-foreground" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{achievement.name}</div>
                  <div className="text-xs text-muted-foreground">{achievement.date}</div>
                </div>
                <CheckCircle className="h-4 w-4 text-secondary" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Skill Progress */}
      <Card className="border-primary/20 bg-card/50 backdrop-blur">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Skill Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {skillProgress.map((skill, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{skill.name}</span>
                  <span className="text-xs text-muted-foreground">{skill.progress}%</span>
                </div>
                <Progress 
                  value={skill.progress} 
                  className={cn(
                    "h-2",
                    skill.progress >= 80 && "[&>div]:bg-secondary",
                    skill.progress < 50 && "[&>div]:bg-accent"
                  )}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
