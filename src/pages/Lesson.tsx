import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, CheckCircle2, BookOpen, Code2, Video, FileQuestion, Layers, Bot, Loader2, Play, Clock, Bookmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LiveCodeEditor from "@/components/LiveCodeEditor";
import ExamSection from "@/components/ExamSection";
import VideoPlayer from "@/components/VideoPlayer";
import AIAssistant from "@/components/AIAssistant";
import { useQuery } from "@tanstack/react-query";
import { courseService } from "@/services/courseService";

// Static module content for curriculum topics
const staticModulesData: Record<string, {
  title: string;
  description: string;
  difficulty: string;
  duration: string;
  lessons: { title: string; duration: string; type: 'video' | 'reading' | 'exercise'; completed?: boolean }[];
  content: string;
}> = {
  "nextjs-1": {
    title: "Next.js Fundamentals",
    description: "Learn the basics of Next.js including project setup, file-based routing, pages and layouts",
    difficulty: "Beginner",
    duration: "3 hours",
    lessons: [
      { title: "Introduction to Next.js", duration: "12 min", type: "video", completed: true },
      { title: "Setting Up Your First Project", duration: "15 min", type: "video" },
      { title: "Understanding the App Router", duration: "20 min", type: "video" },
      { title: "Pages and Layouts", duration: "18 min", type: "video" },
      { title: "Practice: Create Your First Route", duration: "25 min", type: "exercise" },
    ],
    content: `
# Introduction to Next.js

Next.js is a React framework that enables functionality like server-side rendering and static site generation.

## Key Concepts

1. **File-based Routing** - Create routes by adding files to the \`app\` directory
2. **Server Components** - Components that render on the server by default
3. **Layouts** - Shared UI between routes that preserve state

## Getting Started

\`\`\`bash
npx create-next-app@latest my-app
cd my-app
npm run dev
\`\`\`

## Project Structure

\`\`\`
my-app/
├── app/
│   ├── layout.tsx    # Root layout
│   ├── page.tsx      # Home page
│   └── about/
│       └── page.tsx  # About page
├── public/           # Static files
└── package.json
\`\`\`
    `
  },
  "nextjs-2": {
    title: "Server Components & SSR",
    description: "Master React Server Components, Server-Side Rendering, and Static Generation",
    difficulty: "Intermediate",
    duration: "2.5 hours",
    lessons: [
      { title: "What are Server Components?", duration: "15 min", type: "video" },
      { title: "Server vs Client Components", duration: "20 min", type: "video" },
      { title: "Server-Side Rendering (SSR)", duration: "22 min", type: "video" },
      { title: "Static Site Generation (SSG)", duration: "18 min", type: "video" },
      { title: "Incremental Static Regeneration", duration: "15 min", type: "video" },
    ],
    content: `
# React Server Components

Server Components are a new paradigm in React that allows components to render on the server.

## Benefits

- **Smaller Bundle Size** - Server code stays on the server
- **Direct Backend Access** - Query databases directly
- **Improved Performance** - Faster initial page loads

## Example

\`\`\`tsx
// This is a Server Component (default in Next.js 13+)
async function ProductList() {
  const products = await db.query('SELECT * FROM products');
  
  return (
    <ul>
      {products.map(p => <li key={p.id}>{p.name}</li>)}
    </ul>
  );
}
\`\`\`
    `
  },
  "react-1": {
    title: "React Core Concepts",
    description: "Components, JSX, props, state, and lifecycle",
    difficulty: "Beginner",
    duration: "4 hours",
    lessons: [
      { title: "What is React?", duration: "10 min", type: "video" },
      { title: "JSX Fundamentals", duration: "20 min", type: "video" },
      { title: "Components & Props", duration: "25 min", type: "video" },
      { title: "State Management Basics", duration: "30 min", type: "video" },
      { title: "Practice: Build a Counter", duration: "20 min", type: "exercise" },
    ],
    content: `
# React Core Concepts

React is a JavaScript library for building user interfaces.

## Components

Components are the building blocks of a React application.

\`\`\`jsx
function Welcome({ name }) {
  return <h1>Hello, {name}!</h1>;
}
\`\`\`

## State

State allows components to manage their own data.

\`\`\`jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
\`\`\`
    `
  }
};

// Default content for modules without specific content
const getDefaultContent = (title: string) => ({
  title,
  description: "Comprehensive lessons and hands-on exercises",
  difficulty: "Intermediate",
  duration: "2 hours",
  lessons: [
    { title: "Introduction", duration: "10 min", type: "video" as const, completed: false },
    { title: "Core Concepts", duration: "20 min", type: "video" as const, completed: false },
    { title: "Practical Examples", duration: "25 min", type: "video" as const, completed: false },
    { title: "Hands-on Exercise", duration: "30 min", type: "exercise" as const, completed: false },
    { title: "Summary & Quiz", duration: "15 min", type: "reading" as const, completed: false },
  ],
  content: `
# ${title}

Welcome to this module! This course covers essential concepts and practical skills.

## What You'll Learn

- Core fundamentals
- Best practices
- Real-world applications
- Hands-on exercises

## Prerequisites

- Basic understanding of web development
- Familiarity with JavaScript

Start with the first lesson and progress through at your own pace!
  `
});

