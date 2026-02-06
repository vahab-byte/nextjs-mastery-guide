import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    ChevronRight,
    Play,
    CheckCircle,
    Clock,
    BookOpen,
    Code2,
    Rocket,
    Trophy,
    Sparkles,
    Target,
    Flame,
    Zap
} from "lucide-react";
import { Link } from "react-router-dom";

// Animated Section Wrapper - triggers line-by-line animations
interface AnimatedSectionProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}

const AnimatedSection = ({ children, className = "", delay = 0 }: AnimatedSectionProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTimeout(() => setIsVisible(true), delay);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [delay]);

    return (
        <div
            ref={ref}
            className={`transition-all duration-700 ease-out ${isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
                } ${className}`}
        >
            {children}
        </div>
    );
};

// Staggered Children Wrapper
interface StaggeredChildrenProps {
    children: React.ReactNode[];
    className?: string;
    staggerDelay?: number;
}

const StaggeredChildren = ({ children, className = "", staggerDelay = 100 }: StaggeredChildrenProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const [visibleIndices, setVisibleIndices] = useState<Set<number>>(new Set());

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    children.forEach((_, index) => {
                        setTimeout(() => {
                            setVisibleIndices(prev => new Set([...prev, index]));
                        }, index * staggerDelay);
                    });
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.1 }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [children.length, staggerDelay]);

    return (
        <div ref={ref} className={className}>
            {children.map((child, index) => (
                <div
                    key={index}
                    className={`transition-all duration-500 ease-out ${visibleIndices.has(index)
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-6'
                        }`}
                    style={{ transitionDelay: `${index * 50}ms` }}
                >
                    {child}
                </div>
            ))}
        </div>
    );
};

// Learning Path Data
const learningPaths = [
    {
        id: 1,
        title: "Beginner",
        duration: "4 weeks",
        modules: 8,
        color: "from-green-500 to-emerald-500",
        skills: ["React Basics", "JSX", "Components", "Props & State"],
        icon: BookOpen,
    },
    {
        id: 2,
        title: "Intermediate",
        duration: "6 weeks",
        modules: 12,
        color: "from-blue-500 to-cyan-500",
        skills: ["Next.js Routing", "API Routes", "SSR/SSG", "Data Fetching"],
        icon: Code2,
    },
    {
        id: 3,
        title: "Advanced",
        duration: "8 weeks",
        modules: 16,
        color: "from-purple-500 to-pink-500",
        skills: ["Performance", "Auth", "Databases", "Deployment"],
        icon: Rocket,
    },
    {
        id: 4,
        title: "Expert",
        duration: "10 weeks",
        modules: 20,
        color: "from-orange-500 to-red-500",
        skills: ["Microservices", "Testing", "CI/CD", "Architecture"],
        icon: Trophy,
    },
];

// Live Lesson Preview
const liveLesson = {
    title: "Building Server Components",
    chapter: "Chapter 5: Advanced Rendering",
    duration: "45 min",
    viewers: 1247,
    instructor: "Alex Morgan",
    thumbnail: "📺",
};

// Success Stories
const successStories = [
    {
        name: "Priya Sharma",
        role: "Frontend Developer → Senior Engineer",
        company: "Microsoft",
        image: "👩‍💻",
        story: "Landed my dream job after completing the advanced track!",
        salary: "+80% salary increase",
    },
    {
        name: "James Chen",
        role: "Student → Full Stack Developer",
        company: "Stripe",
        image: "👨‍💻",
        story: "From zero coding experience to working at a top tech company.",
        salary: "First tech job!",
    },
    {
        name: "Maria Garcia",
        role: "Backend Dev → Full Stack Lead",
        company: "Netflix",
        image: "👩‍🔬",
        story: "Next.js skills helped me lead the frontend migration.",
        salary: "+65% salary increase",
    },
];

// Weekly Challenge
const weeklyChallenge = {
    title: "Build a Real-time Dashboard",
    participants: 3420,
    prize: "$500 in prizes",
    endsIn: "3 days",
    difficulty: "Intermediate",
};

