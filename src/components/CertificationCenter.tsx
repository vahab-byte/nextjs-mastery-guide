import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Award,
  Trophy,
  Medal,
  Star,
  Download,
  Share2,
  ExternalLink,
  Lock,
  CheckCircle,
  Clock,
  Target,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { courseService } from "@/services/courseService";
import { toast } from "sonner";

interface CertificationCenterProps {
  className?: string;
}

// Certificate type definitions
const certificationTypes = [
  {
    id: "foundations",
    name: "Next.js Foundations",
    level: "Beginner" as const,
    icon: Award,
    color: "primary",
    requirements: 8,
    description: "Complete all beginner modules"
  },
  {
    id: "professional",
    name: "Next.js Professional",
    level: "Intermediate" as const,
    icon: Medal,
    color: "secondary",
    requirements: 12,
    description: "Complete all intermediate modules"
  },
  {
    id: "expert",
    name: "Next.js Expert",
    level: "Advanced" as const,
    icon: Trophy,
    color: "accent",
    requirements: 10,
    description: "Complete all advanced modules"
  },
  {
    id: "master",
    name: "Next.js Master Architect",
    level: "Master" as const,
    icon: Star,
    color: "primary",
    requirements: 15,
    description: "Complete the mastery track"
  },
];

interface Certificate {
  _id: string;
  type: string;
  name: string;
  level: string;
  credentialId: string;
  earnedAt: string;
  requirements: number;
  verified: boolean;
}

