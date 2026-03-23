import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { lazy, Suspense } from "react";
// Lazy load heavy components
const AIAssistant = lazy(() => import("@/components/AIAssistant"));
const AICodeReview = lazy(() => import("@/components/AICodeReview"));
const RobotModel = lazy(() => import("@/components/RobotModel"));
const ParticleBackground = lazy(() => import("@/components/ParticleBackground"));
const FloatingElements = lazy(() => import("@/components/FloatingElements"));

import TechStack from "@/components/TechStack";
import PricingSection from "@/components/PricingSection";
import PremiumFeatures from "@/components/PremiumFeatures";
import QuickActions from "@/components/QuickActions";
import CountUpNumber from "@/components/CountUpNumber";
import NewsletterSection from "@/components/NewsletterSection";
import SkillsShowcase from "@/components/SkillsShowcase";
import FAQSection from "@/components/FAQSection";
import LiveStatsCounter from "@/components/LiveStatsCounter";
import InteractiveCodePlayground from "@/components/InteractiveCodePlayground";
import CompanyLogos from "@/components/CompanyLogos";
import ProgressTimeline from "@/components/ProgressTimeline";
import CommunityShowcase from "@/components/CommunityShowcase";
import { LearningPathSection, LiveLessonSection, SuccessStoriesSection } from "@/components/HomeFeatures";
import AchievementSystem from "@/components/AchievementSystem";
import { useAuth } from "@/contexts/AuthContext";
import {
  ArrowRight,
  Code2,
  Rocket,
  Zap,
  Trophy,
  Users,
  Shield,
  Globe,
  CheckCircle,
  Play,
  Star,
  TrendingUp,
  Bot,
  BarChart3,
  Award,
  Heart,
  Github,
  Linkedin,
  Mail,
  FileCode
} from "lucide-react";

