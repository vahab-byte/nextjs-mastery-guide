import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
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
  Video,
  Code2,
  Award
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface PricingSectionProps {
  className?: string;
}

const PricingSection = ({ className }: PricingSectionProps) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      id: "starter",
      name: "Starter",
      price: 0,
      description: "Perfect for exploring the basics",
      icon: BookOpen,
      color: "muted",
      popular: false,
      features: [
        "5 Free Lessons",
        "Basic Code Editor",
        "Community Forum Access",
        "Email Support",
      ],
      cta: "Start Free",
      ctaVariant: "outline" as const,
    },
    {
      id: "professional",
      name: "Professional",
      price: 49,
      description: "Best for individual developers",
      icon: Zap,
      color: "primary",
      popular: true,
      features: [
        "All 62+ Lessons",
        "Live Code Editor",
        "HD Video Content",
        "AI Learning Assistant",
        "Practice Exams",
        "Certification Included",
        "Priority Support",
      ],
      cta: "Start 7-Day Trial",
      ctaVariant: "gradient" as const,
    },
    {
      id: "team",
      name: "Team",
      price: 199,
      description: "For growing development teams",
      icon: Users,
      color: "secondary",
      popular: false,
      features: [
        "Everything in Professional",
        "Up to 10 Team Members",
        "Team Analytics Dashboard",
        "Custom Learning Paths",
        "Dedicated Success Manager",
        "Slack Integration",
      ],
      cta: "Contact Sales",
      ctaVariant: "outline" as const,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: 0, // Custom
      description: "For large organizations",
      icon: Building2,
      color: "accent",
      popular: false,
      features: [
        "Unlimited Team Members",
        "SSO & Advanced Security",
        "Custom Content & Branding",
        "API Access",
        "On-premise Deployment",
        "24/7 Phone Support",
        "SLA Guarantee",
      ],
      cta: "Talk to Sales",
      ctaVariant: "outline" as const,
    },
  ];

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

  const getPrice = (basePrice: number) => {
    if (basePrice === 0) return basePrice;
    if (billingCycle === 'yearly') {
      return Math.floor(basePrice * 12 * 0.8); // 20% discount
    }
    return basePrice;
  };

  const formatPrice = (price: number, planId: string) => {
    if (planId === 'enterprise') return 'Custom';
    if (price === 0) return 'Free';
    return `$${price}`;
  };

  const getPeriod = (price: number, planId: string) => {
    if (planId === 'enterprise' || price === 0) return '';
    return billingCycle === 'yearly' ? '/year' : '/month';
  };

  return (
    <div className={cn("space-y-8", className)}>
      <div className="text-center">
        <Badge variant="outline" className="mb-4">
          <Crown className="h-3 w-3 mr-1 text-accent" />
          Pricing Plans
        </Badge>
        <h2 className="text-3xl md:text-4xl font-bold mb-3">
          Invest in Your Future
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
          Choose the plan that fits your learning goals. All plans include our 30-day money-back guarantee.
        </p>

        {/* Toggle */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={cn(
              "px-4 py-2 rounded-lg transition-all text-sm font-medium",
              billingCycle === 'monthly'
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-muted hover:bg-muted/80 text-muted-foreground"
            )}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={cn(
              "px-4 py-2 rounded-lg transition-all text-sm font-medium flex items-center gap-2",
              billingCycle === 'yearly'
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-muted hover:bg-muted/80 text-muted-foreground"
            )}
          >
            Yearly
            <Badge variant="secondary" className="text-[10px] h-5 px-1.5 bg-background/20 text-foreground">
              Save 20%
            </Badge>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan, index) => {
          const styles = getColorStyles(plan.color);
          const Icon = plan.icon;
          const price = getPrice(plan.price);

          return (
            <Card
              key={index}
              className={cn(
                "relative transition-all duration-300 hover:scale-105 bg-card/50 backdrop-blur flex flex-col",
                styles.border,
                plan.popular && "ring-2 ring-primary scale-105 md:scale-110 z-10"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground shadow-lg">
                    Most Popular
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

              <CardContent className="space-y-6 flex-1 flex flex-col">
                <div className="text-center">
                  <span className="text-4xl font-bold">{formatPrice(price, plan.id)}</span>
                  <span className="text-muted-foreground">{getPeriod(price, plan.id)}</span>
                  {billingCycle === 'yearly' && plan.price > 0 && plan.id !== 'enterprise' && (
                    <p className="text-xs text-green-500 font-medium mt-1">
                      Save ${Math.floor(plan.price * 12 * 0.2)}/year
                    </p>
                  )}
                </div>

                <ul className="space-y-3 mb-6 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.ctaVariant}
                  className="w-full mt-auto"
                  asChild
                >
                  <Link to={plan.price === 0 ? "/curriculum" : "/pricing"}>{plan.cta}</Link>
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
    </div>
  );
};

export default PricingSection;
