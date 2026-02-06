import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Zap, 
  Shield, 
  Globe, 
  Rocket, 
  Users,
  Trophy,
  Code2,
  BookOpen,
  MessageSquare
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Learning",
    description: "Get personalized explanations and code reviews from our advanced AI assistant",
    badge: "AI",
    color: "from-primary to-primary/60",
  },
  {
    icon: Code2,
    title: "Interactive Code Labs",
    description: "Practice with live code editors and instant feedback on your solutions",
    badge: "Interactive",
    color: "from-secondary to-secondary/60",
  },
  {
    icon: Trophy,
    title: "Certification Program",
    description: "Earn industry-recognized certificates upon completing each module",
    badge: "Pro",
    color: "from-accent to-accent/60",
  },
  {
    icon: Users,
    title: "Community Access",
    description: "Join our exclusive Discord community with mentors and fellow learners",
    badge: "Community",
    color: "from-primary to-secondary",
  },
  {
    icon: Rocket,
    title: "Project-Based Learning",
    description: "Build real-world projects with step-by-step guidance and code reviews",
    badge: "Hands-on",
    color: "from-secondary to-accent",
  },
  {
    icon: Shield,
    title: "Lifetime Access",
    description: "One-time payment for unlimited access to all current and future content",
    badge: "Forever",
    color: "from-accent to-primary",
  },
];

const PremiumFeatures = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
            <Zap className="h-3 w-3 mr-1" />
            Premium Features
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need to{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Master Next.js
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our comprehensive platform provides all the tools and resources you need to become a professional Next.js developer
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 group"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PremiumFeatures;
