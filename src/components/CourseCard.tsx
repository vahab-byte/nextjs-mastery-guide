import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { CheckCircle2, Lock } from "lucide-react";
import { Module } from "@/services/courseService";

interface CourseCardProps {
  module: Module & {
    completed?: boolean;
    locked?: boolean;
  };
}

const CourseCard = ({ module }: CourseCardProps) => {
  const difficultyColors = {
    Beginner: "bg-secondary/20 text-secondary border-secondary/30",
    Intermediate: "bg-accent/20 text-accent border-accent/30",
    Advanced: "bg-destructive/20 text-destructive border-destructive/30",
  };

  return (
    <Link to={module.locked ? "#" : `/lesson/${module.id}`} className="block group">
      <Card className="h-full transition-all duration-300 hover:shadow-[0_0_30px_hsl(var(--primary)/0.3)] hover:border-primary/50 hover:-translate-y-1 bg-card relative overflow-hidden">
        {module.locked && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center">
            <Lock className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-xl group-hover:text-primary transition-colors">
              {module.title}
            </CardTitle>
            {module.completed && (
              <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0" />
            )}
          </div>
          <CardDescription>{module.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className={difficultyColors[module.difficulty]}>
              {module.difficulty}
            </Badge>
            <Badge variant="outline" className="bg-muted/50">
              {module.lessons_count} {module.lessons_count === 1 ? "Lesson" : "Lessons"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};


export default CourseCard;
