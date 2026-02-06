import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    MessageSquare,
    ThumbsUp,
    MessageCircle,
    Search,
    Plus,
    TrendingUp,
    Clock,
    CheckCircle2,
    Filter,
    Users,
    Award,
    Flame,
    Eye,
    Share2,
    Bookmark
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface ForumPost {
    id: string;
    title: string;
    content: string;
    author: {
        name: string;
        avatar: string;
        level: number;
    };
    category: string;
    tags: string[];
    likes: number;
    replies: number;
    views: number;
    isAnswered: boolean;
    createdAt: string;
    isPinned?: boolean;
}

const Community = () => {
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [showNewPost, setShowNewPost] = useState(false);

    const categories = [
        { id: "all", label: "All Topics", icon: MessageSquare },
        { id: "help", label: "Help & Questions", icon: MessageCircle },
        { id: "showcase", label: "Showcase", icon: Award },
        { id: "discussion", label: "Discussion", icon: Users },
        { id: "tutorials", label: "Tutorials", icon: TrendingUp },
    ];

    const posts: ForumPost[] = [
        {
            id: "1",
            title: "How to implement ISR with dynamic routes in Next.js 15?",
            content: "I'm trying to implement Incremental Static Regeneration with dynamic routes but running into issues with the revalidate option...",
            author: { name: "Alex Chen", avatar: "", level: 12 },
            category: "help",
            tags: ["Next.js 15", "ISR", "Dynamic Routes"],
            likes: 24,
            replies: 8,
            views: 156,
            isAnswered: true,
            createdAt: "2 hours ago",
            isPinned: true
        },
        {
            id: "2",
            title: "🚀 Just deployed my first Next.js e-commerce site!",
            content: "After 3 months of learning through this platform, I finally launched my first production Next.js application...",
            author: { name: "Sarah Johnson", avatar: "", level: 8 },
            category: "showcase",
            tags: ["E-commerce", "Deployment", "Success Story"],
            likes: 89,
            replies: 23,
            views: 445,
            isAnswered: false,
            createdAt: "5 hours ago"
        },
        {
            id: "3",
            title: "Best practices for authentication in Next.js App Router",
            content: "What are the recommended approaches for implementing authentication with the new App Router? I've seen NextAuth, Clerk, and custom solutions...",
            author: { name: "Mike Wilson", avatar: "", level: 15 },
            category: "discussion",
            tags: ["Authentication", "App Router", "NextAuth"],
            likes: 45,
            replies: 31,
            views: 289,
            isAnswered: false,
            createdAt: "1 day ago"
        },
        {
            id: "4",
            title: "Tutorial: Building a real-time dashboard with Server Actions",
            content: "In this tutorial, I'll show you how to build a real-time dashboard using Server Actions and streaming...",
            author: { name: "Emily Davis", avatar: "", level: 20 },
            category: "tutorials",
            tags: ["Server Actions", "Real-time", "Dashboard"],
            likes: 67,
            replies: 12,
            views: 523,
            isAnswered: false,
            createdAt: "2 days ago"
        },
        {
            id: "5",
            title: "Error: 'use client' directive causing hydration mismatch",
            content: "Getting a hydration mismatch error when using 'use client' in a component that renders dates...",
            author: { name: "James Brown", avatar: "", level: 5 },
            category: "help",
            tags: ["Hydration", "Client Components", "Error"],
            likes: 12,
            replies: 6,
            views: 78,
            isAnswered: true,
            createdAt: "3 days ago"
        },
    ];

    const topContributors = [
        { name: "Emily Davis", avatar: "", level: 20, posts: 156, likes: 2340 },
        { name: "Mike Wilson", avatar: "", level: 15, posts: 98, likes: 1567 },
        { name: "Alex Chen", avatar: "", level: 12, posts: 67, likes: 890 },
        { name: "Sarah Johnson", avatar: "", level: 8, posts: 45, likes: 456 },
    ];

    const filteredPosts = posts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.content.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const getCategoryColor = (category: string) => {
        switch (category) {
            case "help": return "bg-blue-500/10 text-blue-500 border-blue-500/30";
            case "showcase": return "bg-green-500/10 text-green-500 border-green-500/30";
            case "discussion": return "bg-purple-500/10 text-purple-500 border-purple-500/30";
            case "tutorials": return "bg-orange-500/10 text-orange-500 border-orange-500/30";
            default: return "bg-muted text-muted-foreground";
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="container mx-auto px-4 py-8 pt-24">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-2">Community Forum</h1>
                            <p className="text-muted-foreground">
                                Connect, learn, and grow with fellow Next.js developers
                            </p>
                        </div>
                        <Button onClick={() => setShowNewPost(!showNewPost)} className="gap-2">
                            <Plus className="h-4 w-4" />
                            New Post
                        </Button>
                    </div>
                </div>

                {/* New Post Form */}
                {showNewPost && (
                    <Card className="mb-8 border-primary/30">
                        <CardHeader>
                            <CardTitle className="text-lg">Create New Post</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Input placeholder="Post title..." className="text-lg" />
                            <Textarea placeholder="Share your question, idea, or showcase your work..." rows={4} />
                            <div className="flex items-center gap-4 flex-wrap">
                                <select className="px-3 py-2 rounded-lg border border-border bg-background text-sm">
                                    <option>Select Category</option>
                                    <option value="help">Help & Questions</option>
                                    <option value="showcase">Showcase</option>
                                    <option value="discussion">Discussion</option>
                                    <option value="tutorials">Tutorials</option>
                                </select>
                                <Input placeholder="Tags (comma separated)" className="flex-1" />
                                <Button>Post</Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Search & Filter */}
                        <div className="flex gap-4 flex-wrap">
                            <div className="relative flex-1 min-w-[200px]">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search discussions..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <div className="flex gap-2 overflow-x-auto">
                                {categories.map((cat) => (
                                    <Button
                                        key={cat.id}
                                        variant={selectedCategory === cat.id ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setSelectedCategory(cat.id)}
                                        className="whitespace-nowrap"
                                    >
                                        <cat.icon className="h-4 w-4 mr-1" />
                                        {cat.label}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Posts List */}
                        <div className="space-y-4">
                            {filteredPosts.map((post) => (
                                <Card
                                    key={post.id}
                                    className={cn(
                                        "hover:border-primary/30 transition-all cursor-pointer",
                                        post.isPinned && "border-primary/50 bg-primary/5"
                                    )}
                                >
                                    <CardContent className="p-5">
                                        <div className="flex gap-4">
                                            <Avatar className="h-10 w-10 shrink-0">
                                                <AvatarImage src={post.author.avatar} />
                                                <AvatarFallback className="bg-primary/10 text-primary">
                                                    {post.author.name.split(" ").map(n => n[0]).join("")}
                                                </AvatarFallback>
                                            </Avatar>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start gap-2 mb-2 flex-wrap">
                                                    {post.isPinned && (
                                                        <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/30">
                                                            📌 Pinned
                                                        </Badge>
                                                    )}
                                                    {post.isAnswered && (
                                                        <Badge className="text-xs bg-green-500/10 text-green-500 border-green-500/30">
                                                            <CheckCircle2 className="h-3 w-3 mr-1" />
                                                            Answered
                                                        </Badge>
                                                    )}
                                                    <Badge variant="outline" className={cn("text-xs", getCategoryColor(post.category))}>
                                                        {post.category}
                                                    </Badge>
                                                </div>

                                                <h3 className="font-semibold text-lg mb-1 hover:text-primary transition-colors">
                                                    {post.title}
                                                </h3>
                                                <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                                                    {post.content}
                                                </p>

                                                <div className="flex flex-wrap gap-2 mb-3">
                                                    {post.tags.map((tag, i) => (
                                                        <Badge key={i} variant="secondary" className="text-xs">
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                </div>

                                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                                    <div className="flex items-center gap-4">
                                                        <span className="flex items-center gap-1">
                                                            <ThumbsUp className="h-4 w-4" />
                                                            {post.likes}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <MessageCircle className="h-4 w-4" />
                                                            {post.replies}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Eye className="h-4 w-4" />
                                                            {post.views}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span>{post.author.name}</span>
                                                        <Badge variant="outline" className="text-xs">
                                                            Lvl {post.author.level}
                                                        </Badge>
                                                        <span>• {post.createdAt}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Stats */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-primary" />
                                    Community Stats
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Total Members</span>
                                    <span className="font-semibold">12,456</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Posts Today</span>
                                    <span className="font-semibold">89</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Answers Given</span>
                                    <span className="font-semibold">3,245</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Top Contributors */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Award className="h-5 w-5 text-accent" />
                                    Top Contributors
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {topContributors.map((contributor, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <span className={cn(
                                            "text-sm font-bold w-5",
                                            i === 0 && "text-yellow-500",
                                            i === 1 && "text-gray-400",
                                            i === 2 && "text-amber-600"
                                        )}>
                                            #{i + 1}
                                        </span>
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                                {contributor.name.split(" ").map(n => n[0]).join("")}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{contributor.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {contributor.posts} posts • {contributor.likes} likes
                                            </p>
                                        </div>
                                        <Badge variant="outline" className="text-xs">
                                            Lvl {contributor.level}
                                        </Badge>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Hot Topics */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Flame className="h-5 w-5 text-orange-500" />
                                    Hot Topics
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {["Next.js 15", "Server Actions", "App Router", "TypeScript", "Tailwind CSS"].map((topic, i) => (
                                    <Badge key={i} variant="secondary" className="mr-2 mb-2 cursor-pointer hover:bg-primary/10">
                                        #{topic}
                                    </Badge>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Community;
