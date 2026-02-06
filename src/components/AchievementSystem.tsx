import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
    Trophy,
    Flame,
    Star,
    Zap,
    Target,
    BookOpen,
    Code2,
    Rocket,
    Award,
    Crown,
    Medal,
    Gift,
    Sparkles,
    Lock,
    CheckCircle,
    Loader2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserStats } from '@/hooks/useUserStats';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { courseService } from '@/services/courseService';
import { toast } from 'sonner';

// Icon mapping
const iconMap: Record<string, any> = {
    BookOpen, Code2, Zap, Flame, Target, Star, Sparkles, Crown, Medal, Trophy, Award, Rocket
};

// Achievement type from API
interface Achievement {
    id: string;
    key: string;
    title: string;
    description: string;
    icon: string;
    color: string;
    xp: number;
    category: string;
    unlocked: boolean;
    progress: number;
    unlockedAt: string | null;
}

interface StreakData {
    currentStreak: number;
    longestStreak: number;
    totalDays: number;
    weekProgress: boolean[];
}

// Animated Badge Component
const AchievementBadge = ({ achievement, onHover }: { achievement: Achievement, onHover: () => void }) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const IconComponent = iconMap[achievement.icon] || Trophy;

    return (
        <div
            className={`relative group cursor-pointer transition-all duration-300 ${achievement.unlocked ? 'hover:scale-110' : 'opacity-60 grayscale'
                }`}
            onMouseEnter={() => {
                if (achievement.unlocked) {
                    setIsAnimating(true);
                    onHover();
                }
            }}
            onMouseLeave={() => setIsAnimating(false)}
        >
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${achievement.color} 
                flex items-center justify-center shadow-lg transition-all duration-300
                ${isAnimating ? 'animate-bounce shadow-xl' : ''}
                ${achievement.unlocked ? 'ring-2 ring-white/20' : ''}`}
            >
                {achievement.unlocked ? (
                    <IconComponent className="h-10 w-10 text-white" />
                ) : (
                    <Lock className="h-8 w-8 text-white/50" />
                )}
            </div>

            {/* Progress ring for locked achievements */}
            {!achievement.unlocked && achievement.progress > 0 && (
                <svg className="absolute -inset-1 w-[88px] h-[88px]" viewBox="0 0 100 100">
                    <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="4"
                    />
                    <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="url(#gradient)"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray={`${achievement.progress * 2.83} 283`}
                        transform="rotate(-90 50 50)"
                    />
                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#8b5cf6" />
                            <stop offset="100%" stopColor="#22d3ee" />
                        </linearGradient>
                    </defs>
                </svg>
            )}

            {/* XP Badge */}
            <div className={`absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full text-xs font-bold
                ${achievement.unlocked ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                +{achievement.xp} XP
            </div>

            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 
                transition-all duration-300 pointer-events-none z-10">
                <div className="bg-popover text-popover-foreground px-3 py-2 rounded-lg shadow-xl text-center min-w-[140px]">
                    <p className="font-bold text-sm">{achievement.title}</p>
                    <p className="text-xs text-muted-foreground">{achievement.description}</p>
                    {!achievement.unlocked && (
                        <p className="text-xs text-primary mt-1">{achievement.progress}% complete</p>
                    )}
                </div>
            </div>
        </div>
    );
};

// Streak Fire Animation
const StreakFire = ({ count }: { count: number }) => {
    return (
        <div className="relative flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 to-red-500 
                flex items-center justify-center animate-pulse shadow-lg shadow-orange-500/50">
                <Flame className="h-12 w-12 text-white animate-bounce" />
            </div>
            <div className="absolute -bottom-2 bg-background px-4 py-1 rounded-full border-2 border-orange-500">
                <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                    {count}
                </span>
            </div>
        </div>
    );
};

