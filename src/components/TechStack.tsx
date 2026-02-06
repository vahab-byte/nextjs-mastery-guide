import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { 
  Play, 
  Clock, 
  BookOpen, 
  ChevronRight, 
  ArrowLeft,
  Video,
  Code,
  FileText,
  CheckCircle2,
  Lock
} from "lucide-react";

interface TechStackProps {
  className?: string;
}

interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: "video" | "code" | "reading";
  completed: boolean;
  locked: boolean;
}

interface Subject {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  progress: number;
}

interface Technology {
  name: string;
  category: string;
  description: string;
  color: string;
  version: string;
  icon: string;
  subjects: Subject[];
}

const TechStack = ({ className }: TechStackProps) => {
  const [selectedTech, setSelectedTech] = useState<Technology | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  const technologies: Technology[] = [
    {
      name: "Next.js 15",
      category: "Framework",
      description: "The React Framework for Production",
      color: "primary",
      version: "15.0",
      icon: "N",
      subjects: [
        {
          id: "nextjs-fundamentals",
          title: "Next.js Fundamentals",
          description: "Learn the core concepts of Next.js including routing, pages, and layouts",
          progress: 45,
          lessons: [
            { id: "1", title: "Introduction to Next.js 15", duration: "12:30", type: "video", completed: true, locked: false },
            { id: "2", title: "Project Structure & Setup", duration: "18:45", type: "video", completed: true, locked: false },
            { id: "3", title: "App Router Deep Dive", duration: "25:00", type: "video", completed: false, locked: false },
            { id: "4", title: "Hands-on: Build Your First Route", duration: "30:00", type: "code", completed: false, locked: false },
            { id: "5", title: "Understanding Layouts", duration: "15:00", type: "reading", completed: false, locked: true },
          ]
        },
        {
          id: "nextjs-ssr",
          title: "Server-Side Rendering",
          description: "Master SSR, SSG, and ISR patterns in Next.js",
          progress: 20,
          lessons: [
            { id: "1", title: "SSR vs SSG vs ISR", duration: "20:00", type: "video", completed: true, locked: false },
            { id: "2", title: "Data Fetching Strategies", duration: "35:00", type: "video", completed: false, locked: false },
            { id: "3", title: "Caching & Revalidation", duration: "28:00", type: "code", completed: false, locked: false },
            { id: "4", title: "Dynamic Routes", duration: "22:00", type: "video", completed: false, locked: true },
          ]
        },
        {
          id: "nextjs-api",
          title: "API Routes & Server Actions",
          description: "Build powerful backend APIs with Next.js",
          progress: 0,
          lessons: [
            { id: "1", title: "API Routes Basics", duration: "15:00", type: "video", completed: false, locked: false },
            { id: "2", title: "Server Actions Deep Dive", duration: "40:00", type: "video", completed: false, locked: false },
            { id: "3", title: "Building RESTful APIs", duration: "45:00", type: "code", completed: false, locked: true },
          ]
        }
      ]
    },
    {
      name: "React 19",
      category: "Library",
      description: "Component-Based UI Library",
      color: "secondary",
      version: "19.0",
      icon: "R",
      subjects: [
        {
          id: "react-hooks",
          title: "React 19 Hooks",
          description: "Master all React hooks including new ones in v19",
          progress: 60,
          lessons: [
            { id: "1", title: "useState & useEffect Mastery", duration: "25:00", type: "video", completed: true, locked: false },
            { id: "2", title: "useReducer & useContext", duration: "30:00", type: "video", completed: true, locked: false },
            { id: "3", title: "New use() Hook in React 19", duration: "20:00", type: "video", completed: true, locked: false },
            { id: "4", title: "Custom Hooks Workshop", duration: "45:00", type: "code", completed: false, locked: false },
          ]
        },
        {
          id: "react-patterns",
          title: "Advanced Patterns",
          description: "Learn professional React patterns and best practices",
          progress: 30,
          lessons: [
            { id: "1", title: "Compound Components", duration: "35:00", type: "video", completed: true, locked: false },
            { id: "2", title: "Render Props Pattern", duration: "28:00", type: "video", completed: false, locked: false },
            { id: "3", title: "HOC Pattern", duration: "32:00", type: "code", completed: false, locked: false },
          ]
        },
        {
          id: "react-perf",
          title: "Performance Optimization",
          description: "Optimize React apps for maximum performance",
          progress: 0,
          lessons: [
            { id: "1", title: "React Profiler", duration: "20:00", type: "video", completed: false, locked: false },
            { id: "2", title: "Memoization Strategies", duration: "35:00", type: "video", completed: false, locked: false },
            { id: "3", title: "Code Splitting", duration: "25:00", type: "code", completed: false, locked: true },
          ]
        }
      ]
    },
    {
      name: "TypeScript",
      category: "Language",
      description: "Type-Safe JavaScript",
      color: "primary",
      version: "5.4",
      icon: "T",
      subjects: [
        {
          id: "ts-basics",
          title: "TypeScript Fundamentals",
          description: "Learn TypeScript from scratch",
          progress: 80,
          lessons: [
            { id: "1", title: "Types & Interfaces", duration: "30:00", type: "video", completed: true, locked: false },
            { id: "2", title: "Generics Explained", duration: "40:00", type: "video", completed: true, locked: false },
            { id: "3", title: "Type Guards & Narrowing", duration: "25:00", type: "video", completed: true, locked: false },
            { id: "4", title: "Practice: Type Challenges", duration: "60:00", type: "code", completed: true, locked: false },
          ]
        },
        {
          id: "ts-advanced",
          title: "Advanced TypeScript",
          description: "Master advanced TypeScript features",
          progress: 15,
          lessons: [
            { id: "1", title: "Conditional Types", duration: "35:00", type: "video", completed: true, locked: false },
            { id: "2", title: "Mapped Types", duration: "30:00", type: "video", completed: false, locked: false },
            { id: "3", title: "Template Literal Types", duration: "25:00", type: "video", completed: false, locked: false },
          ]
        }
      ]
    },
    {
      name: "Tailwind CSS",
      category: "Styling",
      description: "Utility-First CSS",
      color: "accent",
      version: "3.4",
      icon: "W",
      subjects: [
        {
          id: "tailwind-basics",
          title: "Tailwind Fundamentals",
          description: "Master utility-first CSS with Tailwind",
          progress: 70,
          lessons: [
            { id: "1", title: "Utility Classes Deep Dive", duration: "20:00", type: "video", completed: true, locked: false },
            { id: "2", title: "Responsive Design", duration: "25:00", type: "video", completed: true, locked: false },
            { id: "3", title: "Dark Mode Implementation", duration: "18:00", type: "video", completed: true, locked: false },
            { id: "4", title: "Build a Landing Page", duration: "50:00", type: "code", completed: false, locked: false },
          ]
        },
        {
          id: "tailwind-advanced",
          title: "Advanced Tailwind",
          description: "Custom configurations and plugins",
          progress: 25,
          lessons: [
            { id: "1", title: "Custom Theme Configuration", duration: "30:00", type: "video", completed: true, locked: false },
            { id: "2", title: "Creating Plugins", duration: "40:00", type: "code", completed: false, locked: false },
            { id: "3", title: "Animation & Transitions", duration: "35:00", type: "video", completed: false, locked: false },
          ]
        }
      ]
    },
    {
      name: "Prisma",
      category: "ORM",
      description: "Next-gen Database Toolkit",
      color: "secondary",
      version: "5.0",
      icon: "P",
      subjects: [
        {
          id: "prisma-basics",
          title: "Prisma Fundamentals",
          description: "Learn database management with Prisma",
          progress: 40,
          lessons: [
            { id: "1", title: "Schema Design", duration: "25:00", type: "video", completed: true, locked: false },
            { id: "2", title: "Migrations & Seeding", duration: "30:00", type: "video", completed: true, locked: false },
            { id: "3", title: "CRUD Operations", duration: "35:00", type: "code", completed: false, locked: false },
            { id: "4", title: "Relations & Joins", duration: "40:00", type: "video", completed: false, locked: false },
          ]
        },
        {
          id: "prisma-advanced",
          title: "Advanced Prisma",
          description: "Optimize and scale your database",
          progress: 0,
          lessons: [
            { id: "1", title: "Query Optimization", duration: "35:00", type: "video", completed: false, locked: false },
            { id: "2", title: "Transactions", duration: "25:00", type: "video", completed: false, locked: false },
            { id: "3", title: "Raw SQL & Edge Cases", duration: "30:00", type: "code", completed: false, locked: true },
          ]
        }
      ]
    },
    {
      name: "Vercel",
      category: "Platform",
      description: "Deploy in Seconds",
      color: "primary",
      version: "Latest",
      icon: "V",
      subjects: [
        {
          id: "vercel-deploy",
          title: "Deployment Mastery",
          description: "Deploy and manage applications on Vercel",
          progress: 55,
          lessons: [
            { id: "1", title: "Project Setup & Deployment", duration: "15:00", type: "video", completed: true, locked: false },
            { id: "2", title: "Environment Variables", duration: "12:00", type: "video", completed: true, locked: false },
            { id: "3", title: "Custom Domains", duration: "10:00", type: "video", completed: true, locked: false },
            { id: "4", title: "Preview Deployments", duration: "18:00", type: "video", completed: false, locked: false },
          ]
        },
        {
          id: "vercel-edge",
          title: "Edge Functions",
          description: "Build serverless functions at the edge",
          progress: 10,
          lessons: [
            { id: "1", title: "Edge Functions Intro", duration: "20:00", type: "video", completed: true, locked: false },
            { id: "2", title: "Middleware", duration: "25:00", type: "video", completed: false, locked: false },
            { id: "3", title: "Caching Strategies", duration: "30:00", type: "code", completed: false, locked: false },
          ]
        }
      ]
    },
  ];

  const getColorClass = (color: string) => {
    const colors: Record<string, string> = {
      primary: "from-primary to-primary/60 border-primary/30",
      secondary: "from-secondary to-secondary/60 border-secondary/30",
      accent: "from-accent to-accent/60 border-accent/30",
    };
    return colors[color] || colors.primary;
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case "video": return <Video className="h-4 w-4" />;
      case "code": return <Code className="h-4 w-4" />;
      case "reading": return <FileText className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  // Subject Detail View
  if (selectedSubject && selectedTech) {
    return (
      <div className={cn("space-y-6", className)}>
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setSelectedSubject(null)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {selectedTech.name}
          </Button>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <Badge variant="outline" className="mb-2">{selectedTech.name}</Badge>
              <h2 className="text-2xl md:text-3xl font-bold">{selectedSubject.title}</h2>
              <p className="text-muted-foreground mt-1">{selectedSubject.description}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="text-sm text-muted-foreground">
                {selectedSubject.lessons.filter(l => l.completed).length} / {selectedSubject.lessons.length} completed
              </div>
              <Progress value={selectedSubject.progress} className="w-32 h-2" />
            </div>
          </div>

          <div className="space-y-3">
            {selectedSubject.lessons.map((lesson, index) => (
              <div 
                key={lesson.id}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl border transition-all duration-200",
                  lesson.locked 
                    ? "bg-muted/30 border-border opacity-60 cursor-not-allowed" 
                    : "bg-background border-border hover:border-primary/50 hover:bg-primary/5 cursor-pointer"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  lesson.completed ? "bg-green-500/20 text-green-500" :
                  lesson.locked ? "bg-muted text-muted-foreground" :
                  "bg-primary/10 text-primary"
                )}>
                  {lesson.completed ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : lesson.locked ? (
                    <Lock className="h-4 w-4" />
                  ) : (
                    <span className="font-semibold text-sm">{index + 1}</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {getLessonIcon(lesson.type)}
                    <span className="text-xs text-muted-foreground capitalize">{lesson.type}</span>
                  </div>
                  <h4 className="font-medium truncate">{lesson.title}</h4>
                </div>

                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {lesson.duration}
                  </div>
                  {!lesson.locked && !lesson.completed && (
                    <Button size="sm" className="gap-1">
                      <Play className="h-3 w-3" />
                      Start
                    </Button>
                  )}
                  {lesson.completed && (
                    <Button size="sm" variant="outline">
                      Review
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Technology Detail View
  if (selectedTech) {
    const totalLessons = selectedTech.subjects.reduce((acc, s) => acc + s.lessons.length, 0);
    const completedLessons = selectedTech.subjects.reduce(
      (acc, s) => acc + s.lessons.filter(l => l.completed).length, 0
    );
    const overallProgress = Math.round((completedLessons / totalLessons) * 100);

    return (
      <div className={cn("space-y-6", className)}>
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setSelectedTech(null)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to All Technologies
          </Button>
        </div>

        <div className="bg-gradient-to-br from-card to-card/50 border border-border rounded-2xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className={cn(
              "w-20 h-20 rounded-2xl bg-gradient-to-br flex items-center justify-center shrink-0",
              getColorClass(selectedTech.color)
            )}>
              <span className="text-primary-foreground font-bold text-3xl">
                {selectedTech.icon}
              </span>
            </div>
            
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <Badge variant="secondary">{selectedTech.category}</Badge>
                <Badge variant="outline">v{selectedTech.version}</Badge>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">{selectedTech.name}</h2>
              <p className="text-muted-foreground">{selectedTech.description}</p>
            </div>

            <div className="bg-background/50 rounded-xl p-4 text-center min-w-[140px]">
              <div className="text-3xl font-bold text-primary mb-1">{overallProgress}%</div>
              <div className="text-xs text-muted-foreground">
                {completedLessons} / {totalLessons} lessons
              </div>
              <Progress value={overallProgress} className="mt-2 h-2" />
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {selectedTech.subjects.map((subject) => (
            <Card 
              key={subject.id}
              className="group cursor-pointer transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
              onClick={() => setSelectedSubject(subject)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {subject.lessons.length} lessons
                  </Badge>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <CardTitle className="text-lg">{subject.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {subject.description}
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{subject.progress}%</span>
                  </div>
                  <Progress value={subject.progress} className="h-2" />
                </div>
                <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Video className="h-3 w-3" />
                    {subject.lessons.filter(l => l.type === "video").length}
                  </div>
                  <div className="flex items-center gap-1">
                    <Code className="h-3 w-3" />
                    {subject.lessons.filter(l => l.type === "code").length}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {subject.lessons.reduce((acc, l) => {
                      const [min] = l.duration.split(":");
                      return acc + parseInt(min);
                    }, 0)} min
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Main Grid View
  return (
    <div className={cn("space-y-6", className)}>
      <div className="text-center">
        <Badge variant="outline" className="mb-4">Technologies You'll Master</Badge>
        <h2 className="text-3xl md:text-4xl font-bold mb-3">
          Industry-Standard Tech Stack
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Click on any technology to explore subjects and lessons
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {technologies.map((tech, index) => {
          const totalLessons = tech.subjects.reduce((acc, s) => acc + s.lessons.length, 0);
          const completedLessons = tech.subjects.reduce(
            (acc, s) => acc + s.lessons.filter(l => l.completed).length, 0
          );
          
          return (
            <Card
              key={index}
              onClick={() => setSelectedTech(tech)}
              className={cn(
                "group relative overflow-hidden border transition-all duration-300 hover:scale-105 cursor-pointer",
                getColorClass(tech.color)
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-br opacity-10 group-hover:opacity-20 transition-opacity" />
              <CardContent className="p-4 text-center relative">
                <div className={cn(
                  "w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br flex items-center justify-center",
                  getColorClass(tech.color)
                )}>
                  <span className="text-primary-foreground font-bold text-lg">
                    {tech.icon}
                  </span>
                </div>
                <h3 className="font-bold text-sm mb-1">{tech.name}</h3>
                <p className="text-xs text-muted-foreground mb-2">{tech.description}</p>
                <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-2">
                  <BookOpen className="h-3 w-3" />
                  {totalLessons} lessons
                </div>
                <Progress 
                  value={(completedLessons / totalLessons) * 100} 
                  className="h-1.5 mb-2" 
                />
                <Badge variant="outline" className="text-[10px]">
                  v{tech.version}
                </Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default TechStack;