const Index = () => {
  const { user } = useAuth();
  const testimonials = [
    { name: "Sarah Chen", role: "Senior Developer at Google", text: "This course transformed my career. The depth of content is unmatched.", rating: 5 },
    { name: "Marcus Johnson", role: "Tech Lead at Stripe", text: "Industrial-grade training that prepared me for real-world challenges.", rating: 5 },
    { name: "Elena Rodriguez", role: "Founder, TechStartup", text: "Built our entire platform using skills from this course. Highly recommended!", rating: 5 },
  ];

  const companies = ["Google", "Microsoft", "Meta", "Amazon", "Netflix", "Stripe"];

  const stats = [
    { value: "50,000+", label: "Developers Trained", icon: Users },
    { value: "98%", label: "Completion Rate", icon: TrendingUp },
    { value: "4.9/5", label: "Average Rating", icon: Star },
    { value: "120+", label: "Countries Reached", icon: Globe },
  ];

  const features = [
    { icon: Bot, title: "AI Learning Assistant", desc: "Get instant help with GPT-4 powered tutor", color: "primary" },
    { icon: Code2, title: "Live Code Editor", desc: "Practice with real-time code execution", color: "secondary" },
    { icon: BarChart3, title: "Analytics Dashboard", desc: "Track your progress with detailed insights", color: "accent" },
    { icon: Award, title: "Certifications", desc: "Earn industry-recognized credentials", color: "primary" },
    { icon: Rocket, title: "Learning Paths", desc: "Personalized curriculum for your goals", color: "secondary" },
    { icon: FileCode, title: "Resource Library", desc: "Templates, cheatsheets & asset kits [NEW]", color: "accent" },
  ];

  return (
    <div className="min-h-screen bg-background relative">
      <Suspense fallback={null}>
        <ParticleBackground />
        <FloatingElements />
      </Suspense>
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 md:pt-32 pb-16 md:pb-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent dark:from-blue-950/20 dark:via-purple-950/10 dark:to-transparent transition-colors duration-500" />
        <div className="absolute top-20 left-1/4 w-64 md:w-96 h-64 md:h-96 bg-primary/20 dark:bg-blue-600/20 rounded-full blur-3xl transition-colors duration-500 animate-pulse" />
        <div className="absolute top-40 right-1/4 w-52 md:w-80 h-52 md:h-80 bg-secondary/20 dark:bg-purple-600/20 rounded-full blur-3xl transition-colors duration-500 animate-pulse delay-1000" />

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 md:px-5 py-2 md:py-2.5 mb-6 md:mb-8 hover:bg-primary/20 transition-colors">
                <Zap className="h-4 w-4 text-primary animate-pulse" />
                <span className="text-xs md:text-sm font-semibold">Next.js 15 Complete Course 2026</span>
                <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">NEW</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 md:mb-8 leading-[1.1] tracking-tight">
                Enterprise-Grade{" "}
                <span className="bg-gradient-to-r from-[#0070f3] via-[#7928ca] to-[#ff0080] dark:from-[#3b82f6] dark:via-[#8b5cf6] dark:to-[#ec4899] bg-clip-text text-transparent animate-gradient-x bg-[length:200%_auto]">
                  Next.js
                </span>
                <br />
                <span className="text-foreground/90">Mastery Platform</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground mb-8 md:mb-10 leading-relaxed max-w-xl">
                Industry-leading curriculum with AI-powered learning, live code editors,
                and certifications. Built for ambitious developers.
              </p>

              <div className="flex items-center justify-center lg:justify-start gap-3 md:gap-4 flex-wrap mb-8 md:mb-12">
                <Button variant="hero" size="lg" className="text-base md:text-lg px-6 md:px-8 py-5 md:py-6 h-auto" asChild>
                  <Link to={user ? "/dashboard" : "/signup"}>
                    <Play className="mr-2 h-5 w-5" />
                    {user ? "Go to Dashboard" : "Start Free Trial"}
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="text-base md:text-lg px-6 md:px-8 py-5 md:py-6 h-auto" asChild>
                  <Link to="/curriculum">
                    View Curriculum
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-4 md:gap-6 flex-wrap text-xs md:text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-secondary" />
                  <span>30-Day Money Back</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-secondary" />
                  <span>Lifetime Access</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-accent" />
                  <span>Certificate Included</span>
                </div>
              </div>
            </div>

            {/* 3D Model - Robot with Laptop */}
            <div className="hidden lg:flex justify-center items-center h-[600px] w-full max-w-[600px] -mt-20">
              <Suspense fallback={<div className="h-[600px] w-full flex items-center justify-center text-muted-foreground">Loading 3D Model...</div>}>
                <RobotModel scale={4.5} className="w-full h-full" />
              </Suspense>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions for logged-in users */}
      {user && (
        <section className="py-8 px-4 bg-card/30 border-y border-border">
          <div className="container mx-auto max-w-6xl">
            <h3 className="text-lg font-semibold mb-4 text-center">Quick Actions</h3>
            <QuickActions />
          </div>
        </section>
      )}

      {/* Stats */}
      <section className="py-12 md:py-16 px-4 border-y border-border bg-card/30 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <stat.icon className="h-6 md:h-8 w-6 md:w-8 text-primary mx-auto mb-2 md:mb-3 group-hover:scale-110 transition-transform" />
                <div className="text-2xl md:text-4xl font-bold text-foreground mb-1">
                  <CountUpNumber value={stat.value} />
                </div>
                <div className="text-xs md:text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Logos Marquee */}
      <CompanyLogos />

      {/* Features Grid */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Platform Features</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-4">Industrial-Grade Learning Tools</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <Link key={i} to={
                feature.title === "Resource Library" ? "/resources" :
                  feature.title === "Certifications" ? "/certifications" :
                    feature.title === "Live Code Editor" ? "/code-editor" :
                      "#"
              } className="block h-full cursor-pointer">
                <Card className="border-border/50 hover:border-primary/30 transition-all bg-card/50 backdrop-blur h-full hover:scale-[1.02] duration-300">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.desc}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Paths */}
      <LearningPathSection />

      {/* Live Lesson & Weekly Challenge */}
      <LiveLessonSection />

      {/* Premium Features */}
      <PremiumFeatures />

      {/* Success Stories */}
      <SuccessStoriesSection />

      {/* Achievement & Streak System */}
      <AchievementSystem />

      {/* Tech Stack */}
      <section className="py-16 px-4 bg-card/30">
        <div className="container mx-auto max-w-6xl">
          <TechStack />
        </div>
      </section>

      {/* AI Assistant Preview */}
      <section id="ai-assistant" className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">AI-Powered Tools</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-4">Your Personal AI Tutor & Code Reviewer</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get instant answers, code explanations, and personalized learning recommendations
              powered by Gemini AI. Available 24/7 to help you master Next.js.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Suspense fallback={<div className="h-64 rounded-xl bg-card/50 animate-pulse"></div>}>
                <AIAssistant />
              </Suspense>
            </div>
            <div className="space-y-6">
              <Suspense fallback={<div className="h-64 rounded-xl bg-card/50 animate-pulse"></div>}>
                <AICodeReview />
              </Suspense>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Showcase */}
      <SkillsShowcase />

      {/* Pricing */}
      <section id="pricing" className="py-16 md:py-24 px-4 bg-gradient-to-b from-background to-card/30">
        <div className="container mx-auto max-w-7xl">
          <PricingSection />
        </div>
      </section>

      {/* Newsletter */}
      <NewsletterSection />

      {/* Testimonials */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Testimonials</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-3">What Graduates Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <Card key={i} className="border-border bg-card/50 hover:border-primary/30 transition-all group">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(t.rating)].map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-accent text-accent group-hover:scale-110 transition-transform" style={{ transitionDelay: `${j * 50}ms` }} />
                    ))}
                  </div>
                  <p className="text-foreground/90 mb-4 italic">"{t.text}"</p>
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-sm text-muted-foreground">{t.role}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection />

      {/* CTA */}
      <section className="py-16 md:py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/10" />
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Start Your Journey Today</h2>
          <p className="text-muted-foreground mb-8">Join 50,000+ developers mastering Next.js</p>
          <Button variant="hero" size="lg" className="text-lg px-10 py-6 h-auto group" asChild>
            <Link to="/curriculum">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="border-t border-border py-12 px-4 bg-card/50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                NextJS Mastery
              </h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-sm">
                Enterprise-grade training platform for ambitious developers. Master Next.js with AI-powered learning.
              </p>
              <div className="flex gap-3">
                <a href="https://github.com/vahab-byte" target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-primary/10">
                    <Github className="h-4 w-4" />
                  </Button>
                </a>
                <a href="https://www.linkedin.com/in/abdul-vahab-shaikh-8517a9332" target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-primary/10">
                    <Linkedin className="h-4 w-4" />
                  </Button>
                </a>
                <a href="https://mail.google.com/mail/?view=cm&to=sabdulwahab252@gmail.com" target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-primary/10">
                    <Mail className="h-4 w-4" />
                  </Button>
                </a>
                <a href="https://wa.me/919726885447" target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-green-500/10">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </Button>
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/curriculum" className="hover:text-foreground transition-colors">Curriculum</Link></li>
                <li><Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link></li>
                <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact Us</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">© 2026 NextJS Mastery. All rights reserved.</p>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              Made with <Heart className="h-3 w-3 text-destructive fill-destructive" /> for developers
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
