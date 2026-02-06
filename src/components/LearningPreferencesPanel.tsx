import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
    Settings2,
    BookMarked,
    Clock,
    Target,
    Zap,
    BookOpen,
    Code2,
    Video,
    FileCode,
    Brain,
    Sparkles,
    Save,
    RotateCcw
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface LearningPreferences {
    preferredTopics: string[];
    dailyGoalMinutes: number;
    learningStyle: string[];
    difficultyLevel: string;
    notificationFrequency: string;
    autoPlayVideos: boolean;
    showCodeHints: boolean;
    enableAIAssistant: boolean;
}

const defaultPreferences: LearningPreferences = {
    preferredTopics: [],
    dailyGoalMinutes: 30,
    learningStyle: [],
    difficultyLevel: "intermediate",
    notificationFrequency: "daily",
    autoPlayVideos: true,
    showCodeHints: true,
    enableAIAssistant: true
};

const topics = [
    { id: "fundamentals", label: "Next.js Fundamentals", icon: BookOpen },
    { id: "routing", label: "Routing & Navigation", icon: FileCode },
    { id: "ssr", label: "Server-Side Rendering", icon: Zap },
    { id: "api", label: "API Routes", icon: Code2 },
    { id: "database", label: "Database Integration", icon: Brain },
    { id: "auth", label: "Authentication", icon: Target },
    { id: "deployment", label: "Deployment", icon: Sparkles },
    { id: "testing", label: "Testing", icon: FileCode },
];

const learningStyles = [
    { id: "video", label: "Video Tutorials", icon: Video },
    { id: "reading", label: "Reading Material", icon: BookOpen },
    { id: "practice", label: "Hands-on Practice", icon: Code2 },
    { id: "quizzes", label: "Quizzes & Tests", icon: Brain },
];

