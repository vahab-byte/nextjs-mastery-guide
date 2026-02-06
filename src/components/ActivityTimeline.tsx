import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity, CheckCircle, User, Star, Code2 } from "lucide-react";

interface ActivityItem {
    action: string;
    description: string;
    timestamp: string;
    _id?: string;
}

interface ActivityTimelineProps {
    activities?: ActivityItem[];
}

const ActivityTimeline = ({ activities = [] }: ActivityTimelineProps) => {
    const getIcon = (action: string) => {
        if (action.includes("Lesson")) return <CheckCircle className="h-4 w-4 text-green-500" />;
        if (action.includes("Profile")) return <User className="h-4 w-4 text-blue-500" />;
        if (action.includes("XP")) return <Star className="h-4 w-4 text-yellow-500" />;
        if (action.includes("Code")) return <Code2 className="h-4 w-4 text-purple-500" />;
        return <Activity className="h-4 w-4 text-gray-500" />;
    };

    return (
        <Card className="col-span-1 md:col-span-2 lg:col-span-1 h-[400px] flex flex-col">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Recent Activity
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0">
                <ScrollArea className="h-[320px] px-6 pb-4">
                    <div className="space-y-6">
                        {activities.length === 0 ? (
                            <p className="text-center text-muted-foreground text-sm mt-10">No recent activity recorded.</p>
                        ) : (
                            activities.slice().reverse().map((item, index) => (
                                <div key={index} className="relative pl-6 border-l border-border last:border-0 pb-1">
                                    <div className="absolute left-[-5px] top-1 bg-background">
                                        {getIcon(item.action)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium leading-none">{item.action}</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {item.description}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground mt-1">
                                            {new Date(item.timestamp).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
};

export default ActivityTimeline;
