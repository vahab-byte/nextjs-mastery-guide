import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Check,
    Zap,
    Crown,
    Building2,
    Users,
    Infinity,
    Shield,
    Headphones,
    BookOpen,
    Award,
    Loader2,
    Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { useState } from "react";

import { api, Plan } from "@/services/api";

const Pricing = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [selectedBilling, setSelectedBilling] = useState<'monthly' | 'yearly'>('monthly');

    const iconMap: Record<string, any> = {
        starter: BookOpen,
        professional: Zap,
        team: Users,
        enterprise: Building2,
    };

    const colorMap: Record<string, string> = {
        starter: "muted",
        professional: "primary",
        team: "secondary",
        enterprise: "accent",
    };

    // Fetch plans from API
    const { data: plans = [], isLoading: plansLoading } = useQuery<Plan[]>({
        queryKey: ['plans'],
        queryFn: async () => api.pricing.getPlans()
    });

    // Fetch user subscription
    const { data: subscription, isLoading: subLoading } = useQuery({
        queryKey: ['subscription', user?.id],
        queryFn: async () => api.pricing.getSubscription(user?.id),
        enabled: !!user?.id
    });

    // Subscribe mutation
    const subscribeMutation = useMutation({
        mutationFn: async (planId: string) => {
            if (!user?.id) throw new Error("User not found");
            return api.pricing.subscribe(user.id, planId, selectedBilling);
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['subscription'] });
            toast.success(data.message || 'Successfully subscribed!');
            navigate('/dashboard');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to subscribe');
        }
    });

    const handleSubscribe = (planId: string) => {
        if (!user) {
            toast.info('Please sign in to subscribe');
            navigate('/signin');
            return;
        }
        subscribeMutation.mutate(planId);
    };

    const getColorStyles = (color: string) => {
        const styles: Record<string, { border: string; iconBg: string; badge: string }> = {
            muted: {
                border: "border-muted/50",
                iconBg: "bg-muted",
                badge: "bg-muted text-muted-foreground",
            },
            primary: {
                border: "border-primary/50 shadow-[0_0_30px_hsl(var(--primary)/0.2)]",
                iconBg: "bg-gradient-to-br from-primary to-primary/60",
                badge: "bg-primary text-primary-foreground",
            },
            secondary: {
                border: "border-secondary/50",
                iconBg: "bg-gradient-to-br from-secondary to-secondary/60",
                badge: "bg-secondary text-secondary-foreground",
            },
            accent: {
                border: "border-accent/50",
                iconBg: "bg-gradient-to-br from-accent to-accent/60",
                badge: "bg-accent text-accent-foreground",
            },
        };
        return styles[color] || styles.muted;
    };

    const yearlyDiscount = 0.2; // 20% off for yearly

    const getDisplayPrice = (price: number, planId?: string) => {
        if (planId === 'enterprise') return 'Custom';
        if (price === 0) return 'Free';
        if (selectedBilling === 'yearly') {
            return `$${Math.floor(price * 12 * (1 - yearlyDiscount))}`;
        }
        return `$${price}`;
    };

    const getPeriod = (price: number, period: string) => {
        if (price === 0) return '';
        if (selectedBilling === 'yearly') return '/year';
        return period;
    };

    if (plansLoading) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="flex items-center justify-center pt-32">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="container mx-auto px-4 py-8 pt-24">
                {/* Header */}
                <div className="text-center mb-12">
                    <Badge variant="outline" className="mb-4">
                        <Crown className="h-3 w-3 mr-1 text-accent" />
                        Pricing Plans
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                        Invest in Your Future
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                        Choose the plan that fits your learning goals. All plans include our 30-day money-back guarantee.
                    </p>

                    {/* Billing Toggle */}
                    <div className="flex items-center justify-center gap-4 mt-8">
                        <button
                            onClick={() => setSelectedBilling('monthly')}
                            className={cn(
                                "px-4 py-2 rounded-lg transition-all",
                                selectedBilling === 'monthly'
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                            )}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setSelectedBilling('yearly')}
                            className={cn(
                                "px-4 py-2 rounded-lg transition-all flex items-center gap-2",
                                selectedBilling === 'yearly'
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                            )}
                        >
                            Yearly
                            <Badge className="bg-secondary text-secondary-foreground text-xs">Save 20%</Badge>
                        </button>
                    </div>

                    {/* Current Plan Badge */}
                    {subscription && (
                        <div className="mt-6">
                            <Badge variant="outline" className="text-sm px-4 py-1">
                                <Sparkles className="h-3 w-3 mr-2" />
                                Current Plan: <span className="font-bold ml-1 capitalize">{subscription.plan}</span>
                            </Badge>
                        </div>
                    )}
                </div>

                {/* Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {plans.map((plan) => {
                        const color = colorMap[plan.id] || 'muted';
                        const styles = getColorStyles(color);
                        const Icon = iconMap[plan.id] || BookOpen;
                        const isCurrentPlan = subscription?.plan === plan.id;
                        const isUpgrade = subscription && plans.findIndex(p => p.id === plan.id) > plans.findIndex(p => p.id === subscription.plan);

                        return (
                            <Card
                                key={plan.id}
                                className={cn(
                                    "relative transition-all duration-300 hover:scale-105 bg-card/50 backdrop-blur",
                                    styles.border,
                                    plan.popular && "ring-2 ring-primary",
                                    isCurrentPlan && "ring-2 ring-secondary"
                                )}
                            >
                                {plan.popular && !isCurrentPlan && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                        <Badge className="bg-primary text-primary-foreground shadow-lg whitespace-nowrap">
                                            Most Popular
                                        </Badge>
                                    </div>
                                )}

                                {isCurrentPlan && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                        <Badge className="bg-secondary text-secondary-foreground shadow-lg whitespace-nowrap">
                                            Current Plan
                                        </Badge>
                                    </div>
                                )}

                                <CardHeader className="text-center pb-4">
                                    <div
                                        className={cn(
                                            "w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-4",
                                            styles.iconBg
                                        )}
                                    >
                                        <Icon className="h-7 w-7 text-primary-foreground" />
                                    </div>
                                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                                </CardHeader>

                                <CardContent className="space-y-6">
                                    <div className="text-center">
                                        <span className="text-4xl font-bold">{getDisplayPrice(plan.price, plan.id)}</span>
                                        <span className="text-muted-foreground">{getPeriod(plan.price, plan.period)}</span>
                                        {plan.price > 0 && selectedBilling === 'yearly' && (
                                            <p className="text-xs text-secondary mt-1">
                                                Save ${Math.floor(plan.price * 12 * yearlyDiscount)}/year
                                            </p>
                                        )}
                                    </div>

                                    <ul className="space-y-3">
                                        {plan.features.map((feature, i) => (
                                            <li key={i} className="flex items-center gap-2 text-sm">
                                                <Check className="h-4 w-4 text-secondary shrink-0" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <Button
                                        variant={plan.popular ? "gradient" : "outline"}
                                        className="w-full"
                                        disabled={isCurrentPlan || subscribeMutation.isPending}
                                        onClick={() => handleSubscribe(plan.id)}
                                    >
                                        {subscribeMutation.isPending ? (
                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        ) : null}
                                        {isCurrentPlan
                                            ? "Current Plan"
                                            : plan.id === 'enterprise'
                                                ? "Contact Sales"
                                                : plan.id === 'professional'
                                                    ? "Start 7-Day Trial"
                                                    : isUpgrade
                                                        ? "Upgrade"
                                                        : "Get Started"
                                        }
                                    </Button>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Trust Indicators */}
                <div className="flex flex-wrap justify-center gap-8 pt-8 border-t border-border">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Shield className="h-5 w-5 text-secondary" />
                        <span>30-Day Money Back</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Infinity className="h-5 w-5 text-primary" />
                        <span>Lifetime Updates</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Headphones className="h-5 w-5 text-accent" />
                        <span>Expert Support</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Award className="h-5 w-5 text-secondary" />
                        <span>Certificate Included</span>
                    </div>
                </div>

                {/* FAQ Section */}
                {/* FAQ Section */}
                <div className="mt-16 max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
                    <Accordion type="single" collapsible className="w-full space-y-4">
                        {[
                            {
                                id: "item-1",
                                q: "Can I switch plans anytime?",
                                a: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately."
                            },
                            {
                                id: "item-2",
                                q: "What payment methods do you accept?",
                                a: "We accept all major credit cards, PayPal, and bank transfers for enterprise customers."
                            },
                            {
                                id: "item-3",
                                q: "Is there a free trial?",
                                a: "Yes! The Professional plan comes with a 7-day free trial. No credit card required to start."
                            },
                            {
                                id: "item-4",
                                q: "Can I cancel anytime?",
                                a: "Absolutely. Cancel anytime with no questions asked. You'll retain access until the end of your billing period."
                            }
                        ].map((faq, i) => (
                            <AccordionItem key={i} value={faq.id} className="bg-card/50 px-4 rounded-lg border border-border/50">
                                <AccordionTrigger className="text-left font-semibold hover:no-underline py-4">
                                    {faq.q}
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground pb-4">
                                    {faq.a}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </main>
        </div>
    );
};

export default Pricing;
