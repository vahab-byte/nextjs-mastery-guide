import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import CourseCard from "@/components/CourseCard";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  GraduationCap,
  Loader2,
  BookOpen,
  Code2,
  Rocket,
  Database,
  Server,
  Cloud,
  Lock,
  Palette,
  Zap,
  Globe,
  FileCode,
  Terminal,
  Settings,
  Shield,
  Boxes,
  Layers,
  GitBranch,
  Monitor,
  Smartphone
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { courseService } from "@/services/courseService";

// Comprehensive Course Categories
const courseCategories = [
  { id: "nextjs", label: "Next.js", icon: Rocket },
  { id: "react", label: "React", icon: Code2 },
  { id: "typescript", label: "TypeScript", icon: FileCode },
  { id: "nodejs", label: "Node.js", icon: Server },
  { id: "database", label: "Databases", icon: Database },
  { id: "devops", label: "DevOps", icon: Cloud },
];

// Static Fallback Modules (when API not available)
const staticModules = {
  nextjs: [
    {
      id: "nextjs-1",
      title: "Next.js Fundamentals",
      description: "Project setup, file-based routing, pages and layouts",
      icon: BookOpen,
      lessons: 12,
      duration: "3 hours",
      difficulty: "Beginner",
      color: "from-blue-500 to-cyan-500",
      topics: ["App Router", "Pages Router", "File Structure", "next.config.js"],
    },
    {
      id: "nextjs-2",
      title: "Server Components & SSR",
      description: "React Server Components, Server-Side Rendering, Static Generation",
      icon: Server,
      lessons: 10,
      duration: "2.5 hours",
      difficulty: "Intermediate",
      color: "from-purple-500 to-pink-500",
      topics: ["RSC", "SSR", "SSG", "ISR", "Streaming"],
    },
    {
      id: "nextjs-3",
      title: "Data Fetching & Caching",
      description: "Server Actions, fetch API, revalidation strategies",
      icon: Database,
      lessons: 8,
      duration: "2 hours",
      difficulty: "Intermediate",
      color: "from-green-500 to-emerald-500",
      topics: ["Server Actions", "fetch()", "Caching", "Revalidation"],
    },
    {
      id: "nextjs-4",
      title: "API Routes & Middleware",
      description: "Route handlers, middleware, edge functions",
      icon: Zap,
      lessons: 9,
      duration: "2.5 hours",
      difficulty: "Intermediate",
      color: "from-orange-500 to-red-500",
      topics: ["Route Handlers", "Middleware", "Edge Runtime", "API Design"],
    },
    {
      id: "nextjs-5",
      title: "Authentication & Authorization",
      description: "NextAuth.js, sessions, protected routes, JWT",
      icon: Lock,
      lessons: 11,
      duration: "3 hours",
      difficulty: "Advanced",
      color: "from-red-500 to-pink-500",
      topics: ["NextAuth.js", "Sessions", "JWT", "OAuth", "Protected Routes"],
    },
    {
      id: "nextjs-6",
      title: "Styling & UI Components",
      description: "Tailwind CSS, CSS Modules, Shadcn UI, animations",
      icon: Palette,
      lessons: 8,
      duration: "2 hours",
      difficulty: "Beginner",
      color: "from-pink-500 to-purple-500",
      topics: ["Tailwind CSS", "CSS Modules", "Shadcn UI", "Framer Motion"],
    },
    {
      id: "nextjs-7",
      title: "Image & Performance Optimization",
      description: "next/image, fonts, Core Web Vitals, lazy loading",
      icon: Monitor,
      lessons: 7,
      duration: "1.5 hours",
      difficulty: "Intermediate",
      color: "from-cyan-500 to-blue-500",
      topics: ["next/image", "next/font", "Core Web Vitals", "Lazy Loading"],
    },
    {
      id: "nextjs-8",
      title: "Deployment & Production",
      description: "Vercel, Docker, CI/CD, environment variables",
      icon: Cloud,
      lessons: 6,
      duration: "1.5 hours",
      difficulty: "Advanced",
      color: "from-gray-600 to-gray-800",
      topics: ["Vercel", "Docker", "CI/CD", "Environment Variables"],
    },
  ],
  react: [
    {
      id: "react-1",
      title: "React Core Concepts",
      description: "Components, JSX, props, state, and lifecycle",
      icon: Code2,
      lessons: 15,
      duration: "4 hours",
      difficulty: "Beginner",
      color: "from-cyan-400 to-blue-500",
      topics: ["Components", "JSX", "Props", "State", "useEffect"],
    },
    {
      id: "react-2",
      title: "React Hooks Deep Dive",
      description: "useState, useEffect, useContext, custom hooks",
      icon: Zap,
      lessons: 12,
      duration: "3 hours",
      difficulty: "Intermediate",
      color: "from-blue-500 to-indigo-500",
      topics: ["useState", "useEffect", "useContext", "useReducer", "useMemo"],
    },
    {
      id: "react-3",
      title: "State Management",
      description: "Context API, Redux, Zustand, Jotai, Recoil",
      icon: Layers,
      lessons: 10,
      duration: "3 hours",
      difficulty: "Intermediate",
      color: "from-purple-500 to-violet-500",
      topics: ["Context API", "Redux Toolkit", "Zustand", "Jotai"],
    },
    {
      id: "react-4",
      title: "React Query & Data Fetching",
      description: "TanStack Query, SWR, data caching strategies",
      icon: Database,
      lessons: 8,
      duration: "2 hours",
      difficulty: "Intermediate",
      color: "from-red-500 to-orange-500",
      topics: ["TanStack Query", "SWR", "Mutations", "Optimistic Updates"],
    },
    {
      id: "react-5",
      title: "React Testing",
      description: "Jest, React Testing Library, E2E with Playwright",
      icon: Shield,
      lessons: 9,
      duration: "2.5 hours",
      difficulty: "Advanced",
      color: "from-green-500 to-teal-500",
      topics: ["Jest", "React Testing Library", "Playwright", "Mock APIs"],
    },
    {
      id: "react-6",
      title: "React Native Basics",
      description: "Mobile development with React Native & Expo",
      icon: Smartphone,
      lessons: 14,
      duration: "4 hours",
      difficulty: "Intermediate",
      color: "from-indigo-500 to-purple-500",
      topics: ["Expo", "Native Components", "Navigation", "Styling"],
    },
  ],
  typescript: [
    {
      id: "ts-1",
      title: "TypeScript Fundamentals",
      description: "Types, interfaces, enums, generics basics",
      icon: FileCode,
      lessons: 12,
      duration: "3 hours",
      difficulty: "Beginner",
      color: "from-blue-600 to-blue-400",
      topics: ["Types", "Interfaces", "Enums", "Type Aliases"],
    },
    {
      id: "ts-2",
      title: "Advanced TypeScript",
      description: "Generics, utility types, conditional types, mapped types",
      icon: Boxes,
      lessons: 10,
      duration: "3 hours",
      difficulty: "Advanced",
      color: "from-blue-700 to-cyan-500",
      topics: ["Generics", "Utility Types", "Conditional Types", "Infer"],
    },
    {
      id: "ts-3",
      title: "TypeScript with React",
      description: "Typing components, hooks, events, and forms",
      icon: Code2,
      lessons: 8,
      duration: "2 hours",
      difficulty: "Intermediate",
      color: "from-cyan-500 to-blue-500",
      topics: ["Component Props", "Hook Types", "Event Types", "Generics"],
    },
    {
      id: "ts-4",
      title: "TypeScript Best Practices",
      description: "Type safety patterns, error handling, strict mode",
      icon: Shield,
      lessons: 7,
      duration: "2 hours",
      difficulty: "Advanced",
      color: "from-indigo-500 to-blue-600",
      topics: ["Strict Mode", "Type Guards", "Discriminated Unions", "Assertions"],
    },
  ],
  nodejs: [
    {
      id: "node-1",
      title: "Node.js Fundamentals",
      description: "Modules, file system, streams, events",
      icon: Server,
      lessons: 12,
      duration: "3 hours",
      difficulty: "Beginner",
      color: "from-green-600 to-emerald-500",
      topics: ["Modules", "File System", "Streams", "Events", "Buffer"],
    },
    {
      id: "node-2",
      title: "Express.js Framework",
      description: "Routing, middleware, REST APIs, error handling",
      icon: Globe,
      lessons: 10,
      duration: "3 hours",
      difficulty: "Intermediate",
      color: "from-gray-600 to-gray-400",
      topics: ["Routing", "Middleware", "REST APIs", "Error Handling"],
    },
    {
      id: "node-3",
      title: "Authentication & Security",
      description: "JWT, OAuth, bcrypt, helmet, rate limiting",
      icon: Lock,
      lessons: 9,
      duration: "2.5 hours",
      difficulty: "Intermediate",
      color: "from-red-500 to-pink-500",
      topics: ["JWT", "OAuth 2.0", "Bcrypt", "Helmet", "CORS"],
    },
    {
      id: "node-4",
      title: "Real-time Applications",
      description: "WebSockets, Socket.io, Server-Sent Events",
      icon: Zap,
      lessons: 7,
      duration: "2 hours",
      difficulty: "Advanced",
      color: "from-yellow-500 to-orange-500",
      topics: ["WebSockets", "Socket.io", "SSE", "Real-time Chat"],
    },
    {
      id: "node-5",
      title: "GraphQL with Node.js",
      description: "Apollo Server, schemas, resolvers, subscriptions",
      icon: Boxes,
      lessons: 10,
      duration: "3 hours",
      difficulty: "Advanced",
      color: "from-pink-500 to-purple-500",
      topics: ["Apollo Server", "Schemas", "Resolvers", "Subscriptions"],
    },
  ],
  database: [
    {
      id: "db-1",
      title: "PostgreSQL Mastery",
      description: "SQL queries, indexing, relationships, transactions",
      icon: Database,
      lessons: 14,
      duration: "4 hours",
      difficulty: "Intermediate",
      color: "from-blue-600 to-indigo-600",
      topics: ["SQL", "Joins", "Indexing", "Transactions", "Views"],
    },
    {
      id: "db-2",
      title: "MongoDB & NoSQL",
      description: "Document databases, aggregation, indexing",
      icon: Database,
      lessons: 10,
      duration: "3 hours",
      difficulty: "Intermediate",
      color: "from-green-500 to-emerald-600",
      topics: ["CRUD", "Aggregation", "Indexing", "Mongoose"],
    },
    {
      id: "db-3",
      title: "Prisma ORM",
      description: "Schema design, migrations, queries, relations",
      icon: Layers,
      lessons: 8,
      duration: "2.5 hours",
      difficulty: "Intermediate",
      color: "from-purple-600 to-pink-500",
      topics: ["Schema", "Migrations", "Queries", "Relations"],
    },
    {
      id: "db-4",
      title: "Supabase & Firebase",
      description: "BaaS platforms, real-time, authentication, storage",
      icon: Cloud,
      lessons: 12,
      duration: "3 hours",
      difficulty: "Beginner",
      color: "from-emerald-500 to-green-500",
      topics: ["Supabase", "Firebase", "Real-time", "Auth", "Storage"],
    },
    {
      id: "db-5",
      title: "Redis & Caching",
      description: "In-memory data, caching strategies, pub/sub",
      icon: Zap,
      lessons: 6,
      duration: "1.5 hours",
      difficulty: "Advanced",
      color: "from-red-600 to-red-400",
      topics: ["Redis", "Caching", "Pub/Sub", "Sessions"],
    },
  ],
  devops: [
    {
      id: "devops-1",
      title: "Git & Version Control",
      description: "Branching, merging, rebasing, Git workflows",
      icon: GitBranch,
      lessons: 8,
      duration: "2 hours",
      difficulty: "Beginner",
      color: "from-orange-500 to-red-500",
      topics: ["Branching", "Merging", "Rebasing", "Git Flow"],
    },
    {
      id: "devops-2",
      title: "Docker & Containers",
      description: "Containerization, Dockerfile, Docker Compose",
      icon: Boxes,
      lessons: 10,
      duration: "3 hours",
      difficulty: "Intermediate",
      color: "from-blue-500 to-cyan-500",
      topics: ["Docker", "Dockerfile", "Compose", "Volumes", "Networks"],
    },
    {
      id: "devops-3",
      title: "CI/CD Pipelines",
      description: "GitHub Actions, automated testing, deployment",
      icon: Settings,
      lessons: 8,
      duration: "2.5 hours",
      difficulty: "Intermediate",
      color: "from-gray-600 to-gray-800",
      topics: ["GitHub Actions", "CI/CD", "Automated Testing", "Deployment"],
    },
    {
      id: "devops-4",
      title: "AWS & Cloud Services",
      description: "S3, Lambda, EC2, RDS, CloudFront",
      icon: Cloud,
      lessons: 12,
      duration: "4 hours",
      difficulty: "Advanced",
      color: "from-orange-400 to-yellow-500",
      topics: ["S3", "Lambda", "EC2", "RDS", "CloudFront"],
    },
    {
      id: "devops-5",
      title: "Monitoring & Logging",
      description: "Application monitoring, logging, error tracking",
      icon: Terminal,
      lessons: 6,
      duration: "1.5 hours",
      difficulty: "Advanced",
      color: "from-purple-500 to-indigo-500",
      topics: ["Logging", "Monitoring", "Sentry", "Analytics"],
    },
  ],
};

