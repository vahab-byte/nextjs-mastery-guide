import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
    Search,
    MapPin,
    Building2,
    Clock,
    DollarSign,
    Briefcase,
    Users,
    ExternalLink,
    Bookmark,
    Filter,
    TrendingUp,
    Zap,
    Globe,
    Home,
    Linkedin
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Job {
    id: string;
    title: string;
    company: {
        name: string;
        logo: string;
        size: string;
    };
    location: string;
    type: string;
    remote: boolean;
    salary: {
        min: number;
        max: number;
        currency: string;
    };
    experience: string;
    skills: string[];
    postedAt: string;
    featured?: boolean;
    urgent?: boolean;
    source: 'LinkedIn' | 'Direct';
    applicationUrl: string;
    isAd?: boolean;
}

const Jobs = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [locationFilter, setLocationFilter] = useState("");
    const [filters, setFilters] = useState({
        remote: false,
        fullTime: false,
        partTime: false,
        contract: false,
    });

    const jobs: Job[] = [
        {
            id: "1",
            title: "Senior Next.js Developer",
            company: { name: "Vercel", logo: "", size: "500-1000" },
            location: "San Francisco, CA",
            type: "Full-time",
            remote: true,
            salary: { min: 160000, max: 220000, currency: "USD" },
            experience: "5+ years",
            skills: ["Next.js", "React", "TypeScript", "Turbo"],
            postedAt: "Just now",
            featured: true,
            source: 'Direct',
            applicationUrl: "https://vercel.com/careers",
            isAd: true
        },
        {
            id: "2",
            title: "Full Stack Engineer",
            company: { name: "OpenAI", logo: "", size: "500+" },
            location: "San Francisco, CA",
            type: "Full-time",
            remote: false,
            salary: { min: 180000, max: 260000, currency: "USD" },
            experience: "3+ years",
            skills: ["React", "Python", "AI/ML", "Next.js"],
            postedAt: "2 hours ago",
            urgent: true,
            source: 'Direct',
            applicationUrl: "https://openai.com/careers",
            isAd: true
        },
        {
            id: "3",
            title: "Frontend Developer",
            company: { name: "Netflix", logo: "", size: "5000+" },
            location: "Los Gatos, CA",
            type: "Full-time",
            remote: true,
            salary: { min: 200000, max: 350000, currency: "USD" },
            experience: "4+ years",
            skills: ["React", "Performance", "GraphQL"],
            postedAt: "5 hours ago",
            source: 'Direct',
            applicationUrl: "https://jobs.netflix.com/",
            featured: true
        },
        {
            id: "4",
            title: "React Native Developer",
            company: { name: "Shopify", logo: "", size: "10000+" },
            location: "Remote",
            type: "Contract",
            remote: true,
            salary: { min: 90, max: 140, currency: "USD/hr" },
            experience: "3+ years",
            skills: ["React Native", "Mobile", "TypeScript"],
            postedAt: "1 day ago",
            source: 'LinkedIn',
            applicationUrl: "https://www.shopify.com/careers"
        },
        {
            id: "5",
            title: "Software Engineer, Frontend",
            company: { name: "Airbnb", logo: "", size: "5000+" },
            location: "Seattle, WA",
            type: "Full-time",
            remote: false,
            salary: { min: 170000, max: 240000, currency: "USD" },
            experience: "4+ years",
            skills: ["React", "Design Systems", "Accessibility"],
            postedAt: "2 days ago",
            featured: false,
            source: 'Direct',
            applicationUrl: "https://careers.airbnb.com/",
            isAd: true
        },
        {
            id: "6",
            title: "Junior Web Developer",
            company: { name: "Stripe", logo: "", size: "1000+" },
            location: "New York, NY",
            type: "Full-time",
            remote: true,
            salary: { min: 110000, max: 140000, currency: "USD" },
            experience: "1-3 years",
            skills: ["React", "JavaScript", "Payments"],
            postedAt: "3 days ago",
            source: 'Direct',
            applicationUrl: "https://stripe.com/jobs"
        },
        {
            id: "7",
            title: "UI/UX Engineer",
            company: { name: "Linear", logo: "", size: "50-100" },
            location: "Remote",
            type: "Full-time",
            remote: true,
            salary: { min: 130000, max: 170000, currency: "USD" },
            experience: "3+ years",
            skills: ["React", "CSS", "Animation", "Design"],
            postedAt: "3 days ago",
            source: 'LinkedIn',
            applicationUrl: "https://linear.app/careers",
            featured: true
        },
        {
            id: "8",
            title: "Frontend Engineer",
            company: { name: "Meta", logo: "", size: "10000+" },
            location: "Menlo Park, CA",
            type: "Full-time",
            remote: false,
            salary: { min: 160000, max: 230000, currency: "USD" },
            experience: "2+ years",
            skills: ["React", "Relay", "GraphQL"],
            postedAt: "4 days ago",
            source: 'Direct',
            applicationUrl: "https://www.metacareers.com/"
        },
    ];

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesLocation = !locationFilter ||
            job.location.toLowerCase().includes(locationFilter.toLowerCase());
        const matchesRemote = !filters.remote || job.remote;
        const matchesType = (
            (!filters.fullTime && !filters.partTime && !filters.contract) ||
            (filters.fullTime && job.type === "Full-time") ||
            (filters.partTime && job.type === "Part-time") ||
            (filters.contract && job.type === "Contract")
        );
        return matchesSearch && matchesLocation && matchesRemote && matchesType;
    });

    const formatSalary = (job: Job) => {
        const { min, max, currency } = job.salary;
        if (currency.includes("/hr")) {
            return `$${min}-$${max}/hr`;
        }
        return `$${(min / 1000).toFixed(0)}K-$${(max / 1000).toFixed(0)}K`;
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="container mx-auto px-4 py-8 pt-24">
                {/* Header */}
                <div className="mb-8 text-center">
                    <Badge variant="outline" className="mb-4">
                        <Briefcase className="h-3 w-3 mr-1 text-primary" />
                        Top Tech Companies Hiring
                    </Badge>
                    <h1 className="text-3xl md:text-5xl font-bold mb-4">
                        Find Your Dream Job
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Apply directly to top tech companies. No middlemen.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { icon: Briefcase, label: "Active Jobs", value: "1,204" },
                        { icon: Building2, label: "Tech Companies", value: "450+" },
                        { icon: Zap, label: "New Today", value: "85" },
                        { icon: TrendingUp, label: "Avg Salary", value: "$165K" },
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

                {/* Search */}
                <Card className="mb-8">
                    <CardContent className="p-6">
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="relative md:col-span-2">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by role, company (e.g. Vercel, OpenAI)..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Location..."
                                    value={locationFilter}
                                    onChange={(e) => setLocationFilter(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Filters Sidebar */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Filter className="h-5 w-5" />
                                    Filters
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h4 className="font-medium mb-3">Work Type</h4>
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="remote"
                                                checked={filters.remote}
                                                onCheckedChange={(checked) => setFilters(f => ({ ...f, remote: !!checked }))}
                                            />
                                            <Label htmlFor="remote" className="text-sm flex items-center gap-2">
                                                <Home className="h-4 w-4" />
                                                Remote Only
                                            </Label>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-medium mb-3">Employment Type</h4>
                                    <div className="space-y-2">
                                        {[
                                            { id: "fullTime", label: "Full-time" },
                                            { id: "partTime", label: "Part-time" },
                                            { id: "contract", label: "Contract" },
                                        ].map((type) => (
                                            <div key={type.id} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={type.id}
                                                    checked={filters[type.id as keyof typeof filters]}
                                                    onCheckedChange={(checked) => setFilters(f => ({ ...f, [type.id]: !!checked }))}
                                                />
                                                <Label htmlFor={type.id} className="text-sm">{type.label}</Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Job Alerts */}
                        <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/30">
                            <CardContent className="p-4 text-center">
                                <Zap className="h-8 w-8 mx-auto mb-2 text-primary" />
                                <h4 className="font-semibold mb-1">Create Job Alert</h4>
                                <p className="text-xs text-muted-foreground mb-3">
                                    Get the latest jobs sent to your inbox
                                </p>
                                <Button size="sm" className="w-full">Notify Me</Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Jobs List */}
                    <div className="lg:col-span-3 space-y-4">
                        <div className="flex items-center justify-between">
                            <p className="text-muted-foreground">
                                Showing <span className="font-medium text-foreground">{filteredJobs.length}</span> active listings
                            </p>
                            <select className="px-3 py-1 rounded-lg border border-border bg-background text-sm">
                                <option>Recommended</option>
                                <option>Newest</option>
                                <option>Salary (High-Low)</option>
                            </select>
                        </div>

                        {filteredJobs.map((job) => (
                            <Card
                                key={job.id}
                                className={cn(
                                    "hover:border-primary/50 transition-all group relative overflow-hidden border-l-4",
                                    job.isAd ? "border-l-yellow-500 bg-yellow-500/5" : "border-l-transparent hover:border-l-primary"
                                )}
                            >
                                {job.isAd && (
                                    <div className="absolute top-0 right-0 bg-yellow-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-bl">
                                        Promoted
                                    </div>
                                )}
                                <CardContent className="p-5">
                                    <div className="flex gap-4">
                                        {/* Company Logo Placeholder */}
                                        <div className="w-16 h-16 rounded-lg bg-white dark:bg-muted border flex items-center justify-center shrink-0 shadow-sm">
                                            {job.company.name.charAt(0) && (
                                                <span className="text-2xl font-bold bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent">
                                                    {job.company.name.charAt(0)}
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                                        {job.featured && !job.isAd && (
                                                            <Badge className="bg-primary text-primary-foreground text-xs hover:bg-primary/90">
                                                                Featured
                                                            </Badge>
                                                        )}
                                                        {job.urgent && (
                                                            <Badge variant="destructive" className="text-xs">
                                                                Urgent Hiring
                                                            </Badge>
                                                        )}
                                                        {job.remote && (
                                                            <Badge variant="secondary" className="text-xs">
                                                                Remote
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                                                        {job.title}
                                                    </h3>
                                                    <p className="text-muted-foreground font-medium text-sm flex items-center gap-1">
                                                        {job.company.name}
                                                        {job.isAd && <span className="text-xs font-normal text-muted-foreground/70">• Sponsored</span>}
                                                    </p>
                                                </div>
                                                <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-foreground">
                                                    <Bookmark className="h-5 w-5" />
                                                </Button>
                                            </div>

                                            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3 text-sm text-muted-foreground">
                                                <span className="flex items-center gap-1.5">
                                                    <MapPin className="h-4 w-4" />
                                                    {job.location}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <Briefcase className="h-4 w-4" />
                                                    {job.type}
                                                </span>
                                                <span className="flex items-center gap-1.5 text-foreground font-medium">
                                                    <DollarSign className="h-4 w-4 text-green-500" />
                                                    {formatSalary(job)}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <Clock className="h-4 w-4" />
                                                    {job.postedAt}
                                                </span>
                                            </div>

                                            <div className="flex flex-wrap gap-2 mt-4">
                                                {job.skills.map((skill, i) => (
                                                    <Badge key={i} variant="outline" className="text-xs font-normal bg-background/50">
                                                        {skill}
                                                    </Badge>
                                                ))}
                                            </div>

                                            <div className="flex items-center justify-end mt-4 pt-4 border-t border-border/50">
                                                <Button asChild className="font-semibold shadow-lg hover:shadow-xl transition-all">
                                                    <a
                                                        href={job.applicationUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        Apply on Company Site
                                                        <ExternalLink className="h-4 w-4 ml-2" />
                                                    </a>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {/* Load More */}
                        <div className="text-center pt-8">
                            <Button variant="secondary" size="lg" className="px-8">
                                Load More Jobs
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Jobs;
