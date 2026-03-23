import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Copy, Check, Terminal, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

const codeExamples = [
  {
    title: "Server Components",
    language: "tsx",
    code: `// app/dashboard/page.tsx
async function DashboardPage() {
  const data = await fetch('https://api.example.com/stats');
  const stats = await data.json();

  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map((stat) => (
        <StatCard key={stat.id} {...stat} />
      ))}
    </div>
  );
}`,
    output: "✅ Server-rendered dashboard with 3 stat cards\n📊 Data fetched at build time — zero client JS\n⚡ Time to Interactive: 0.8s",
  },
  {
    title: "API Routes",
    language: "ts",
    code: `// app/api/users/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') ?? '1';

  const users = await db.user.findMany({
    take: 10,
    skip: (Number(page) - 1) * 10,
  });

  return NextResponse.json({ users, page });
}`,
    output: "✅ API endpoint created at /api/users\n📄 Paginated response with 10 users per page\n🔒 Type-safe with full TypeScript support",
  },
  {
    title: "Server Actions",
    language: "tsx",
    code: `// app/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  await db.post.create({
    data: { title, content },
  });

  revalidatePath('/posts');
}`,
    output: "✅ Server Action created successfully\n🔄 Path /posts revalidated after mutation\n🛡️ Runs exclusively on the server — secure by default",
  },
];

const InteractiveCodePlayground = () => {
  const [activeExample, setActiveExample] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleRun = () => {
    setIsRunning(true);
    setShowOutput(false);
    setTimeout(() => {
      setIsRunning(false);
      setShowOutput(true);
    }, 1500);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(codeExamples[activeExample].code);
    setCopied(true);
    toast.success("Code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-16 md:py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Try It Yourself</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-4">Interactive Code Playground</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore real Next.js patterns. Click "Run" to see the output in real-time.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {codeExamples.map((example, i) => (
            <Button
              key={i}
              variant={activeExample === i ? "default" : "outline"}
              onClick={() => { setActiveExample(i); setShowOutput(false); }}
              className="text-sm"
            >
              <Sparkles className="mr-2 h-3 w-3" />
              {example.title}
            </Button>
          ))}
        </div>

        <Card className="border-border/50 bg-card/80 backdrop-blur overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-muted/50 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <span className="text-xs text-muted-foreground ml-2">{codeExamples[activeExample].title}.tsx</span>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={handleCopy}>
                {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
              </Button>
              <Button size="sm" onClick={handleRun} disabled={isRunning} className="gap-1.5">
                {isRunning ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }} className="h-3 w-3 border-2 border-primary-foreground border-t-transparent rounded-full" />
                ) : (
                  <Play className="h-3 w-3" />
                )}
                {isRunning ? "Running..." : "Run"}
              </Button>
            </div>
          </div>
          <CardContent className="p-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border">
              <motion.pre
                key={activeExample}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 text-sm font-mono overflow-x-auto text-foreground/90 leading-relaxed"
              >
                <code>{codeExamples[activeExample].code}</code>
              </motion.pre>
              <div className="p-6 bg-muted/20 min-h-[200px]">
                <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                  <Terminal className="h-4 w-4" />
                  <span>Output</span>
                </div>
                {showOutput ? (
                  <motion.pre
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm font-mono text-green-500 dark:text-green-400 whitespace-pre-wrap leading-relaxed"
                  >
                    {codeExamples[activeExample].output}
                  </motion.pre>
                ) : (
                  <div className="text-sm text-muted-foreground/50 italic">
                    {isRunning ? "Compiling..." : "Click 'Run' to execute the code"}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default InteractiveCodePlayground;