const LearningPathSection = () => {
    const [selectedPath, setSelectedPath] = useState(0);

    return (
        <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-background to-card/30">
            <div className="container mx-auto max-w-6xl">
                <AnimatedSection className="text-center mb-12">
                    <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                        <Target className="h-3 w-3 mr-1" />
                        Structured Learning
                    </Badge>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Learning Path</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        From complete beginner to industry expert. Each path is carefully designed
                        with hands-on projects and real-world applications.
                    </p>
                </AnimatedSection>

                {/* Path Selector */}
                <AnimatedSection delay={100}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {learningPaths.map((path, index) => (
                            <button
                                key={path.id}
                                onClick={() => setSelectedPath(index)}
                                className={`p-4 rounded-xl border transition-all duration-300 ${selectedPath === index
                                    ? "border-primary bg-primary/10 scale-105"
                                    : "border-border bg-card/50 hover:border-primary/50"
                                    }`}
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${path.color} flex items-center justify-center mb-3 mx-auto`}>
                                    <path.icon className="h-5 w-5 text-white" />
                                </div>
                                <h3 className="font-semibold text-sm">{path.title}</h3>
                                <p className="text-xs text-muted-foreground">{path.duration}</p>
                            </button>
                        ))}
                    </div>
                </AnimatedSection>

                {/* Selected Path Details */}
                <AnimatedSection delay={200}>
                    <Card className="border-border/50 bg-card/50 backdrop-blur overflow-hidden">
                        <CardContent className="p-6 md:p-8">
                            <div className="grid md:grid-cols-2 gap-8 items-center">
                                <div>
                                    <Badge className={`mb-4 bg-gradient-to-r ${learningPaths[selectedPath].color} text-white`}>
                                        {learningPaths[selectedPath].modules} Modules
                                    </Badge>
                                    <h3 className="text-2xl font-bold mb-4">
                                        {learningPaths[selectedPath].title} Track
                                    </h3>
                                    <p className="text-muted-foreground mb-6">
                                        Master the skills needed to become a {learningPaths[selectedPath].title.toLowerCase()}-level
                                        Next.js developer in just {learningPaths[selectedPath].duration}.
                                    </p>

                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {learningPaths[selectedPath].skills.map((skill, i) => (
                                            <Badge key={i} variant="outline" className="text-xs">
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>

                                    <Button asChild className="group">
                                        <Link to="/curriculum">
                                            Start This Path
                                            <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-4 rounded-lg bg-background/50 border border-border/50">
                                        <Clock className="h-5 w-5 text-primary" />
                                        <div>
                                            <p className="font-medium">Duration</p>
                                            <p className="text-sm text-muted-foreground">{learningPaths[selectedPath].duration}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 rounded-lg bg-background/50 border border-border/50">
                                        <BookOpen className="h-5 w-5 text-secondary" />
                                        <div>
                                            <p className="font-medium">Modules</p>
                                            <p className="text-sm text-muted-foreground">{learningPaths[selectedPath].modules} comprehensive modules</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 rounded-lg bg-background/50 border border-border/50">
                                        <Trophy className="h-5 w-5 text-accent" />
                                        <div>
                                            <p className="font-medium">Certificate</p>
                                            <p className="text-sm text-muted-foreground">Industry-recognized credential</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </AnimatedSection>
            </div>
        </section>
    );
};

const LiveLessonSection = () => {
    return (
        <section className="py-16 px-4">
            <div className="container mx-auto max-w-6xl">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    {/* Live Lesson Card */}
                    <AnimatedSection>
                        <Card className="border-border/50 bg-card/50 backdrop-blur overflow-hidden group">
                            <CardContent className="p-0">
                                <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                                    <div className="absolute top-4 left-4 flex items-center gap-2">
                                        <Badge className="bg-red-500 text-white animate-pulse">
                                            <span className="w-2 h-2 bg-white rounded-full mr-2 animate-ping" />
                                            LIVE
                                        </Badge>
                                        <Badge variant="secondary">{liveLesson.viewers.toLocaleString()} watching</Badge>
                                    </div>
                                    <div className="text-8xl">{liveLesson.thumbnail}</div>
                                    <Button
                                        size="lg"
                                        className="absolute bottom-4 right-4 group-hover:scale-110 transition-transform"
                                    >
                                        <Play className="mr-2 h-5 w-5" />
                                        Watch Now
                                    </Button>
                                </div>
                                <div className="p-6">
                                    <p className="text-sm text-primary font-medium mb-2">{liveLesson.chapter}</p>
                                    <h3 className="text-xl font-bold mb-2">{liveLesson.title}</h3>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <span>By {liveLesson.instructor}</span>
                                        <span>•</span>
                                        <span>{liveLesson.duration}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </AnimatedSection>

                    {/* Weekly Challenge */}
                    <AnimatedSection delay={150}>
                        <Badge className="mb-4 bg-orange-500/10 text-orange-500 border-orange-500/20">
                            <Flame className="h-3 w-3 mr-1" />
                            Weekly Challenge
                        </Badge>
                        <h2 className="text-3xl font-bold mb-4">{weeklyChallenge.title}</h2>
                        <p className="text-muted-foreground mb-6">
                            Compete with {weeklyChallenge.participants.toLocaleString()} developers worldwide.
                            {weeklyChallenge.prize} for top performers!
                        </p>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between text-sm">
                                <span>Challenge ends in</span>
                                <span className="font-bold text-orange-500">{weeklyChallenge.endsIn}</span>
                            </div>
                            <Progress value={70} className="h-2" />
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span>Difficulty: {weeklyChallenge.difficulty}</span>
                                <span>{weeklyChallenge.participants.toLocaleString()} participants</span>
                            </div>
                        </div>

                        <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                            <Zap className="mr-2 h-4 w-4" />
                            Join Challenge
                        </Button>
                    </AnimatedSection>
                </div>
            </div>
        </section>
    );
};

const SuccessStoriesSection = () => {
    return (
        <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-card/30 to-background">
            <div className="container mx-auto max-w-6xl">
                <AnimatedSection className="text-center mb-12">
                    <Badge className="mb-4 bg-green-500/10 text-green-500 border-green-500/20">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Success Stories
                    </Badge>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Career Transformations</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Real stories from developers who transformed their careers with our platform.
                    </p>
                </AnimatedSection>

                <AnimatedSection delay={100}>
                    <div className="grid md:grid-cols-3 gap-6">
                        {successStories.map((story, index) => (
                            <Card
                                key={index}
                                className="border-border/50 bg-card/50 backdrop-blur hover:border-primary/30 transition-all group"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="text-4xl">{story.image}</div>
                                        <div>
                                            <h4 className="font-bold">{story.name}</h4>
                                            <p className="text-sm text-muted-foreground">{story.company}</p>
                                        </div>
                                    </div>

                                    <Badge className="mb-3 bg-green-500/10 text-green-500">
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        {story.salary}
                                    </Badge>

                                    <p className="text-sm text-foreground/80 mb-3">{story.role}</p>
                                    <p className="text-sm text-muted-foreground italic">"{story.story}"</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </AnimatedSection>

                <AnimatedSection delay={200} className="text-center mt-8">
                    <Button variant="outline" size="lg">
                        View All Success Stories
                        <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                </AnimatedSection>
            </div>
        </section>
    );
};

export { LearningPathSection, LiveLessonSection, SuccessStoriesSection };
