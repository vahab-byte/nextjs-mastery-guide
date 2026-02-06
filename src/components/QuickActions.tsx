import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  BookOpen,
  Code2,
  MessageSquare,
  Trophy,
  Zap,
  FileText,
  Video,
  Sparkles
} from "lucide-react";

const QuickActions = () => {
  const actions = [
    {
      icon: <BookOpen className="h-5 w-5" />,
      title: "Continue Learning",
      description: "Resume your last lesson",
      href: "/curriculum",
      color: "from-primary to-primary/70",
      glow: "primary"
    },
    {
      icon: <Code2 className="h-5 w-5" />,
      title: "Practice Code",
      description: "Interactive coding exercises",
      href: "/lesson/1",
      color: "from-secondary to-secondary/70",
      glow: "secondary"
    },
    {
      icon: <Video className="h-5 w-5" />,
      title: "Watch Videos",
      description: "Video tutorials & guides",
      href: "/lesson/1",
      color: "from-accent to-accent/70",
      glow: "accent"
    },
    {
      icon: <Trophy className="h-5 w-5" />,
      title: "Take Exam",
      description: "Test your knowledge",
      href: "/lesson/1",
      color: "from-yellow-500 to-amber-500",
      glow: "yellow-500"
    },
    {
      icon: <MessageSquare className="h-5 w-5" />,
      title: "AI Assistant",
      description: "Ask questions anytime",
      href: "#ai-assistant",
      color: "from-purple-500 to-violet-500",
      glow: "purple-500"
    },
    {
      icon: <FileText className="h-5 w-5" />,
      title: "My Notes",
      description: "Review your study notes",
      href: "/dashboard",
      color: "from-emerald-500 to-green-500",
      glow: "emerald-500"
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: "Quick Quiz",
      description: "5-minute knowledge check",
      href: "/lesson/1",
      color: "from-cyan-500 to-blue-500",
      glow: "cyan-500"
    },
    {
      icon: <Sparkles className="h-5 w-5" />,
      title: "Daily Challenge",
      description: "Earn bonus XP today",
      href: "/curriculum",
      color: "from-pink-500 to-rose-500",
      glow: "pink-500"
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {actions.map((action, index) => {
        const isHash = action.href.startsWith("#");
        const CardComponent = (
          <Card className="h-full border-border/50 bg-card/50 backdrop-blur hover:border-primary/30 transition-all duration-300 group cursor-pointer hover:shadow-[0_0_20px_hsl(var(--primary)/0.15)]">
            <CardContent className="p-4 flex flex-col items-center text-center">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                {action.icon}
              </div>
              <h3 className="font-medium text-sm">{action.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{action.description}</p>
            </CardContent>
          </Card>
        );

        if (isHash) {
          return (
            <a key={index} href={action.href}>
              {CardComponent}
            </a>
          );
        }

        return (
          <Link key={index} to={action.href}>
            {CardComponent}
          </Link>
        );
      })}
    </div>
  );
};

export default QuickActions;
