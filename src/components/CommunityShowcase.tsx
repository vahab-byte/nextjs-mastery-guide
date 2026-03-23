import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Share2, ExternalLink, Github } from "lucide-react";

const projects = [
  {
    title: "E-Commerce Platform",
    author: "Alex Kim",
    avatar: "AK",
    description: "Full-stack e-commerce with Stripe payments and real-time inventory",
    tags: ["Next.js 15", "Prisma", "Stripe"],
    likes: 342,
    comments: 28,
    gradient: "from-violet-500 to-purple-600",
  },
  {
    title: "AI Content Studio",
    author: "Maria Santos",
    avatar: "MS",
    description: "AI-powered content creation tool with GPT-4 and image generation",
    tags: ["Next.js", "OpenAI", "Tailwind"],
    likes: 521,
    comments: 47,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    title: "Real-Time Dashboard",
    author: "James Chen",
    avatar: "JC",
    description: "Analytics dashboard with WebSocket updates and interactive charts",
    tags: ["Next.js", "Socket.io", "D3.js"],
    likes: 289,
    comments: 19,
    gradient: "from-orange-500 to-red-500",
  },
  {
    title: "Social Media App",
    author: "Priya Patel",
    avatar: "PP",
    description: "Instagram-style social platform with stories and real-time chat",
    tags: ["Next.js", "Supabase", "Framer"],
    likes: 445,
    comments: 56,
    gradient: "from-pink-500 to-rose-500",
  },
];

const CommunityShowcase = () => {
  const [likedProjects, setLikedProjects] = useState<Set<number>>(new Set());

  const toggleLike = (index: number) => {
    setLikedProjects((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <section className="py-16 md:py-24 px-4 bg-card/20">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Community</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-4">Built by Our Students</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real projects built by course graduates. Get inspired and start building yours.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="overflow-hidden border-border/50 hover:border-primary/30 transition-all group h-full">
                <div className={`h-32 bg-gradient-to-br ${project.gradient} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute bottom-3 left-4 flex gap-2">
                    {project.tags.map((tag, j) => (
                      <Badge key={j} variant="secondary" className="bg-white/20 text-white border-none text-xs backdrop-blur">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                        {project.avatar}
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground">{project.title}</h3>
                        <p className="text-xs text-muted-foreground">by {project.author}</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4">
                      <button
                        onClick={() => toggleLike(i)}
                        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-red-500 transition-colors"
                      >
                        <Heart className={`h-4 w-4 ${likedProjects.has(i) ? "fill-red-500 text-red-500" : ""}`} />
                        {project.likes + (likedProjects.has(i) ? 1 : 0)}
                      </button>
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MessageCircle className="h-4 w-4" />
                        {project.comments}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Github className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CommunityShowcase;