// Level Progress Bar
const LevelBar = ({ level, currentXP, nextLevelXP }: { level: number; currentXP: number; nextLevelXP: number }) => {
    const progress = (currentXP / nextLevelXP) * 100;

    return (
        <div className="relative">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary 
                        flex items-center justify-center text-white font-bold">
                        {level}
                    </div>
                    <span className="font-semibold">Level {level}</span>
                </div>
                <span className="text-sm text-muted-foreground">{currentXP} / {nextLevelXP} XP</span>
            </div>
            <div className="h-3 rounded-full bg-muted overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-1000 ease-out rounded-full"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
};

// Main Component
const AchievementSystem = () => {
    const { user } = useAuth();
    const { stats } = useUserStats(user?.id);
    const queryClient = useQueryClient();
    const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    // Fetch achievements
    const { data: achievements = [], isLoading: achievementsLoading } = useQuery({
        queryKey: ['achievements', user?.id],
        queryFn: () => user?.id ? courseService.getAchievements(user.id) : Promise.resolve([]),
        enabled: !!user?.id
    });

    // Fetch streak data
    const { data: streakData } = useQuery<StreakData>({
        queryKey: ['user-streak', user?.id],
        queryFn: () => user?.id ? courseService.getUserStreak(user.id) : Promise.resolve({
            currentStreak: 0,
            longestStreak: 0,
            totalDays: 0,
            weekProgress: [false, false, false, false, false, false, false]
        }),
        enabled: !!user?.id
    });

    // Fetch daily reward status
    const { data: rewardStatus, refetch: refetchRewardStatus } = useQuery({
        queryKey: ['daily-reward-status', user?.id],
        queryFn: () => user?.id ? courseService.getDailyRewardStatus(user.id) : Promise.resolve({ canClaim: false }),
        enabled: !!user?.id,
        retry: 1, // Don't spam retries on 500
        refetchOnWindowFocus: false
    });

    // Claim daily reward mutation
    const claimRewardMutation = useMutation({
        mutationFn: () => courseService.claimDailyReward(user!.id),
        onSuccess: (data) => {
            toast.success(`🎁 Claimed ${data.xpAwarded} XP! Day ${data.dayNumber} streak!`);
            refetchRewardStatus();
            queryClient.invalidateQueries({ queryKey: ['user-streak'] });
            queryClient.invalidateQueries({ queryKey: ['userStats'] });
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to claim reward');
        }
    });

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.1 }
        );

        if (containerRef.current) observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    const unlockedCount = achievements.filter((a: Achievement) => a.unlocked).length;

    // Calculate level from XP
    const totalXP = stats?.xpPoints || 0;
    const level = Math.floor(totalXP / 200) + 1;
    const nextLevelXP = level * 200;
    const currentLevelXP = totalXP % 200;

    const handleClaimReward = () => {
        if (!user?.id || !rewardStatus?.canClaim) return;
        claimRewardMutation.mutate();
    };

    return (
        <section ref={containerRef} className="py-16 md:py-24 px-4 bg-gradient-to-b from-background to-card/30">
            <div className="container mx-auto max-w-6xl">
                {/* Header */}
                <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                        <Trophy className="h-3 w-3 mr-1" />
                        Achievements & Progress
                    </Badge>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Your Learning Journey</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Track your progress, earn achievements, and maintain your learning streak!
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Stats Card */}
                    <div className={`lg:col-span-2 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        <Card className="border-border/50 bg-card/50 backdrop-blur">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Award className="h-5 w-5 text-primary" />
                                    Achievements ({unlockedCount}/{achievements.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {/* Level Progress */}
                                <div className="mb-8">
                                    <LevelBar
                                        level={level}
                                        currentXP={currentLevelXP}
                                        nextLevelXP={200}
                                    />
                                </div>

                                {/* Achievement Grid */}
                                {achievementsLoading ? (
                                    <div className="flex justify-center py-12">
                                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                    </div>
                                ) : achievements.length === 0 ? (
                                    <p className="text-center text-muted-foreground py-8">
                                        No achievements available. Complete lessons to unlock achievements!
                                    </p>
                                ) : (
                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 md:gap-6 justify-items-center">
                                        {achievements.map((achievement: Achievement, index: number) => (
                                            <div
                                                key={achievement.id}
                                                className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                                                style={{ transitionDelay: `${index * 50}ms` }}
                                            >
                                                <AchievementBadge
                                                    achievement={achievement}
                                                    onHover={() => setSelectedAchievement(achievement)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Quick Stats */}
                                <div className="grid grid-cols-3 gap-2 md:gap-4 mt-8 pt-6 border-t border-border/50">
                                    <div className="text-center">
                                        <p className="text-2xl md:text-3xl font-bold text-primary">{stats?.lessonsCompleted || 0}</p>
                                        <p className="text-xs md:text-sm text-muted-foreground">Lessons Done</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl md:text-3xl font-bold text-secondary">{stats?.hoursLearned || 0}h</p>
                                        <p className="text-xs md:text-sm text-muted-foreground">Hours Learned</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl md:text-3xl font-bold text-accent">{stats?.certificatesEarned || 0}</p>
                                        <p className="text-xs md:text-sm text-muted-foreground">Certificates</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Streak Card */}
                    <div className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        <Card className="border-border/50 bg-card/50 backdrop-blur h-full">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Flame className="h-5 w-5 text-orange-500" />
                                    Learning Streak
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center">
                                {/* Streak Fire */}
                                <StreakFire count={streakData?.currentStreak || 0} />

                                <p className="text-center mt-6 mb-4">
                                    <span className="text-muted-foreground">You're on a </span>
                                    <span className="font-bold text-orange-500">{streakData?.currentStreak || 0} day</span>
                                    <span className="text-muted-foreground"> streak!</span>
                                </p>

                                {/* Week Progress */}
                                <div className="flex gap-1 md:gap-2 mb-6 flex-wrap justify-center">
                                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                                        <div
                                            key={index}
                                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                                                transition-all duration-300
                                                ${streakData?.weekProgress?.[index]
                                                    ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white'
                                                    : 'bg-muted text-muted-foreground'
                                                }`}
                                        >
                                            {streakData?.weekProgress?.[index] ? <CheckCircle className="h-4 w-4" /> : day}
                                        </div>
                                    ))}
                                </div>

                                {/* Streak Stats */}
                                <div className="grid grid-cols-2 gap-4 w-full">
                                    <div className="text-center p-3 rounded-lg bg-background/50">
                                        <p className="text-xl font-bold">{streakData?.longestStreak || 0}</p>
                                        <p className="text-xs text-muted-foreground">Longest Streak</p>
                                    </div>
                                    <div className="text-center p-3 rounded-lg bg-background/50">
                                        <p className="text-xl font-bold">{streakData?.totalDays || 0}</p>
                                        <p className="text-xs text-muted-foreground">Total Days</p>
                                    </div>
                                </div>

                                {/* Claim Reward Button */}
                                <Button
                                    className="w-full mt-6 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                                    onClick={handleClaimReward}
                                    disabled={!rewardStatus?.canClaim || claimRewardMutation.isPending || !user}
                                >
                                    {claimRewardMutation.isPending ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Gift className="mr-2 h-4 w-4" />
                                    )}
                                    {!user ? 'Sign in to claim' :
                                        rewardStatus?.canClaim ? `Claim ${rewardStatus?.nextRewardXP || 25} XP` : 'Already Claimed Today'}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AchievementSystem;
