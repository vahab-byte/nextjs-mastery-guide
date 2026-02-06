import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Rocket, 
  Code2, 
  Database, 
  Shield, 
  Cloud, 
  Zap,
  ArrowRight,
  CheckCircle,
  Lock,
  Play,
  Star
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface LearningPathProps {
  className?: string;
}

const LearningPath = ({ className }: LearningPathProps) => {
  const paths = [
    {
      id: "foundations",
      title: "Foundations Track",
      description: "Master the fundamentals of Next.js and React",
      icon: Rocket,
      color: "primary",
      progress: 85,
      modules: 8,
      completed: 7,
      duration: "12 hours",
      status: "in_progress" as const,
      skills: ["React Basics", "Routing", "Components", "State Management"],
    },
    {
      id: "data",
      title: "Data Engineering",
      description: "Learn data fetching, caching, and database integration",
      icon: Database,
      color: "secondary",
      progress: 45,
      modules: 10,
      completed: 4,
      duration: "18 hours",
      status: "in_progress" as const,
      skills: ["SSR/SSG", "API Routes", "Prisma", "PostgreSQL"],
    },
    {
      id: "security",
      title: "Security & Auth",
      description: "Implement enterprise-grade authentication and security",
      icon: Shield,
      color: "accent",
      progress: 20,
      modules: 6,
      completed: 1,
      duration: "10 hours",
      status: "in_progress" as const,
      skills: ["NextAuth.js", "OAuth", "JWT", "RBAC"],
    },
    {
      id: "devops",
      title: "DevOps & Deployment",
      description: "Deploy and scale applications to production",
      icon: Cloud,
      color: "primary",
      progress: 0,
      modules: 8,
      completed: 0,
      duration: "14 hours",
      status: "locked" as const,
      skills: ["Vercel", "Docker", "CI/CD", "Monitoring"],
    },
    {
      id: "advanced",
      title: "Advanced Patterns",
      description: "Master advanced patterns used by top companies",
      icon: Zap,
      color: "secondary",
      progress: 0,
      modules: 12,
      completed: 0,
      duration: "20 hours",
      status: "locked" as const,
      skills: ["Micro-frontends", "Edge Functions", "Real-time", "AI Integration"],
    },
  ];

  const getColorClasses = (color: string, status: string) => {
    if (status === "locked") {
      return {
        border: "border-muted/30",
        bg: "bg-muted/20",
        iconBg: "bg-muted/30",
        text: "text-muted-foreground",
      };
    }
    
    const colors: Record<string, { border: string; bg: string; iconBg: string; text: string }> = {
      primary: {
        border: "border-primary/30 hover:border-primary/50",
        bg: "hover:bg-primary/5",
        iconBg: "bg-gradient-to-br from-primary to-primary/60",
        text: "text-primary",
      },
      secondary: {
        border: "border-secondary/30 hover:border-secondary/50",
        bg: "hover:bg-secondary/5",
        iconBg: "bg-gradient-to-br from-secondary to-secondary/60",
        text: "text-secondary",
      },
      accent: {
        border: "border-accent/30 hover:border-accent/50",
        bg: "hover:bg-accent/5",
        iconBg: "bg-gradient-to-br from-accent to-accent/60",
        text: "text-accent",
      },
    };
    return colors[color] || colors.primary;
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Your Learning Path</h2>
          <p className="text-muted-foreground">Personalized curriculum based on your goals</p>
        </div>
        <Badge variant="outline" className="text-sm">
          <Star className="h-3 w-3 mr-1 text-accent" />
          3 Paths Active
        </Badge>
      </div>

      <div className="relative">
        {/* Connection Line */}
        <div className="absolute left-[39px] top-8 bottom-8 w-0.5 bg-gradient-to-b from-primary via-secondary to-muted hidden md:block" />

        <div className="space-y-4">
          {paths.map((path, index) => {
            const colors = getColorClasses(path.color, path.status);
            const Icon = path.icon;

            return (
              <Card
                key={path.id}
                className={cn(
                  "relative transition-all duration-300",
                  colors.border,
                  colors.bg,
                  path.status === "locked" && "opacity-60"
                )}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Icon Section */}
                    <div className="flex items-start gap-4">
                      <div
                        className={cn(
                          "w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 relative z-10",
                          colors.iconBg
                        )}
                      >
                        {path.status === "locked" ? (
                          <Lock className="h-7 w-7 text-muted-foreground" />
                        ) : (
                          <Icon className="h-7 w-7 text-primary-foreground" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0 md:hidden">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-lg">{path.title}</h3>
                          {path.status === "locked" && (
                            <Badge variant="outline" className="text-xs">Locked</Badge>
                          )}
                          {path.progress === 100 && (
                            <Badge className="bg-secondary text-secondary-foreground text-xs">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Complete
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{path.description}</p>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 space-y-4">
                      <div className="hidden md:block">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-lg">{path.title}</h3>
                          {path.status === "locked" && (
                            <Badge variant="outline" className="text-xs">Locked</Badge>
                          )}
                          {path.progress === 100 && (
                            <Badge className="bg-secondary text-secondary-foreground text-xs">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Complete
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{path.description}</p>
                      </div>

                      {/* Progress Bar */}
                      {path.status !== "locked" && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              {path.completed}/{path.modules} modules
                            </span>
                            <span className={cn("font-medium", colors.text)}>
                              {path.progress}%
                            </span>
                          </div>
                          <Progress value={path.progress} className="h-2" />
                        </div>
                      )}

                      {/* Skills & Meta */}
                      <div className="flex flex-wrap items-center gap-2">
                        {path.skills.slice(0, 4).map((skill, i) => (
                          <Badge
                            key={i}
                            variant="outline"
                            className="text-xs bg-muted/30"
                          >
                            {skill}
                          </Badge>
                        ))}
                        <span className="text-xs text-muted-foreground ml-auto">
                          {path.duration}
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex items-center">
                      {path.status === "locked" ? (
                        <Button variant="outline" disabled className="w-full md:w-auto">
                          <Lock className="h-4 w-4 mr-2" />
                          Complete Previous
                        </Button>
                      ) : (
                        <Button variant="gradient" className="w-full md:w-auto" asChild>
                          <Link to="/curriculum">
                            {path.progress > 0 ? (
                              <>
                                <Play className="h-4 w-4 mr-2" />
                                Continue
                              </>
                            ) : (
                              <>
                                Start Path
                                <ArrowRight className="h-4 w-4 ml-2" />
                              </>
                            )}
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LearningPath;