const LearningPreferencesPanel = () => {
    const { user } = useAuth();
    const [preferences, setPreferences] = useState<LearningPreferences>(defaultPreferences);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        // Load preferences from localStorage
        const saved = localStorage.getItem(`learning_prefs_${user?.id}`);
        if (saved) {
            setPreferences(JSON.parse(saved));
        }
    }, [user?.id]);

    const handleTopicToggle = (topicId: string) => {
        setPreferences(prev => ({
            ...prev,
            preferredTopics: prev.preferredTopics.includes(topicId)
                ? prev.preferredTopics.filter(t => t !== topicId)
                : [...prev.preferredTopics, topicId]
        }));
        setHasChanges(true);
    };

    const handleStyleToggle = (styleId: string) => {
        setPreferences(prev => ({
            ...prev,
            learningStyle: prev.learningStyle.includes(styleId)
                ? prev.learningStyle.filter(s => s !== styleId)
                : [...prev.learningStyle, styleId]
        }));
        setHasChanges(true);
    };

    const handleSave = () => {
        localStorage.setItem(`learning_prefs_${user?.id}`, JSON.stringify(preferences));
        setHasChanges(false);
        toast.success("Learning preferences saved!");
    };

    const handleReset = () => {
        setPreferences(defaultPreferences);
        setHasChanges(true);
        toast.info("Preferences reset to defaults");
    };

    return (
        <Card className="bg-card/50 backdrop-blur">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <Settings2 className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">Learning Preferences</CardTitle>
                            <p className="text-sm text-muted-foreground">Customize your learning experience</p>
                        </div>
                    </div>
                    {hasChanges && (
                        <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/30">
                            Unsaved changes
                        </Badge>
                    )}
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Preferred Topics */}
                <div className="space-y-3">
                    <Label className="text-sm font-medium flex items-center gap-2">
                        <BookMarked className="h-4 w-4 text-secondary" />
                        Preferred Topics
                    </Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {topics.map((topic) => {
                            const Icon = topic.icon;
                            const isSelected = preferences.preferredTopics.includes(topic.id);
                            return (
                                <button
                                    key={topic.id}
                                    onClick={() => handleTopicToggle(topic.id)}
                                    className={cn(
                                        "flex items-center gap-2 p-3 rounded-lg border transition-all text-left text-sm",
                                        isSelected
                                            ? "border-primary bg-primary/10 text-primary"
                                            : "border-border hover:border-muted-foreground/50 text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <Icon className="h-4 w-4 shrink-0" />
                                    <span className="truncate">{topic.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Learning Style */}
                <div className="space-y-3">
                    <Label className="text-sm font-medium flex items-center gap-2">
                        <Brain className="h-4 w-4 text-accent" />
                        Learning Style
                    </Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {learningStyles.map((style) => {
                            const Icon = style.icon;
                            const isSelected = preferences.learningStyle.includes(style.id);
                            return (
                                <button
                                    key={style.id}
                                    onClick={() => handleStyleToggle(style.id)}
                                    className={cn(
                                        "flex items-center gap-2 p-3 rounded-lg border transition-all text-left text-sm",
                                        isSelected
                                            ? "border-secondary bg-secondary/10 text-secondary"
                                            : "border-border hover:border-muted-foreground/50 text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <Icon className="h-4 w-4 shrink-0" />
                                    <span className="truncate">{style.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Daily Goal */}
                <div className="space-y-3">
                    <Label className="text-sm font-medium flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        Daily Learning Goal
                        <Badge variant="outline" className="ml-auto">
                            {preferences.dailyGoalMinutes} min/day
                        </Badge>
                    </Label>
                    <Slider
                        value={[preferences.dailyGoalMinutes]}
                        onValueChange={([value]) => {
                            setPreferences(prev => ({ ...prev, dailyGoalMinutes: value }));
                            setHasChanges(true);
                        }}
                        min={10}
                        max={120}
                        step={5}
                        className="py-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>10 min</span>
                        <span>1 hour</span>
                        <span>2 hours</span>
                    </div>
                </div>

                {/* Difficulty Level */}
                <div className="space-y-3">
                    <Label className="text-sm font-medium flex items-center gap-2">
                        <Target className="h-4 w-4 text-secondary" />
                        Difficulty Level
                    </Label>
                    <div className="flex gap-2">
                        {["beginner", "intermediate", "advanced"].map((level) => (
                            <button
                                key={level}
                                onClick={() => {
                                    setPreferences(prev => ({ ...prev, difficultyLevel: level }));
                                    setHasChanges(true);
                                }}
                                className={cn(
                                    "flex-1 py-2 px-4 rounded-lg border capitalize transition-all text-sm",
                                    preferences.difficultyLevel === level
                                        ? "border-primary bg-primary text-primary-foreground"
                                        : "border-border hover:border-muted-foreground/50"
                                )}
                            >
                                {level}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Toggle Settings */}
                <div className="space-y-3">
                    <Label className="text-sm font-medium">Feature Settings</Label>
                    <div className="space-y-3">
                        {[
                            { id: "autoPlayVideos", label: "Auto-play videos", desc: "Automatically play the next video" },
                            { id: "showCodeHints", label: "Show code hints", desc: "Display helpful hints in code editor" },
                            { id: "enableAIAssistant", label: "AI Assistant", desc: "Enable AI-powered help" },
                        ].map((setting) => (
                            <div
                                key={setting.id}
                                className="flex items-center justify-between p-3 rounded-lg border border-border"
                            >
                                <div>
                                    <p className="text-sm font-medium">{setting.label}</p>
                                    <p className="text-xs text-muted-foreground">{setting.desc}</p>
                                </div>
                                <Checkbox
                                    checked={preferences[setting.id as keyof LearningPreferences] as boolean}
                                    onCheckedChange={(checked) => {
                                        setPreferences(prev => ({ ...prev, [setting.id]: checked }));
                                        setHasChanges(true);
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                    <Button onClick={handleSave} className="flex-1" disabled={!hasChanges}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Preferences
                    </Button>
                    <Button variant="outline" onClick={handleReset}>
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default LearningPreferencesPanel;
