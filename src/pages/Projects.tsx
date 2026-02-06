import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Search,
    ExternalLink,
    Github,
    Star,
    Eye,
    Heart,
    Filter,
    Grid3X3,
    LayoutList,
    Sparkles,
    Code2,
    Rocket,
    Trophy,
    Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

import { api, Project, ProjectStats } from "@/services/api";

const Projects = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTech, setSelectedTech] = useState("all");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [visibleCount, setVisibleCount] = useState(4);
    const [projects, setProjects] = useState<Project[]>([]);
    const [stats, setStats] = useState<ProjectStats>({ totalProjects: 0, totalStars: 0, totalViews: 0, featuredCount: 0 });
    const [loading, setLoading] = useState(true);

    const techFilters = [
        { id: "all", label: "All Projects" },
        { id: "nextjs", label: "Next.js" },
        { id: "react", label: "React" },
        { id: "typescript", label: "TypeScript" },
        { id: "tailwind", label: "Tailwind CSS" },
        { id: "prisma", label: "Prisma" },
    ];

    // Fetch projects from API
    useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true);
            try {
                const data = await api.projects.getAll(selectedTech, searchQuery);
                setProjects(data);
            } catch (err) {
                console.error("Error fetching projects:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, [selectedTech, searchQuery]);

    // Fetch stats
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await api.projects.getStats();
                setStats(data);
            } catch (err) {
                console.error("Error fetching stats:", err);
            }
        };
        fetchStats();
    }, []);

    const featuredProjects = projects.filter(p => p.featured);
    const regularProjects = projects.filter(p => !p.featured);

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="container mx-auto px-4 py-8 pt-24">
                {/* Header */}
                <div className="mb-8 text-center">
                    <Badge variant="outline" className="mb-4">
                        <Rocket className="h-3 w-3 mr-1" />
                        Student Showcase
                    </Badge>
                    <h1 className="text-3xl md:text-5xl font-bold mb-4">
                        Projects Gallery
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Explore amazing projects built by our community using the skills learned from our courses.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { icon: Code2, label: "Total Projects", value: stats.totalProjects.toLocaleString() },
                        { icon: Star, label: "Total Stars", value: stats.totalStars.toLocaleString() },
                        { icon: Eye, label: "Total Views", value: stats.totalViews.toLocaleString() },
                        { icon: Trophy, label: "Featured", value: stats.featuredCount.toString() },
                    ].map((stat, i) => (
                        <Card key={i} className="text-center">
                            <CardContent className="p-4">
                                <stat.icon className="h-6 w-6 mx-auto mb-2 text-primary" />
                                <p className="text-2xl font-bold">{stat.value}</p>
                                <p className="text-xs text-muted-foreground">{stat.label}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Search & Filters */}
                <div className="mb-8 space-y-4">
                    <div className="flex gap-4 flex-wrap">
                        <div className="relative flex-1 min-w-[250px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search projects..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant={viewMode === "grid" ? "default" : "outline"}
                                size="icon"
                                onClick={() => setViewMode("grid")}
                            >
                                <Grid3X3 className="h-4 w-4" />
                            </Button>
                            <Button
                                variant={viewMode === "list" ? "default" : "outline"}
                                size="icon"
                                onClick={() => setViewMode("list")}
                            >
                                <LayoutList className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {techFilters.map((filter) => (
                            <Button
                                key={filter.id}
                                variant={selectedTech === filter.id ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedTech(filter.id)}
                            >
                                {filter.label}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Featured Projects */}
                {featuredProjects.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-accent" />
                            Featured Projects
                        </h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {featuredProjects.map((project) => (
                                <Card key={project._id} className="overflow-hidden group hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10">
                                    <div className="aspect-video overflow-hidden relative">
                                        <img
                                            src={project.image}
                                            alt={project.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <Badge className="absolute top-3 right-3 bg-accent/90">
                                            <Trophy className="h-3 w-3 mr-1" />
                                            Featured
                                        </Badge>
                                    </div>
                                    <CardContent className="p-5">
                                        <div className="flex flex-wrap gap-1 mb-3">
                                            {project.techStack.slice(0, 3).map((tech, i) => (
                                                <Badge key={i} variant="secondary" className="text-xs">
                                                    {tech}
                                                </Badge>
                                            ))}
                                            {project.techStack.length > 3 && (
                                                <Badge variant="secondary" className="text-xs">
                                                    +{project.techStack.length - 3}
                                                </Badge>
                                            )}
                                        </div>
                                        <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                                            {project.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                                            {project.description}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-6 w-6">
                                                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                                        {project.author.name.split(" ").map(n => n[0]).join("")}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="text-xs text-muted-foreground">{project.author.name}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Star className="h-3 w-3" />
                                                    {project.stars}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Heart className="h-3 w-3" />
                                                    {project.likes}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 mt-4">
                                            <Button size="sm" className="flex-1" asChild>
                                                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                                                    <ExternalLink className="h-3 w-3 mr-1" />
                                                    Live Demo
                                                </a>
                                            </Button>
                                            <Button size="sm" variant="outline" asChild>
                                                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                                                    <Github className="h-3 w-3" />
                                                </a>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* All Projects */}
                <div>
                    <h2 className="text-xl font-bold mb-4">All Projects</h2>
                    <div className={cn(
                        "gap-6 mb-8",
                        viewMode === "grid" ? "grid md:grid-cols-2 lg:grid-cols-4" : "space-y-4"
                    )}>
                        {regularProjects.slice(0, visibleCount).map((project) => (
                            <Card
                                key={project._id}
                                className={cn(
                                    "overflow-hidden group hover:border-primary/30 transition-all",
                                    viewMode === "list" && "flex"
                                )}
                            >
                                <div className={cn(
                                    "overflow-hidden",
                                    viewMode === "grid" ? "aspect-video" : "w-48 shrink-0"
                                )}>
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <CardContent className={cn("p-4", viewMode === "list" && "flex-1")}>
                                    <div className="flex flex-wrap gap-1 mb-2">
                                        {project.techStack.slice(0, 2).map((tech, i) => (
                                            <Badge key={i} variant="secondary" className="text-xs">
                                                {tech}
                                            </Badge>
                                        ))}
                                    </div>
                                    <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                                        {project.title}
                                    </h3>
                                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                                        {project.description}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-muted-foreground">{project.author.name}</span>
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="ghost" className="h-7 px-2" asChild>
                                                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                                                    <ExternalLink className="h-3 w-3" />
                                                </a>
                                            </Button>
                                            <Button size="sm" variant="ghost" className="h-7 px-2" asChild>
                                                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                                                    <Github className="h-3 w-3" />
                                                </a>
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {visibleCount < regularProjects.length && (
                        <div className="text-center">
                            <Button
                                variant="secondary"
                                size="lg"
                                className="px-8"
                                onClick={() => setVisibleCount(prev => prev + 4)}
                            >
                                Load More Projects
                            </Button>
                        </div>
                    )}
                </div>

                {/* Submit Project CTA */}
                <Card className="mt-12 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/30">
                    <CardContent className="p-8 text-center">
                        <h3 className="text-2xl font-bold mb-2">Share Your Project</h3>
                        <p className="text-muted-foreground mb-6">
                            Built something amazing? Submit your project to be featured in our gallery!
                        </p>
                        <Button size="lg">
                            <Rocket className="h-4 w-4 mr-2" />
                            Submit Project
                        </Button>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
};

export default Projects;
