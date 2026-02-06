import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    Target,
    Flame,
    Trophy,
    Clock,
    CheckCircle2,
    Circle,
    Zap,
    Star,
    TrendingUp
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface StudyGoal {
    id: string;
    title: string;
    target: number;
    current: number;
    unit: string;
    type: "daily" | "weekly" | "monthly";
    streak?: number;
}

const StudyGoalsWidget = () => {
    const { user } = useAuth();
    const [goals, setGoals] = useState<StudyGoal[]>([]);

    useEffect(() => {
        // Load or set default goals
        const saved = localStorage.getItem(`study_goals_${user?.id}`);
        if (saved) {
            setGoals(JSON.parse(saved));
        } else {
            setGoals([
                {
                    id: "1",
                    title: "Daily Study Time",
                    target: 30,
                    current: 22,
                    unit: "minutes",
                    type: "daily",
                    streak: 5
                },
                {
                    id: "2",
                    title: "Complete Lessons",
                    target: 3,
                    current: 2,
                    unit: "lessons",
                    type: "daily"
                },
                {
                    id: "3",
                    title: "Weekly Exercises",
                    target: 10,
                    current: 7,
                    unit: "exercises",
                    type: "weekly"
                },
                {
                    id: "4",
                    title: "Monthly Quizzes",
                    target: 8,
                    current: 3,
                    unit: "quizzes",
                    type: "monthly"
                }
            ]);
        }
    }, [user?.id]);

    const getProgress = (goal: StudyGoal) => {
        return Math.min((goal.current / goal.target) * 100, 100);
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case "daily": return "text-primary bg-primary/10 border-primary/30";
            case "weekly": return "text-secondary bg-secondary/10 border-secondary/30";
            case "monthly": return "text-accent bg-accent/10 border-accent/30";
            default: return "text-muted-foreground bg-muted";
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "daily": return Zap;
            case "weekly": return TrendingUp;
            case "monthly": return Trophy;
            default: return Target;
        }
    };

    const completedGoals = goals.filter(g => g.current >= g.target).length;
    const totalStreak = Math.max(...goals.map(g => g.streak || 0));

    return (
        <Card className="bg-card/50 backdrop-blur">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-secondary/10">
                            <Target className="h-5 w-5 text-secondary" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">Study Goals</CardTitle>
                            <p className="text-sm text-muted-foreground">Track your learning progress</p>
                        </div>
                    </div>
                    {totalStreak > 0 && (
                        <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
                            <Flame className="h-3 w-3 mr-1" />
                            {totalStreak} day streak
                        </Badge>
                    )}
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Summary Stats */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                        <div className="text-2xl font-bold text-primary">{completedGoals}</div>
                        <div className="text-xs text-muted-foreground">Completed</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                        <div className="text-2xl font-bold text-secondary">{goals.length - completedGoals}</div>
                        <div className="text-xs text-muted-foreground">In Progress</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                        <div className="text-2xl font-bold text-accent">{totalStreak}</div>
                        <div className="text-xs text-muted-foreground">Day Streak</div>
                    </div>
                </div>

                {/* Goals List */}
                <div className="space-y-3">
                    {goals.map((goal) => {
                        const progress = getProgress(goal);
                        const isCompleted = goal.current >= goal.target;
                        const TypeIcon = getTypeIcon(goal.type);

                        return (
                            <div
                                key={goal.id}
                                className={cn(
                                    "p-4 rounded-lg border transition-all",
                                    isCompleted ? "border-secondary/50 bg-secondary/5" : "border-border"
                                )}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        {isCompleted ? (
                                            <CheckCircle2 className="h-5 w-5 text-secondary" />
                                        ) : (
                                            <Circle className="h-5 w-5 text-muted-foreground" />
                                        )}
                                        <span className="font-medium text-sm">{goal.title}</span>
                                    </div>
                                    <Badge variant="outline" className={cn("text-xs capitalize", getTypeColor(goal.type))}>
                                        <TypeIcon className="h-3 w-3 mr-1" />
                                        {goal.type}
                                    </Badge>
                                </div>

                                <div className="space-y-2">
                                    <Progress value={progress} className="h-2" />
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>
                                            {goal.current} / {goal.target} {goal.unit}
                                        </span>
                                        <span className={cn(isCompleted && "text-secondary font-medium")}>
                                            {Math.round(progress)}%
                                        </span>
                                    </div>
                                </div>

                                {goal.streak && goal.streak > 0 && (
                                    <div className="mt-2 flex items-center gap-1 text-xs text-orange-500">
                                        <Flame className="h-3 w-3" />
                                        <span>{goal.streak} day streak</span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Motivational Message */}
                <div className="p-4 rounded-lg bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border border-primary/20">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-primary/20">
                            <Star className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm font-medium">
                                {completedGoals === goals.length
                                    ? "🎉 Amazing! All goals completed!"
                                    : completedGoals > 0
                                        ? `Great progress! ${goals.length - completedGoals} more to go!`
                                        : "Start working on your goals today!"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Keep learning to maintain your streak!
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default StudyGoalsWidget;
