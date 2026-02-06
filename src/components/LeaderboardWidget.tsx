import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Crown, Medal, Trophy } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserStats } from "@/hooks/useUserStats";

import { useQuery } from "@tanstack/react-query";
import { courseService } from "@/services/courseService";

const LeaderboardWidget = () => {
  const { user } = useAuth();
  const { stats } = useUserStats();

  const { data: leaderboardData = [] } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => courseService.getLeaderboard(),
  });

  const leaderboard = leaderboardData.map((entry, index) => ({
    rank: index + 1,
    name: entry.full_name || "Anonymous",
    xp: entry.xp_points,
    avatar: entry.full_name ? entry.full_name.substring(0, 2).toUpperCase() : "AN",
    streak: entry.current_streak,
    id: entry.id
  }));

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case 2:
        return <Medal className="h-4 w-4 text-slate-400" />;
      case 3:
        return <Medal className="h-4 w-4 text-amber-600" />;
      default:
        return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/30";
      case 2:
        return "bg-gradient-to-r from-slate-400/20 to-slate-500/20 border-slate-400/30";
      case 3:
        return "bg-gradient-to-r from-amber-600/20 to-orange-600/20 border-amber-600/30";
      default:
        return "bg-muted/30 border-border/50";
    }
  };

  // Calculate user's hypothetical rank based on XP (with safe fallback)
  const userXP = stats?.xpPoints ?? stats?.xp ?? 0;
  const userStreak = stats?.currentStreak ?? stats?.streak ?? 0;
  const userRank = leaderboard.filter(l => l.xp > userXP).length + 1;

  return (
    <Card className="border-primary/20 bg-card/50 backdrop-blur">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {leaderboard.map((entry) => (
          <div
            key={entry.rank}
            className={`flex items-center gap-3 p-2 rounded-lg border transition-all ${getRankBg(entry.rank)}`}
          >
            <div className="w-8 flex justify-center">
              {getRankIcon(entry.rank)}
            </div>
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs bg-primary/20 text-primary">
                {entry.avatar}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{entry.name}</p>
              <p className="text-xs text-muted-foreground">{entry.xp.toLocaleString()} XP</p>
            </div>
            <Badge variant="outline" className="text-xs">
              🔥 {entry.streak}
            </Badge>
          </div>
        ))}

        {/* User's position */}
        {user && (
          <div className="pt-2 mt-2 border-t border-border/50">
            <div className="flex items-center gap-3 p-2 rounded-lg bg-primary/10 border border-primary/30">
              <div className="w-8 flex justify-center">
                <span className="text-sm font-bold text-primary">#{userRank}</span>
              </div>
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                  {user.email?.substring(0, 2).toUpperCase() || "ME"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">You</p>
                <p className="text-xs text-muted-foreground">{userXP.toLocaleString()} XP</p>
              </div>
              <Badge variant="outline" className="text-xs border-primary/30">
                🔥 {userStreak}
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LeaderboardWidget;
