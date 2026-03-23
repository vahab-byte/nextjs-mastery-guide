import { motion } from "framer-motion";
import { BookOpen, Code2, Rocket, Award, Briefcase, Star } from "lucide-react";

const milestones = [
  { icon: BookOpen, title: "Foundation", desc: "Master React & TypeScript basics", week: "Week 1-2", color: "bg-blue-500" },
  { icon: Code2, title: "Core Next.js", desc: "Routing, SSR, SSG & API Routes", week: "Week 3-5", color: "bg-violet-500" },
  { icon: Rocket, title: "Advanced Patterns", desc: "Middleware, caching & optimization", week: "Week 6-8", color: "bg-orange-500" },
  { icon: Award, title: "Real Projects", desc: "Build production apps with CI/CD", week: "Week 9-11", color: "bg-green-500" },
  { icon: Briefcase, title: "Portfolio & Career", desc: "Interview prep & portfolio review", week: "Week 12", color: "bg-pink-500" },
  { icon: Star, title: "Certification", desc: "Earn your Next.js Mastery certificate", week: "Graduation", color: "bg-accent" },
];

const ProgressTimeline = () => {
  return (
    <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-background to-card/20">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Your Journey</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-4">12-Week Learning Roadmap</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            A structured path from beginner to job-ready Next.js developer
          </p>
        </div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-accent" />

          {milestones.map((milestone, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative flex items-start gap-6 mb-12 ${
                i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Dot */}
              <div className="absolute left-6 md:left-1/2 -translate-x-1/2 z-10">
                <div className={`w-12 h-12 rounded-full ${milestone.color} flex items-center justify-center shadow-lg`}>
                  <milestone.icon className="h-5 w-5 text-white" />
                </div>
              </div>

              {/* Content */}
              <div className={`ml-20 md:ml-0 md:w-[calc(50%-3rem)] ${i % 2 === 0 ? "md:pr-8 md:text-right" : "md:pl-8 md:ml-auto"}`}>
                <span className="text-xs font-bold text-primary uppercase tracking-wider">{milestone.week}</span>
                <h3 className="text-xl font-bold mt-1 text-foreground">{milestone.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{milestone.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProgressTimeline;
