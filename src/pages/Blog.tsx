import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Search,
    Clock,
    Calendar,
    User,
    ArrowRight,
    TrendingUp,
    BookOpen,
    Tag,
    ChevronRight,
    Bookmark,
    Share2,
    Eye,
    Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BlogPost {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    author: {
        name: string;
        avatar: string;
        role: string;
    };
    category: string;
    tags: string[];
    readTime: number;
    views: number;
    likes: number;
    coverImage: string;
    featured?: boolean;
    createdAt: string;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const DUMMY_POSTS: BlogPost[] = [
    {
        _id: "1",
        title: "Getting Started with Next.js 15",
        slug: "getting-started-nextjs-15",
        excerpt: "Learn the basics of Next.js 15 and how to build scalable web applications with the latest features, including Server Actions and Partial Prerendering.",
        content: "Full content here...",
        author: {
            name: "Sarah Chen",
            avatar: "",
            role: "Senior Developer"
        },
        category: "Tutorial",
        tags: ["Next.js", "React", "Web Dev"],
        readTime: 5,
        views: 1250,
        likes: 120,
        coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
        featured: true,
        createdAt: new Date().toISOString()
    },
    {
        _id: "2",
        title: "Mastering TypeScript in 2024",
        slug: "mastering-typescript",
        excerpt: "Deep dive into advanced TypeScript features, utility types, and best practices for large-scale applications.",
        content: "Content...",
        author: {
            name: "Alex Rivera",
            avatar: "",
            role: "Tech Lead"
        },
        category: "Guide",
        tags: ["TypeScript", "JavaScript"],
        readTime: 8,
        views: 980,
        likes: 85,
        coverImage: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&q=80",
        featured: false,
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
        _id: "3",
        title: "The Future of AI in Web Development",
        slug: "ai-web-development",
        excerpt: "How Artificial Intelligence is reshaping the way we build, test, and deploy web applications.",
        content: "Content...",
        author: {
            name: "Emily Zhang",
            avatar: "",
            role: "AI Engineer"
        },
        category: "Case Study",
        tags: ["AI", "Future Tech"],
        readTime: 6,
        views: 1500,
        likes: 200,
        coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
        featured: false,
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
    }
];

const Blog = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const categories = [
        { id: "all", label: "All Articles" },
        { id: "Tutorial", label: "Tutorials" },
        { id: "Guide", label: "Guides" },
        { id: "News", label: "News" },
        { id: "Tips", label: "Tips & Tricks" },
        { id: "Case Study", label: "Case Studies" },
    ];

    // Fetch blogs from API
    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                setLoading(true);
                let url = `${API_URL}/blogs?`;

                if (selectedCategory !== "all") {
                    url += `category=${selectedCategory}&`;
                }
                if (searchQuery) {
                    url += `search=${encodeURIComponent(searchQuery)}&`;
                }

                const response = await fetch(url);
                if (!response.ok) throw new Error("Failed to fetch blogs");

                const data = await response.json();
                setPosts(data);
                setError(null);
            } catch (err: any) {
                console.log("API unavailable, loading demo data");
                setPosts(DUMMY_POSTS);
                // Don't set error to avoid UI breakage, just fallback
                setError(null);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, [selectedCategory, searchQuery]);

    const filteredPosts = posts;
    const featuredPost = posts.find(p => p.featured);
    const regularPosts = filteredPosts.filter(p => !p.featured);

    const getCategoryColor = (category: string) => {
        switch (category.toLowerCase()) {
            case "tutorial": return "bg-blue-500/10 text-blue-500 border-blue-500/30";
            case "guide": return "bg-green-500/10 text-green-500 border-green-500/30";
            case "news": return "bg-purple-500/10 text-purple-500 border-purple-500/30";
            case "tips": return "bg-orange-500/10 text-orange-500 border-orange-500/30";
            case "case study": return "bg-pink-500/10 text-pink-500 border-pink-500/30";
            default: return "bg-muted text-muted-foreground";
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="container mx-auto px-4 py-8 pt-24">
                {/* Header */}
                <div className="mb-8 text-center">
                    <Badge variant="outline" className="mb-4">
                        <BookOpen className="h-3 w-3 mr-1" />
                        Developer Blog
                    </Badge>
                    <h1 className="text-3xl md:text-5xl font-bold mb-4">
                        Insights & Tutorials
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Stay updated with the latest Next.js tips, tutorials, and industry insights from our expert developers.
                    </p>
                </div>

                {/* Search & Categories */}
                <div className="mb-8 space-y-4">
                    <div className="relative max-w-xl mx-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            placeholder="Search articles..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-12 h-12 text-lg"
                        />
                    </div>
                    <div className="flex justify-center gap-2 flex-wrap">
                        {categories.map((cat) => (
                            <Button
                                key={cat.id}
                                variant={selectedCategory === cat.id ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedCategory(cat.id)}
                            >
                                {cat.label}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="text-center py-12 text-destructive">
                        <p>Failed to load blogs. Please try again.</p>
                    </div>
                )}

                {/* No Posts */}
                {!loading && !error && posts.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">No blog posts found.</p>
                    </div>
                )}

                {/* Featured Post */}
                {!loading && featuredPost && selectedCategory === "all" && !searchQuery && (
                    <Card className="mb-12 overflow-hidden border-primary/30 bg-gradient-to-r from-primary/5 to-secondary/5">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="aspect-video md:aspect-auto overflow-hidden">
                                <img
                                    src={featuredPost.coverImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800'}
                                    alt={featuredPost.title}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <div className="p-6 flex flex-col justify-center">
                                <Badge className="w-fit mb-4 bg-primary/10 text-primary border-primary/30">
                                    ✨ Featured Article
                                </Badge>
                                <h2 className="text-2xl md:text-3xl font-bold mb-3 hover:text-primary transition-colors cursor-pointer">
                                    {featuredPost.title}
                                </h2>
                                <p className="text-muted-foreground mb-4">{featuredPost.excerpt}</p>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                                    <span className="flex items-center gap-1">
                                        <Clock className="h-4 w-4" />
                                        {featuredPost.readTime} min read
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Eye className="h-4 w-4" />
                                        {featuredPost.views.toLocaleString()} views
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        {formatDate(featuredPost.createdAt)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10">
                                        <AvatarFallback className="bg-primary/10 text-primary">
                                            {featuredPost.author.name.split(" ").map(n => n[0]).join("")}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">{featuredPost.author.name}</p>
                                        <p className="text-sm text-muted-foreground">{featuredPost.author.role}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                )}

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Posts Grid */}
                    <div className="lg:col-span-2">
                        <div className="grid md:grid-cols-2 gap-6">
                            {regularPosts.map((post) => (
                                <Card key={post._id} className="overflow-hidden hover:border-primary/30 transition-all group cursor-pointer">
                                    <div className="aspect-video overflow-hidden">
                                        <img
                                            src={post.coverImage || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800'}
                                            alt={post.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <CardContent className="p-5">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Badge variant="outline" className={cn("text-xs", getCategoryColor(post.category))}>
                                                {post.category}
                                            </Badge>
                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {post.readTime} min
                                            </span>
                                        </div>
                                        <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                            {post.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                                            {post.excerpt}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-6 w-6">
                                                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                                        {post.author.name.split(" ").map(n => n[0]).join("")}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="text-xs text-muted-foreground">{post.author.name}</span>
                                            </div>
                                            <span className="text-xs text-muted-foreground">{formatDate(post.createdAt)}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Load More */}
                        <div className="text-center mt-8">
                            <Button variant="outline" size="lg">
                                Load More Articles
                                <ChevronRight className="h-4 w-4 ml-2" />
                            </Button>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Popular Posts */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-primary" />
                                    Popular Articles
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {posts.slice(0, 4).map((post, i) => (
                                    <div key={post._id} className="flex gap-3 group cursor-pointer">
                                        <span className={cn(
                                            "text-2xl font-bold",
                                            i === 0 && "text-primary",
                                            i === 1 && "text-secondary",
                                            i === 2 && "text-accent",
                                            i > 2 && "text-muted-foreground"
                                        )}>
                                            {String(i + 1).padStart(2, '0')}
                                        </span>
                                        <div>
                                            <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                                                {post.title}
                                            </h4>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {post.views.toLocaleString()} views
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Tags Cloud */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Tag className="h-5 w-5 text-secondary" />
                                    Popular Tags
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {["Next.js 15", "React", "TypeScript", "Tailwind", "Prisma", "Server Actions", "Performance", "SSR", "API Routes", "Vercel"].map((tag) => (
                                        <Badge
                                            key={tag}
                                            variant="secondary"
                                            className="cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors"
                                        >
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Newsletter */}
                        <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/30">
                            <CardContent className="p-6 text-center">
                                <h3 className="font-bold text-lg mb-2">Stay Updated</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Get the latest articles delivered to your inbox
                                </p>
                                <Input placeholder="Enter your email" className="mb-3" />
                                <Button className="w-full">Subscribe</Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Blog;
