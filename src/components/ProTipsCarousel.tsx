import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, ChevronDown, ChevronUp, Code2, Bookmark, BookmarkCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const tips = [
  {
    title: "Parallel Data Fetching",
    category: "Performance",
    content: `Use Promise.all() to fetch data in parallel instead of sequentially. This can reduce page load time by 50% or more.`,
    code: `// ❌ Sequential (slow)
const users = await getUsers();
const posts = await getPosts();

// ✅ Parallel (fast)
const [users, posts] = await Promise.all([
  getUsers(),
  getPosts()
]);`,
  },
  {
    title: "Dynamic Imports for Heavy Components",
    category: "Optimization",
    content: `Use next/dynamic to lazy-load components that aren't needed immediately. Great for modals, charts, and editors.`,
    code: `import dynamic from 'next/dynamic';

const HeavyChart = dynamic(
  () => import('@/components/Chart'),
  { 
    loading: () => <Skeleton />,
    ssr: false 
  }
);`,
  },
  {
    title: "Type-Safe Environment Variables",
    category: "TypeScript",
    content: `Create a validated env config to catch missing variables at build time instead of runtime.`,
    code: `// lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  API_KEY: z.string().min(1),
  NODE_ENV: z.enum(['development', 'production']),
});

export const env = envSchema.parse(process.env);`,
  },
  {
    title: "Middleware for Auth Protection",
    category: "Security",
    content: `Use Next.js middleware to protect routes at the edge. It runs before the page renders, ensuring unauthorized users never see protected content.`,
    code: `// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('session');
  
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*'],
};`,
  },
];

const ProTipsCarousel = () => {
  const [expandedTip, setExpandedTip] = useState<number | null>(0);
  const [bookmarked, setBookmarked] = useState<Set<number>>(new Set());

  const toggleBookmark = (index: number) => {
    setBookmarked((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <section className="py-16 md:py-24 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider flex items-center justify-center gap-2">
            <Lightbulb className="h-4 w-4" /> Pro Tips
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-4">Next.js Best Practices</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Essential tips from senior developers to level up your Next.js skills
          </p>
        </div>

        <div className="space-y-4">
          {tips.map((tip, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Card className={`border-border/50 transition-all ${expandedTip === i ? "border-primary/30 shadow-md" : ""}`}>
                <CardContent className="p-0">
                  <button
                    onClick={() => setExpandedTip(expandedTip === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Code2 className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{tip.title}</h3>
                        <Badge variant="outline" className="mt-1 text-xs">{tip.category}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => { e.stopPropagation(); toggleBookmark(i); }}
                      >
                        {bookmarked.has(i) ? (
                          <BookmarkCheck className="h-4 w-4 text-primary" />
                        ) : (
                          <Bookmark className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                      {expandedTip === i ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </button>
                  {expandedTip === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-5 pb-5"
                    >
                      <p className="text-sm text-muted-foreground mb-4">{tip.content}</p>
                      <pre className="bg-muted/50 border border-border/50 rounded-lg p-4 text-xs font-mono overflow-x-auto text-foreground/80 leading-relaxed">
                        <code>{tip.code}</code>
                      </pre>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProTipsCarousel;