const CertificationCenter = ({ className }: CertificationCenterProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch user certificates
  const { data: userCertificates = [], isLoading } = useQuery({
    queryKey: ['certificates', user?.id],
    queryFn: () => user?.id ? courseService.getCertificates(user.id) : Promise.resolve([]),
    enabled: !!user?.id
  });

  // Fetch achievements for badge display
  const { data: achievements = [] } = useQuery({
    queryKey: ['achievements', user?.id],
    queryFn: () => user?.id ? courseService.getAchievements(user.id) : Promise.resolve([]),
    enabled: !!user?.id
  });

  // Build certification data with user progress
  const certifications = certificationTypes.map(cert => {
    const userCert = userCertificates.find((uc: Certificate) => uc.type === cert.id);
    const earned = !!userCert;

    // Calculate progress based on achievements or modules completed
    const unlockedAchievements = achievements.filter((a: any) => a.unlocked).length;
    const progress = earned ? 100 : Math.min(Math.floor((unlockedAchievements / cert.requirements) * 100), 99);

    return {
      ...cert,
      status: earned ? "earned" as const : progress > 0 ? "in_progress" as const : "locked" as const,
      earnedDate: userCert ? new Date(userCert.earnedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }) : undefined,
      credentialId: userCert?.credentialId,
      progress,
      completed: earned ? cert.requirements : Math.floor((progress / 100) * cert.requirements)
    };
  });

  // Check if previous cert is earned for unlock logic
  const canUnlock = (index: number) => {
    if (index === 0) return true;
    return certifications[index - 1].status === "earned";
  };

  // Achievement badges from API
  const achievementBadges = achievements.slice(0, 6).map((a: any) => ({
    name: a.title,
    description: a.description,
    icon: a.icon === 'Flame' ? '🔥' : a.icon === 'Zap' ? '⚡' : a.icon === 'Code2' ? '⚔️' :
      a.icon === 'Star' ? '💯' : a.icon === 'Sparkles' ? '🦉' : '🏆',
    earned: a.unlocked
  }));

  const getStatusStyles = (status: string, color: string) => {
    if (status === "locked") {
      return {
        border: "border-muted/30",
        iconBg: "bg-muted/30",
        badge: "bg-muted text-muted-foreground",
      };
    }
    if (status === "earned") {
      const colors: Record<string, { border: string; iconBg: string; badge: string }> = {
        primary: {
          border: "border-primary/30",
          iconBg: "bg-gradient-to-br from-primary to-primary/60",
          badge: "bg-primary text-primary-foreground",
        },
        secondary: {
          border: "border-secondary/30",
          iconBg: "bg-gradient-to-br from-secondary to-secondary/60",
          badge: "bg-secondary text-secondary-foreground",
        },
        accent: {
          border: "border-accent/30",
          iconBg: "bg-gradient-to-br from-accent to-accent/60",
          badge: "bg-accent text-accent-foreground",
        },
      };
      return colors[color] || colors.primary;
    }
    return {
      border: "border-accent/30",
      iconBg: "bg-gradient-to-br from-accent/50 to-accent/30",
      badge: "bg-accent/20 text-accent",
    };
  };

  const earnedCount = certifications.filter(c => c.status === "earned").length;

  return (
    <div className={cn("space-y-8", className)}>
      {/* Certifications Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Certifications</h2>
            <p className="text-muted-foreground">Industry-recognized credentials</p>
          </div>
          <Badge variant="outline">
            <Trophy className="h-3 w-3 mr-1 text-accent" />
            {earnedCount} Earned
          </Badge>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certifications.map((cert, index) => {
              const styles = getStatusStyles(cert.status, cert.color);
              const Icon = cert.icon;
              const isLocked = !canUnlock(index) && cert.status !== "earned";

              return (
                <Card
                  key={cert.id}
                  className={cn(
                    "relative overflow-hidden transition-all duration-300 hover:shadow-lg",
                    styles.border,
                    isLocked && "opacity-50"
                  )}
                >
                  {cert.status === "earned" && (
                    <div className="absolute top-0 right-0 w-20 h-20 -mr-6 -mt-6">
                      <div className="absolute transform rotate-45 bg-gradient-to-r from-secondary to-secondary/80 text-center text-primary-foreground text-xs py-1 right-[-35px] top-[32px] w-[170px]">
                        Verified
                      </div>
                    </div>
                  )}

                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div
                        className={cn(
                          "w-16 h-16 rounded-2xl flex items-center justify-center shrink-0",
                          styles.iconBg
                        )}
                      >
                        {isLocked ? (
                          <Lock className="h-7 w-7 text-muted-foreground" />
                        ) : (
                          <Icon className="h-7 w-7 text-primary-foreground" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold">{cert.name}</h3>
                        </div>
                        <Badge className={cn("text-xs mb-3", styles.badge)}>
                          {cert.level}
                        </Badge>

                        {cert.status === "earned" && cert.earnedDate && (
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <CheckCircle className="h-4 w-4 text-secondary" />
                              <span>Earned on {cert.earnedDate}</span>
                            </div>
                            <div className="font-mono text-xs text-muted-foreground">
                              ID: {cert.credentialId}
                            </div>
                            <div className="flex gap-2 pt-2">
                              <Button size="sm" variant="outline">
                                <Download className="h-3 w-3 mr-1" />
                                Download
                              </Button>
                              <Button size="sm" variant="outline">
                                <Share2 className="h-3 w-3 mr-1" />
                                Share
                              </Button>
                              <Button size="sm" variant="ghost">
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        )}

                        {cert.status === "in_progress" && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">
                                <Target className="h-3 w-3 inline mr-1" />
                                {cert.completed}/{cert.requirements} requirements
                              </span>
                              <span className="text-accent font-medium">{cert.progress}%</span>
                            </div>
                            <Progress value={cert.progress} className="h-2" />
                            <Button size="sm" variant="default" className="mt-2 w-full">
                              Continue Progress
                            </Button>
                          </div>
                        )}

                        {isLocked && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Lock className="h-4 w-4" />
                            <span>Complete previous certification to unlock</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Achievements */}
      <Card className="border-primary/20 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-accent" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          {achievementBadges.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              Complete lessons to unlock achievements!
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {achievementBadges.map((achievement: any, index: number) => (
                <div
                  key={index}
                  className={cn(
                    "text-center p-4 rounded-xl transition-all",
                    achievement.earned
                      ? "bg-gradient-to-b from-accent/20 to-accent/5 border border-accent/20"
                      : "bg-muted/20 border border-muted/20 opacity-50"
                  )}
                >
                  <div className="text-3xl mb-2">{achievement.icon}</div>
                  <div className="font-medium text-sm">{achievement.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {achievement.description}
                  </div>
                  {achievement.earned && (
                    <Badge className="mt-2 bg-accent/20 text-accent text-xs">
                      <CheckCircle className="h-2 w-2 mr-1" />
                      Earned
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CertificationCenter;
