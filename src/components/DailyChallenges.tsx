import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Flame, Users, ChevronRight, Zap } from "lucide-react";

const challenges = [
  {
    title: "Build a REST API with Next.js",
    difficulty: "Intermediate",
    timeLimit: "45 min",
    participants: 1847,
    xp: 500,
    tags: ["API Routes", "CRUD"],
    status: "active",
  },
  {
    title: "Create a Real-Time Chat App",
    difficulty: "Advanced",
    timeLimit: "90 min",
    participants: 923,
    xp: 1000,
    tags: ["WebSocket", "Auth"],
    status: "active",
  },
  {
    title: "Server Components Deep Dive",
    difficulty: "Beginner",
    timeLimit: "30 min",
    participants: 3201,
    xp: 300,
    tags: ["RSC", "SSR"],
    status: "upcoming",
  },
];

const DailyChallenges = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 5, minutes: 42, seconds: 18 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) { seconds = 59; minutes--; }
        if (minutes < 0) { minutes = 59; hours--; }
        if (hours < 0) { hours = 23; minutes = 59; seconds = 59; }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <section className="py-16 md:py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-4">
          <div>
            <span className="text-primary font-semibold text-sm uppercase tracking-wider flex items-center gap-2">
              <Flame className="h-4 w-4" /> Daily Challenges
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-3">Test Your Skills Today</h2>
          </div>
          <div className="flex items-center gap-3 bg-card border border-border rounded-xl px-5 py-3">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Resets in</span>
            <div className="flex gap-1 font-mono font-bold text-lg">
              <span className="bg-primary/10 text-primary px-2 py-0.5 rounded">{pad(timeLeft.hours)}</span>
              <span className="text-muted-foreground">:</span>
              <span className="bg-primary/10 text-primary px-2 py-0.5 rounded">{pad(timeLeft.minutes)}</span>
              <span className="text-muted-foreground">:</span>
              <span className="bg-primary/10 text-primary px-2 py-0.5 rounded">{pad(timeLeft.seconds)}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {challenges.map((challenge, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="border-border/50 hover:border-primary/30 transition-all group h-full relative overflow-hidden">
                {challenge.status === "upcoming" && (
                  <div className="absolute top-3 right-3">
                    <Badge variant="outline" className="text-xs bg-muted/50">Coming Soon</Badge>
                  </div>
                )}
                <CardContent className="p-6 flex flex-col h-full">
                  <Badge
                    className={`w-fit mb-3 text-xs ${
                      challenge.difficulty === "Beginner" ? "bg-green-500/10 text-green-500 border-green-500/20" :
                      challenge.difficulty === "Intermediate" ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" :
                      "bg-red-500/10 text-red-500 border-red-500/20"
                    }`}
                    variant="outline"
                  >
                    {challenge.difficulty}
                  </Badge>
                  <h3 className="font-bold text-lg mb-2 text-foreground">{challenge.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {challenge.tags.map((tag, j) => (
                      <span key={j} className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">{tag}</span>
                    ))}
                  </div>
                  <div className="mt-auto space-y-3">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {challenge.timeLimit}</span>
                      <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {challenge.participants.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-sm font-semibold text-primary">
                        <Zap className="h-3 w-3" /> +{challenge.xp} XP
                      </span>
                      <Button size="sm" variant="ghost" className="gap-1 group-hover:text-primary transition-colors">
                        Start <ChevronRight className="h-3 w-3" />
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

export default DailyChallenges;