// Module Card Component
const ModuleCard = ({ module, onClick }: { module: typeof staticModules.nextjs[0]; onClick: () => void }) => {
  const IconComponent = module.icon;

  return (
    <Card
      className="border-border/50 bg-card/50 backdrop-blur hover:border-primary/30 transition-all duration-300 hover:scale-[1.02] group cursor-pointer h-full"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center flex-shrink-0`}>
            <IconComponent className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{module.title}</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{module.description}</p>

            {/* Topics */}
            <div className="flex flex-wrap gap-1 mb-3">
              {module.topics.slice(0, 4).map((topic, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {topic}
                </Badge>
              ))}
            </div>

            {/* Meta */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                {module.lessons} lessons
              </span>
              <span>{module.duration}</span>
              <Badge
                variant="outline"
                className={`text-xs ${module.difficulty === "Beginner" ? "border-green-500 text-green-500" :
                  module.difficulty === "Intermediate" ? "border-yellow-500 text-yellow-500" :
                    "border-red-500 text-red-500"
                  }`}
              >
                {module.difficulty}
              </Badge>
            </div>

            {/* Start Learning Button */}
            <Button size="sm" className="mt-4 w-full group-hover:bg-primary group-hover:text-primary-foreground" variant="outline">
              Start Learning
              <Rocket className="ml-2 h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Curriculum = () => {
  const [activeCategory, setActiveCategory] = useState("nextjs");
  const navigate = useNavigate();

  const { data: apiModules = [], isLoading, error } = useQuery({
    queryKey: ["modules"],
    queryFn: courseService.getModules,
  });

  // Calculate total stats
  const allModules = Object.values(staticModules).flat();
  const totalLessons = allModules.reduce((sum, m) => sum + m.lessons, 0);
  const totalHours = allModules.reduce((sum, m) => sum + parseFloat(m.duration), 0);

  // Handle module click - navigate to lesson page
  const handleModuleClick = (moduleId: string, moduleTitle: string) => {
    // Navigate to lesson page with module info
    navigate(`/lesson/${moduleId}`, {
      state: {
        moduleTitle,
        fromCurriculum: true
      }
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header Section */}
      <section className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary mb-4">
              <GraduationCap className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Complete Web Development Curriculum
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Master modern web development from fundamentals to advanced concepts.
              Choose your path and build production-ready applications.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-primary mb-1">{courseCategories.length}</div>
              <div className="text-sm text-muted-foreground">Tech Tracks</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-secondary mb-1">{allModules.length}</div>
              <div className="text-sm text-muted-foreground">Modules</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-accent mb-1">{totalLessons}+</div>
              <div className="text-sm text-muted-foreground">Lessons</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-green-500 mb-1">{Math.round(totalHours)}+</div>
              <div className="text-sm text-muted-foreground">Hours</div>
            </div>
          </div>

          {/* Category Tabs */}
          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
            <TabsList className="w-full flex flex-wrap justify-center gap-2 bg-transparent h-auto mb-8">
              {courseCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className="px-4 py-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {category.label}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {/* Category Content */}
            {courseCategories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="mt-0">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">{category.label} Curriculum</h2>
                  <p className="text-muted-foreground">
                    {staticModules[category.id as keyof typeof staticModules]?.length || 0} modules •
                    {staticModules[category.id as keyof typeof staticModules]?.reduce((sum, m) => sum + m.lessons, 0) || 0} lessons
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {staticModules[category.id as keyof typeof staticModules]?.map((module, index) => (
                    <div
                      key={module.id}
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <ModuleCard
                        module={module}
                        onClick={() => handleModuleClick(module.id, module.title)}
                      />
                    </div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          {/* API Modules Section (if available) */}
          {apiModules.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-6 text-center">Your Enrolled Courses</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {apiModules.map((module) => (
                  <CourseCard key={module.id} module={module as any} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Curriculum;
