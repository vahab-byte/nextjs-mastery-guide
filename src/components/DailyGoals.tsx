import { useUserStats } from "@/hooks/useUserStats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, BookOpen, Code2, Clock, CheckCircle2 } from "lucide-react";

const DailyGoals = () => {
  const { stats } = useUserStats();

  const goals = [
    {
      id: "lessons",
      title: "Complete Lessons",
      icon: <BookOpen className="h-4 w-4" />,
      current: Math.min(stats.lessonsCompleted % 3, 2), // Daily goal resets
      target: 2,
      unit: "lessons",
      color: "bg-primary"
    },
    {
      id: "coding",
      title: "Coding Practice",
      icon: <Code2 className="h-4 w-4" />,
      current: Math.min(stats.codeExercises % 5, 3),
      target: 3,
      unit: "exercises",
      color: "bg-secondary"
    },
    {
      id: "study-time",
      title: "Study Time",
      icon: <Clock className="h-4 w-4" />,
      current: Math.min(Math.floor((stats.totalHours % 2) * 60), 30),
      target: 30,
      unit: "minutes",
      color: "bg-accent"
    }
  ];

  const completedGoals = goals.filter(g => g.current >= g.target).length;
  const allComplete = completedGoals === goals.length;

  return (
    <Card className="border-primary/20 bg-card/50 backdrop-blur">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Daily Goals
          {allComplete && (
            <span className="ml-auto text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded-full flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              All Complete!
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {goals.map((goal) => {
          const progress = Math.min((goal.current / goal.target) * 100, 100);
          const isComplete = goal.current >= goal.target;

          return (
            <div key={goal.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-md ${isComplete ? 'bg-green-500/20 text-green-500' : 'bg-muted text-muted-foreground'}`}>
                    {isComplete ? <CheckCircle2 className="h-4 w-4" /> : goal.icon}
                  </div>
                  <span className="text-sm font-medium">{goal.title}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {goal.current}/{goal.target} {goal.unit}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          );
        })}

        <div className="pt-3 border-t border-border/50">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Daily Progress</span>
            <span className="font-medium text-primary">{completedGoals}/{goals.length} goals</span>
          </div>
          <Progress 
            value={(completedGoals / goals.length) * 100} 
            className="h-2 mt-2"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyGoals;