const Lesson = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if this is a static module ID (string like "nextjs-1") or numeric
  const isStaticModule = id && isNaN(parseInt(id));
  const moduleId = isStaticModule ? 0 : parseInt(id || "1");

  // Get static module data if available
  const staticModule = id && isStaticModule
    ? (staticModulesData[id] || getDefaultContent(location.state?.moduleTitle || id))
    : null;

  // Fetch from API only for numeric IDs
  const { data: module, isLoading: isLoadingModule, error: moduleError } = useQuery({
    queryKey: ["module", moduleId],
    queryFn: () => courseService.getModule(moduleId),
    enabled: !isStaticModule, // Only fetch if numeric ID
  });

  // Fetch all modules for navigation
  const { data: allModules = [] } = useQuery({
    queryKey: ["modules"],
    queryFn: courseService.getModules,
    enabled: !isStaticModule,
  });

  // If it's a static module, show that content
  if (staticModule) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-12 max-w-7xl">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link to="/curriculum" className="text-primary hover:underline inline-flex items-center gap-2 text-sm">
              <ArrowLeft className="h-4 w-4" />
              Back to Curriculum
            </Link>
          </div>

          {/* Module Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
                {staticModule.difficulty}
              </Badge>
              <Badge variant="outline" className="bg-muted/50">
                <Clock className="h-3 w-3 mr-1" />
                {staticModule.duration}
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{staticModule.title}</h1>
            <p className="text-muted-foreground text-lg">{staticModule.description}</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="content">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Content
                  </TabsTrigger>
                  <TabsTrigger value="code">
                    <Code2 className="h-4 w-4 mr-2" />
                    Practice
                  </TabsTrigger>
                  <TabsTrigger value="ai">
                    <Bot className="h-4 w-4 mr-2" />
                    AI Help
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="mt-6">
                  <Card className="border-border/50 bg-card/50">
                    <CardContent className="p-6 prose prose-invert max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: staticModule.content.replace(/\n/g, '<br/>').replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>') }} />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="code" className="mt-6">
                  <LiveCodeEditor
                    initialCode={`// Practice code for ${staticModule.title}\n\nfunction example() {\n  console.log("Hello, Next.js!");\n}\n\nexample();`}
                    language="typescript"
                    title={`${staticModule.title} - Practice`}
                  />
                </TabsContent>

                <TabsContent value="ai" className="mt-6">
                  <AIAssistant />
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar - Lessons List */}
            <div>
              <Card className="border-border/50 bg-card/50 sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="h-5 w-5" />
                    Lessons
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-border/50">
                    {staticModule.lessons.map((lesson, index) => (
                      <div
                        key={index}
                        className={`p-4 hover:bg-muted/50 cursor-pointer transition-colors ${lesson.completed ? 'bg-green-500/10' : ''}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${lesson.completed
                            ? 'bg-green-500 text-white'
                            : 'bg-muted text-muted-foreground'
                            }`}>
                            {lesson.completed ? (
                              <CheckCircle2 className="h-4 w-4" />
                            ) : lesson.type === 'video' ? (
                              <Play className="h-4 w-4" />
                            ) : lesson.type === 'exercise' ? (
                              <Code2 className="h-4 w-4" />
                            ) : (
                              <BookOpen className="h-4 w-4" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm">{lesson.title}</p>
                            <p className="text-xs text-muted-foreground">{lesson.duration}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-8 border-t border-border/50">
            <Button variant="outline" onClick={() => navigate('/curriculum')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Curriculum
            </Button>
            <Button variant="gradient" onClick={() => navigate('/curriculum')}>
              Complete & Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoadingModule) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-48 flex justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (moduleError || !module) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 text-center">
          <h1 className="text-2xl font-bold mb-4">Module not found</h1>
          <Button asChild>
            <Link to="/curriculum">Back to Curriculum</Link>
          </Button>
        </div>
      </div>
    );
  }

  const nextModule = allModules.find((m) => m.id === moduleId + 1);
  const prevModule = allModules.find((m) => m.id === moduleId - 1);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 pt-24 pb-12 max-w-7xl">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link to="/curriculum" className="text-primary hover:underline inline-flex items-center gap-2 text-sm">
            <ArrowLeft className="h-4 w-4" />
            Back to Curriculum
          </Link>
        </div>

        {/* Module Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
              {module.difficulty}
            </Badge>
            <Badge variant="outline" className="bg-muted/50">
              Module {module.id} of {allModules.length || "-"}
            </Badge>
            <Badge variant="outline" className="bg-secondary/20 text-secondary border-secondary/30">
              <Video className="h-3 w-3 mr-1" />
              5 Videos
            </Badge>
            <Badge variant="outline" className="bg-accent/20 text-accent border-accent/30">
              <FileQuestion className="h-3 w-3 mr-1" />
              Exam Included
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {module.title}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">{module.description}</p>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="content" className="space-y-6">
          <TabsList className="grid grid-cols-3 md:grid-cols-5 w-full md:w-auto md:inline-grid gap-1 h-auto p-1">
            <TabsTrigger value="content" className="flex items-center gap-2 py-2.5 px-4">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Content</span>
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex items-center gap-2 py-2.5 px-4">
              <Video className="h-4 w-4" />
              <span className="hidden sm:inline">Videos</span>
            </TabsTrigger>
            <TabsTrigger value="code" className="flex items-center gap-2 py-2.5 px-4">
              <Code2 className="h-4 w-4" />
              <span className="hidden sm:inline">Code Lab</span>
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center gap-2 py-2.5 px-4">
              <Bot className="h-4 w-4" />
              <span className="hidden sm:inline">AI Help</span>
            </TabsTrigger>
            <TabsTrigger value="exam" className="flex items-center gap-2 py-2.5 px-4">
              <FileQuestion className="h-4 w-4" />
              <span className="hidden sm:inline">Exam</span>
            </TabsTrigger>
          </TabsList>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Overview */}
                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground/90 leading-relaxed">{module.content_overview}</p>
                  </CardContent>
                </Card>

                {/* Topics */}
                <Card>
                  <CardHeader>
                    <CardTitle>What You'll Learn</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {module.content_topics.map((topic, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                          <span className="text-foreground/90">{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Code Preview */}
                <Card className="bg-muted/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code2 className="h-5 w-5 text-primary" />
                      Code Example
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-card border border-border rounded-lg p-4 overflow-x-auto">
                      <code className="text-sm text-foreground/90 font-mono whitespace-pre-wrap">{module.content_code_example}</code>
                    </pre>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card className="border-secondary/20 bg-secondary/5">
                  <CardHeader>
                    <CardTitle className="text-lg">Module Progress</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Videos</span>
                        <span className="font-medium">2/5</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-secondary w-[40%] rounded-full" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Reading</span>
                        <span className="font-medium">Complete</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-full rounded-full" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Exam</span>
                        <span className="font-medium">Not Started</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-accent w-0 rounded-full" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-accent/20">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Layers className="h-5 w-5 text-accent" />
                      Resources
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start" size="sm">
                      📄 Download Cheat Sheet
                    </Button>
                    <Button variant="outline" className="w-full justify-start" size="sm">
                      📦 Starter Template
                    </Button>
                    <Button variant="outline" className="w-full justify-start" size="sm">
                      🔗 Official Documentation
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Videos Tab */}
          <TabsContent value="videos">
            <VideoPlayer moduleId={moduleId} moduleTitle={module.title} />
          </TabsContent>

          {/* Code Lab Tab */}
          <TabsContent value="code">
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Interactive Code Lab</h2>
                <p className="text-muted-foreground">Practice what you've learned with our live code editor</p>
              </div>
              <LiveCodeEditor
                initialCode={module.content_code_example}
                language="typescript"
                title={`${module.title} - Code Playground`}
              />
            </div>
          </TabsContent>

          {/* AI Help Tab */}
          <TabsContent value="ai">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold mb-2">AI Learning Assistant</h2>
                  <p className="text-muted-foreground">Ask questions about {module.title}</p>
                </div>
                <AIAssistant
                  context={{
                    currentModule: module.title,
                    skillLevel: module.difficulty === "Beginner" ? "beginner" : module.difficulty === "Intermediate" ? "intermediate" : "advanced"
                  }}
                />
              </div>
              <div className="space-y-6">
                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Bot className="h-5 w-5 text-primary" />
                      Suggested Questions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full justify-start text-left h-auto py-3" size="sm">
                      Explain the key concepts in {module.title}
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-left h-auto py-3" size="sm">
                      Show me a practical example of this topic
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-left h-auto py-3" size="sm">
                      What are common mistakes to avoid?
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-left h-auto py-3" size="sm">
                      How does this relate to real-world projects?
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Exam Tab */}
          <TabsContent value="exam">
            <ExamSection moduleId={moduleId} moduleTitle={module.title} />
          </TabsContent>
        </Tabs>

        {/* Navigation */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {prevModule ? (
              <Button variant="outline" onClick={() => navigate(`/lesson/${prevModule.id}`)} className="flex-1 sm:flex-none">
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Previous:</span> {prevModule.title}
              </Button>
            ) : (
              <div />
            )}
            {nextModule ? (
              <Button variant="gradient" onClick={() => navigate(`/lesson/${nextModule.id}`)} className="flex-1 sm:flex-none ml-auto">
                <span className="hidden sm:inline">Next:</span> {nextModule.title}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button variant="gradient" asChild className="flex-1 sm:flex-none ml-auto">
                <Link to="/curriculum">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Complete Course
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lesson;
