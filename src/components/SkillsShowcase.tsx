import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Code2, 
  Database, 
  Globe, 
  Palette, 
  Server, 
  Shield, 
  Smartphone,
  Zap
} from "lucide-react";

const SkillsShowcase = () => {
  const skillCategories = [
    {
      title: "Frontend Mastery",
      icon: Palette,
      color: "primary",
      skills: [
        { name: "React 19", level: 100 },
        { name: "Next.js 15", level: 95 },
        { name: "TypeScript", level: 90 },
        { name: "Tailwind CSS", level: 95 },
      ],
    },
    {
      title: "Backend Excellence",
      icon: Server,
      color: "secondary",
      skills: [
        { name: "API Routes", level: 90 },
        { name: "Server Actions", level: 85 },
        { name: "Edge Functions", level: 80 },
        { name: "Database Integration", level: 88 },
      ],
    },
    {
      title: "Performance & SEO",
      icon: Zap,
      color: "accent",
      skills: [
        { name: "Core Web Vitals", level: 92 },
        { name: "Image Optimization", level: 95 },
        { name: "SSR/SSG", level: 88 },
        { name: "SEO Best Practices", level: 85 },
      ],
    },
    {
      title: "Security & Auth",
      icon: Shield,
      color: "primary",
      skills: [
        { name: "Authentication", level: 90 },
        { name: "Authorization", level: 85 },
        { name: "OWASP Standards", level: 80 },
        { name: "Data Protection", level: 88 },
      ],
    },
  ];

  return (
    <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-background via-card/30 to-background">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 border-primary/30">
            <Code2 className="h-3 w-3 mr-1" />
            Skill Development
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Master{" "}
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              In-Demand Skills
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our comprehensive curriculum covers every aspect of modern web development,
            from fundamentals to advanced enterprise patterns.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {skillCategories.map((category, i) => (
            <Card 
              key={i} 
              className="border-border/50 hover:border-primary/30 transition-all duration-300 bg-card/50 backdrop-blur group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardContent className="p-6 relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-12 h-12 rounded-xl bg-${category.color}/10 flex items-center justify-center`}>
                    <category.icon className={`h-6 w-6 text-${category.color}`} />
                  </div>
                  <h3 className="font-bold text-lg">{category.title}</h3>
                </div>
                
                <div className="space-y-4">
                  {category.skills.map((skill, j) => (
                    <div key={j} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{skill.name}</span>
                        <span className="text-muted-foreground">{skill.level}%</span>
                      </div>
                      <Progress 
                        value={skill.level} 
                        className="h-2 bg-muted/50"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tech icons row */}
        <div className="mt-12 flex flex-wrap justify-center gap-6 opacity-50">
          {[Globe, Database, Smartphone, Server, Shield, Zap].map((Icon, i) => (
            <div key={i} className="w-12 h-12 rounded-xl bg-card flex items-center justify-center">
              <Icon className="h-6 w-6" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsShowcase;
