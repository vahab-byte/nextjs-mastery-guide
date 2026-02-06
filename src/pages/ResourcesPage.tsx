import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, FileCode, FileText, Image, ExternalLink, Copy } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const ResourcesPage = () => {
    const resources = [
        {
            category: "Cheat Sheets",
            items: [
                {
                    title: "Next.js 15 Cheat Sheet",
                    desc: "Complete reference for App Router, Server Actions, and API Routes.",
                    type: "PDF",
                    size: "2.4 MB",
                    icon: FileText
                },
                {
                    title: "TypeScript Utility Types",
                    desc: "Visual guide to Pick, Omit, Partial, Record, and more.",
                    type: "PDF",
                    size: "1.8 MB",
                    icon: FileText
                },
                {
                    title: "Tailwind CSS Quick Ref",
                    desc: "All utility classes organized by category for rapid development.",
                    type: "PDF",
                    size: "3.1 MB",
                    icon: FileText
                }
            ]
        },
        {
            category: "Project Templates",
            items: [
                {
                    title: "SaaS Starter Kit",
                    desc: "Next.js 15, Prisma, Stripe, and Auth.js ready to deploy.",
                    type: "GitHub",
                    stars: "1.2k",
                    icon: FileCode
                },
                {
                    title: "Modern Blog Template",
                    desc: "MDX-powered blog with SEO optimization and dark mode.",
                    type: "GitHub",
                    stars: "850",
                    icon: FileCode
                },
                {
                    title: "E-commerce Storefront",
                    desc: "Headless Shopify starter with cart and checkout logic.",
                    type: "GitHub",
                    stars: "2.5k",
                    icon: FileCode
                }
            ]
        },
        {
            category: "Asset Kits",
            items: [
                {
                    title: "3D Icon Pack",
                    desc: "200+ rendered 3D icons in PNG and GLTF formats.",
                    type: "ZIP",
                    size: "150 MB",
                    icon: Image
                },
                {
                    title: "Wireframe UI Kit",
                    desc: "Figma components for rapid prototyping Next.js apps.",
                    type: "FIG",
                    size: "45 MB",
                    icon: Image
                }
            ]
        },
        {
            category: "Reference Books",
            items: [
                {
                    title: "Pro Next.js 14",
                    desc: "Deep dive into App Router and Server Actions. By Vercel team.",
                    type: "E-Book",
                    size: "EPUB",
                    icon: FileText
                },
                {
                    title: "React Design Patterns",
                    desc: "Best practices for scalable React applications.",
                    type: "Fhysical",
                    size: "Amazon",
                    icon: FileText
                },
                {
                    title: "Fullstack Typescript",
                    desc: "From zero to production with Node.js and React.",
                    type: "PDF",
                    size: "12 MB",
                    icon: FileText
                }
            ]
        }
    ];

    const handleDownload = (title: string) => {
        toast.success(`Downloading ${title}...`);
    };

    return (
        <div className="min-h-screen bg-background relative">
            <Navbar />

            <div className="container mx-auto px-4 pt-24 pb-12">
                <div className="mb-6">
                    <Button variant="ghost" asChild className="pl-0 gap-2">
                        <Link to="/">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Home
                        </Link>
                    </Button>
                </div>

                <div className="text-center mb-16">
                    <Badge variant="secondary" className="mb-4">Developer Tools</Badge>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Resource Library</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Curated collection of cheat sheets, templates, and assets to accelerate your Next.js development workflow.
                    </p>
                </div>

                {resources.map((section, idx) => (
                    <div key={idx} className="mb-16 last:mb-0">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <span className="w-1 h-8 bg-primary rounded-full"></span>
                            {section.category}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {section.items.map((item: any, i) => (
                                <Card key={i} className="hover:border-primary/50 transition-all hover:shadow-lg group bg-card/50 backdrop-blur">
                                    <CardHeader>
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                                <item.icon className="h-5 w-5" />
                                            </div>
                                            <Badge variant="outline" className="text-xs">
                                                {item.type}
                                                {item.size && ` • ${item.size}`}
                                                {item.stars && ` • ${item.stars} ⭐`}
                                            </Badge>
                                        </div>
                                        <CardTitle className="text-lg">{item.title}</CardTitle>
                                        <CardDescription>{item.desc}</CardDescription>
                                    </CardHeader>
                                    <CardFooter>
                                        <Button className="w-full gap-2" variant="secondary" onClick={() => handleDownload(item.title)}>
                                            {item.type === "GitHub" ? <ExternalLink className="h-4 w-4" /> : <Download className="h-4 w-4" />}
                                            {item.type === "GitHub" ? "View Repo" : "Download Now"}
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </div>
                ))}

                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 md:p-12 text-center mt-12">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">Want to contribute?</h2>
                    <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                        We love community contributions! Submit your templates or guides to our open-source repository.
                    </p>
                    <Button size="lg" className="gap-2">
                        <ExternalLink className="h-4 w-4" />
                        Submit a Resource
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ResourcesPage;
