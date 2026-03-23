import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Code2, Trophy, Zap, Wifi } from "lucide-react";

const LiveStatsCounter = () => {
  const [onlineUsers, setOnlineUsers] = useState(1247);
  const [linesWritten, setLinesWritten] = useState(8934521);
  const [challengesSolved, setChallengesSolved] = useState(45892);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineUsers((prev) => prev + Math.floor(Math.random() * 5) - 2);
      setLinesWritten((prev) => prev + Math.floor(Math.random() * 100));
      setChallengesSolved((prev) => prev + Math.floor(Math.random() * 3));
      setPulse(true);
      setTimeout(() => setPulse(false), 500);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { icon: Wifi, label: "Developers Online", value: onlineUsers, color: "text-green-500", bg: "bg-green-500/10" },
    { icon: Code2, label: "Lines of Code Written", value: linesWritten, color: "text-primary", bg: "bg-primary/10" },
    { icon: Trophy, label: "Challenges Completed", value: challengesSolved, color: "text-accent", bg: "bg-accent/10" },
  ];

  return (
    <section className="py-12 px-4 border-y border-border bg-card/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5" />
      <div className="container mx-auto max-w-5xl relative z-10">
        <div className="flex items-center justify-center gap-2 mb-6">
          <motion.div
            animate={{ scale: pulse ? 1.3 : 1 }}
            className="w-2 h-2 rounded-full bg-green-500"
          />
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Live Platform Stats</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className="flex items-center gap-4 p-4 rounded-xl bg-card/60 border border-border/50 backdrop-blur"
            >
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={stat.value}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="text-2xl font-bold text-foreground"
                  >
                    {stat.value.toLocaleString()}
                  </motion.div>
                </AnimatePresence>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LiveStatsCounter;
