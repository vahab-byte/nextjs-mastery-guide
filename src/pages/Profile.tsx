import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
    User,
    Mail,
    MapPin,
    Calendar,
    Github,
    Linkedin,
    Globe,
    Edit3,
    Camera,
    Save,
    Award,
    BookOpen,
    Code2,
    Trophy,
    Flame,
    Clock,
    Star,
    Target,
    TrendingUp,
    Settings,
    Bell,
    Shield,
    LogOut,
    CheckCircle2
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const Profile = () => {
    const { user, signOut, updateProfile } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [profile, setProfile] = useState({
        displayName: "",
        bio: "",
        location: "",
        website: "",
        github: "https://github.com/vahab-byte",
        linkedin: "https://linkedin.com/in/abdul-vahab-shaikh-8517a9332",
        avatar: "",
    });

    useEffect(() => {
        if (!user) {
            navigate("/signin");
        } else {
            const md = user.user_metadata || {};
            setProfile(prev => ({
                ...prev,
                displayName: md.display_name || user.email?.split("@")[0] || "Developer",
                avatar: md.avatar_url || "",
                bio: md.bio || "",
                location: md.location || "",
                website: md.website || "",
                github: md.github || prev.github,
                linkedin: md.linkedin || prev.linkedin,
            }));
        }
    }, [user, navigate]);

    // ... stats, achievements ... (keep existing)
    const stats = {
        lessonsCompleted: 24,
        hoursLearned: 48.5,
        streak: 12,
        xp: 4560,
        rank: 156,
        certificates: 3,
    };

    const achievements = [
        { id: "1", title: "First Lesson", icon: "🎯", earned: true },
        { id: "2", title: "Week Streak", icon: "🔥", earned: true },
        { id: "3", title: "Code Master", icon: "💻", earned: true },
        { id: "4", title: "Quiz Pro", icon: "🧠", earned: false },
        { id: "5", title: "Early Bird", icon: "🌅", earned: true },
        { id: "6", title: "Certified", icon: "📜", earned: false },
    ];

    const recentActivity = [
        { action: "Completed Lesson", item: "Server Components Deep Dive", time: "2 hours ago" },
        { action: "Earned Badge", item: "Code Master", time: "1 day ago" },
        { action: "Started Course", item: "API Routes Module", time: "2 days ago" },
        { action: "Completed Quiz", item: "React Fundamentals", time: "3 days ago" },
        { action: "Earned Certificate", item: "Next.js Basics", time: "1 week ago" },
    ];

    const skills = [
        { name: "Next.js", level: 75 },
        { name: "React", level: 85 },
        { name: "TypeScript", level: 65 },
        { name: "Tailwind CSS", level: 80 },
        { name: "Node.js", level: 55 },
    ];

    const handleSave = async () => {
        setUploading(true);
        const { error } = await updateProfile({
            displayName: profile.displayName,
            avatarUrl: profile.avatar,
            bio: profile.bio,
            location: profile.location,
            website: profile.website,
            github: profile.github,
            linkedin: profile.linkedin
        });

        setUploading(false);

        if (error) {
            toast.error("Failed to update profile");
        } else {
            setIsEditing(false);
            toast.success("Profile updated successfully!");
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Simple size validation (2MB)
        if (file.size > 2 * 1024 * 1024) {
            toast.error("Image too large. Please select an image under 2MB.");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            setProfile(prev => ({ ...prev, avatar: result }));
            // Auto-save or wait? Let's just set state, user clicks Save. 
            // Better yet, update auth immediately if not in full edit mode?
            // For now, consistent with "Save" button flow.
            if (!isEditing) {
                // If not editing text, we can just save the image immediately
                updateProfile({ avatarUrl: result })
                    .then(({ error }) => {
                        if (error) toast.error("Failed to update picture");
                        else toast.success("Profile picture updated!");
                    });
            }
        };
        reader.readAsDataURL(file);
    };

    const handleSignOut = async () => {
        await signOut();
        navigate("/");
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="container mx-auto px-4 py-8 pt-24">
                {/* Profile Header */}
                <Card className="mb-8 overflow-hidden">
                    {/* Cover Image */}
                    <div className="h-32 md:h-48 bg-gradient-to-r from-primary via-secondary to-accent relative">
                        {/* Hidden Input for Image Upload */}
                        <input
                            type="file"
                            id="avatar-upload"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                    </div>

                    <CardContent className="pt-0 pb-6">
                        <div className="flex flex-col md:flex-row gap-6 -mt-12 md:-mt-16">
                            {/* Avatar */}
                            <div className="relative group">
                                <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background">
                                    <AvatarImage src={profile.avatar} className="object-cover" />
                                    <AvatarFallback className="text-2xl md:text-4xl bg-gradient-to-br from-primary to-secondary text-white">
                                        {profile.displayName.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <Label
                                    htmlFor="avatar-upload"
                                    className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary text-white hover:bg-primary/90 flex items-center justify-center cursor-pointer shadow-lg transition-transform hover:scale-110"
                                >
                                    <Camera className="h-4 w-4" />
                                </Label>
                            </div>

                            {/* Info */}
                            <div className="flex-1 pt-2 md:pt-8">
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h1 className="text-2xl md:text-3xl font-bold">{profile.displayName}</h1>
                                            <Badge className="bg-primary/10 text-primary border-primary/30">
                                                <Star className="h-3 w-3 mr-1" />
                                                Level {Math.floor(stats.xp / 1000) + 1}
                                            </Badge>
                                        </div>
                                        <p className="text-muted-foreground">{user.email}</p>
                                        {profile.bio && (
                                            <p className="mt-2 text-sm">{profile.bio}</p>
                                        )}
                                        <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                                            {profile.location && (
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="h-4 w-4" />
                                                    {profile.location}
                                                </span>
                                            )}
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-4 w-4" />
                                                Joined Jan 2026
                                            </span>
                                        </div>
                                    </div>
                                    <Button onClick={() => setIsEditing(!isEditing)}>
                                        {isEditing ? (
                                            <>
                                                <Save className="h-4 w-4 mr-2" />
                                                Save
                                            </>
                                        ) : (
                                            <>
                                                <Edit3 className="h-4 w-4 mr-2" />
                                                Edit Profile
                                            </>
                                        )}
                                    </Button>
                                </div>

                                {/* Social Links */}
                                <div className="flex gap-3 mt-4">
                                    {profile.github && (
                                        <a href={profile.github} target="_blank" rel="noopener noreferrer">
                                            <Button variant="outline" size="icon" className="h-9 w-9">
                                                <Github className="h-4 w-4" />
                                            </Button>
                                        </a>
                                    )}
                                    {profile.linkedin && (
                                        <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                                            <Button variant="outline" size="icon" className="h-9 w-9">
                                                <Linkedin className="h-4 w-4" />
                                            </Button>
                                        </a>
                                    )}
                                    {profile.website && (
                                        <a href={profile.website} target="_blank" rel="noopener noreferrer">
                                            <Button variant="outline" size="icon" className="h-9 w-9">
                                                <Globe className="h-4 w-4" />
                                            </Button>
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
                    {[
                        { icon: BookOpen, label: "Lessons", value: stats.lessonsCompleted, color: "text-primary" },
                        { icon: Clock, label: "Hours", value: stats.hoursLearned.toFixed(1), color: "text-secondary" },
                        { icon: Flame, label: "Streak", value: `${stats.streak} days`, color: "text-orange-500" },
                        { icon: Star, label: "XP", value: stats.xp.toLocaleString(), color: "text-yellow-500" },
                        { icon: Trophy, label: "Rank", value: `#${stats.rank}`, color: "text-accent" },
                        { icon: Award, label: "Certs", value: stats.certificates, color: "text-green-500" },
                    ].map((stat, i) => (
                        <Card key={i}>
                            <CardContent className="p-4 text-center">
                                <stat.icon className={cn("h-5 w-5 mx-auto mb-2", stat.color)} />
                                <p className="text-xl font-bold">{stat.value}</p>
                                <p className="text-xs text-muted-foreground">{stat.label}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Tabs */}
                <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-4 md:w-auto md:inline-grid">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="achievements">Achievements</TabsTrigger>
                        <TabsTrigger value="activity">Activity</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid lg:grid-cols-2 gap-6">
                            {/* Skills */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Code2 className="h-5 w-5 text-primary" />
                                        Skills Progress
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {skills.map((skill) => (
                                        <div key={skill.name}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span>{skill.name}</span>
                                                <span className="text-muted-foreground">{skill.level}%</span>
                                            </div>
                                            <Progress value={skill.level} className="h-2" />
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            {/* Learning Goals */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Target className="h-5 w-5 text-secondary" />
                                        Learning Goals
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {[
                                        { goal: "Complete Next.js Course", progress: 65 },
                                        { goal: "Build 5 Projects", progress: 40 },
                                        { goal: "Earn All Badges", progress: 35 },
                                        { goal: "Get Certified", progress: 80 },
                                    ].map((item, i) => (
                                        <div key={i}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span>{item.goal}</span>
                                                <span className="text-muted-foreground">{item.progress}%</span>
                                            </div>
                                            <Progress value={item.progress} className="h-2" />
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Achievements Tab */}
                    <TabsContent value="achievements">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Trophy className="h-5 w-5 text-accent" />
                                    Achievements ({achievements.filter(a => a.earned).length}/{achievements.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                    {achievements.map((achievement) => (
                                        <div
                                            key={achievement.id}
                                            className={cn(
                                                "p-4 rounded-xl border text-center transition-all",
                                                achievement.earned
                                                    ? "bg-primary/10 border-primary/30"
                                                    : "bg-muted/50 border-border opacity-50"
                                            )}
                                        >
                                            <div className="text-4xl mb-2">{achievement.icon}</div>
                                            <p className="text-sm font-medium">{achievement.title}</p>
                                            {achievement.earned && (
                                                <Badge variant="secondary" className="mt-2 text-xs">
                                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                                    Earned
                                                </Badge>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Activity Tab */}
                    <TabsContent value="activity">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-primary" />
                                    Recent Activity
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recentActivity.map((activity, i) => (
                                        <div key={i} className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                {activity.action.includes("Completed") && <CheckCircle2 className="h-5 w-5 text-primary" />}
                                                {activity.action.includes("Earned") && <Award className="h-5 w-5 text-accent" />}
                                                {activity.action.includes("Started") && <BookOpen className="h-5 w-5 text-secondary" />}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium">{activity.action}</p>
                                                <p className="text-sm text-muted-foreground">{activity.item}</p>
                                            </div>
                                            <span className="text-xs text-muted-foreground">{activity.time}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Settings Tab */}
                    <TabsContent value="settings" className="space-y-6">
                        {/* Edit Profile */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Profile Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="displayName">Display Name</Label>
                                        <Input
                                            id="displayName"
                                            value={profile.displayName}
                                            onChange={(e) => setProfile(p => ({ ...p, displayName: e.target.value }))}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="location">Location</Label>
                                        <Input
                                            id="location"
                                            value={profile.location}
                                            onChange={(e) => setProfile(p => ({ ...p, location: e.target.value }))}
                                            placeholder="City, Country"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="bio">Bio</Label>
                                    <Textarea
                                        id="bio"
                                        value={profile.bio}
                                        onChange={(e) => setProfile(p => ({ ...p, bio: e.target.value }))}
                                        placeholder="Tell us about yourself..."
                                        rows={3}
                                    />
                                </div>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="website">Website</Label>
                                        <Input
                                            id="website"
                                            value={profile.website}
                                            onChange={(e) => setProfile(p => ({ ...p, website: e.target.value }))}
                                            placeholder="https://..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="github">GitHub</Label>
                                        <Input
                                            id="github"
                                            value={profile.github}
                                            onChange={(e) => setProfile(p => ({ ...p, github: e.target.value }))}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="linkedin">LinkedIn</Label>
                                        <Input
                                            id="linkedin"
                                            value={profile.linkedin}
                                            onChange={(e) => setProfile(p => ({ ...p, linkedin: e.target.value }))}
                                        />
                                    </div>
                                </div>
                                <Button onClick={handleSave}>
                                    <Save className="h-4 w-4 mr-2" />
                                    Save Changes
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Account Settings */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Settings className="h-5 w-5" />
                                    Account Settings
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-lg border">
                                    <div className="flex items-center gap-3">
                                        <Bell className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="font-medium">Email Notifications</p>
                                            <p className="text-sm text-muted-foreground">Receive updates about your progress</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm">Configure</Button>
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-lg border">
                                    <div className="flex items-center gap-3">
                                        <Shield className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="font-medium">Privacy Settings</p>
                                            <p className="text-sm text-muted-foreground">Manage your profile visibility</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm">Configure</Button>
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-lg border border-destructive/30">
                                    <div className="flex items-center gap-3">
                                        <LogOut className="h-5 w-5 text-destructive" />
                                        <div>
                                            <p className="font-medium text-destructive">Sign Out</p>
                                            <p className="text-sm text-muted-foreground">Log out of your account</p>
                                        </div>
                                    </div>
                                    <Button variant="destructive" size="sm" onClick={handleSignOut}>
                                        Sign Out
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
};

export default Profile;
