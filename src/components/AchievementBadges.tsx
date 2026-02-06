import { useUserStats } from "@/hooks/useUserStats";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Zap, BookOpen, Code2, Trophy, Star, Target, Flame } from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  color: string;
}

const AchievementBadges = () => {
  const { stats } = useUserStats();

  const achievements: Achievement[] = [
    {
      id: "first-lesson",
      title: "First Steps",
      description: "Complete your first lesson",
      icon: <BookOpen className="h-5 w-5" />,
      unlocked: stats.lessonsCompleted >= 1,
      progress: Math.min(stats.lessonsCompleted, 1),
      maxProgress: 1,
      color: "from-green-500 to-emerald-600"
    },
    {
      id: "code-warrior",
      title: "Code Warrior",
      description: "Complete 5 coding exercises",
      icon: <Code2 className="h-5 w-5" />,
      unlocked: stats.codeExercises >= 5,
      progress: Math.min(stats.codeExercises, 5),
      maxProgress: 5,
      color: "from-blue-500 to-cyan-600"
    },
    {
      id: "streak-master",
      title: "Streak Master",
      description: "Maintain a 7-day streak",
      icon: <Flame className="h-5 w-5" />,
      unlocked: stats.streak >= 7,
      progress: Math.min(stats.streak, 7),
      maxProgress: 7,
      color: "from-orange-500 to-red-600"
    },
    {
      id: "quiz-champion",
      title: "Quiz Champion",
      description: "Pass 3 module exams",
      icon: <Trophy className="h-5 w-5" />,
      unlocked: stats.examsPassed >= 3,
      progress: Math.min(stats.examsPassed, 3),
      maxProgress: 3,
      color: "from-yellow-500 to-amber-600"
    },
    {
      id: "dedicated-learner",
      title: "Dedicated Learner",
      description: "Study for 10+ hours",
      icon: <Target className="h-5 w-5" />,
      unlocked: stats.totalHours >= 10,
      progress: Math.min(stats.totalHours, 10),
      maxProgress: 10,
      color: "from-purple-500 to-violet-600"
    },
    {
      id: "star-student",
      title: "Star Student",
      description: "Earn 1000 XP",
      icon: <Star className="h-5 w-5" />,
      unlocked: stats.xp >= 1000,
      progress: Math.min(stats.xp, 1000),
      maxProgress: 1000,
      color: "from-pink-500 to-rose-600"
    },
    {
      id: "speed-demon",
      title: "Speed Demon",
      description: "Complete a lesson in under 10 minutes",
      icon: <Zap className="h-5 w-5" />,
      unlocked: stats.lessonsCompleted >= 3,
      progress: stats.lessonsCompleted >= 3 ? 1 : 0,
      maxProgress: 1,
      color: "from-indigo-500 to-blue-600"
    },
    {
      id: "completionist",
      title: "Completionist",
      description: "Complete all 12 modules",
      icon: <Award className="h-5 w-5" />,
      unlocked: stats.lessonsCompleted >= 12,
      progress: Math.min(stats.lessonsCompleted, 12),
      maxProgress: 12,
      color: "from-gradient-start to-gradient-end"
    }
  ];

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <Card className="border-primary/20 bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" />
          Achievements
          <Badge variant="outline" className="ml-auto">
            {unlockedCount}/{achievements.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`relative group p-3 rounded-lg border transition-all duration-300 ${
                achievement.unlocked
                  ? "border-primary/30 bg-primary/10 shadow-[0_0_15px_hsl(var(--primary)/0.2)]"
                  : "border-border/50 bg-muted/30 opacity-60"
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                achievement.unlocked
                  ? `bg-gradient-to-br ${achievement.color} text-white shadow-lg`
                  : "bg-muted text-muted-foreground"
              }`}>
                {achievement.icon}
              </div>
              <h4 className="font-medium text-sm truncate">{achievement.title}</h4>
              <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                {achievement.description}
              </p>
              <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    achievement.unlocked
                      ? `bg-gradient-to-r ${achievement.color}`
                      : "bg-muted-foreground/30"
                  }`}
                  style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground mt-1 block">
                {achievement.progress}/{achievement.maxProgress}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AchievementBadges;
