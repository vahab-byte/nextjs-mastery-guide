import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, CheckCircle, Sparkles, Gift, Bell } from "lucide-react";
import { toast } from "sonner";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    setIsSubscribed(true);
    toast.success("Successfully subscribed! Check your email for a welcome gift 🎁");
  };

  const benefits = [
    { icon: Gift, text: "Free coding resources weekly" },
    { icon: Bell, text: "Early access to new courses" },
    { icon: Sparkles, text: "Exclusive tips & tutorials" },
  ];

  return (
    <section className="py-16 md:py-24 px-4 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
      
      <div className="container mx-auto max-w-4xl relative z-10">
        <Card className="border-primary/20 bg-card/80 backdrop-blur-xl overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          
          <CardContent className="p-8 md:p-12 relative">
            {!isSubscribed ? (
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-4">
                    <Mail className="h-4 w-4 text-accent" />
                    <span className="text-sm font-medium">Newsletter</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">
                    Level Up Your{" "}
                    <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      Dev Skills
                    </span>
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Join 25,000+ developers getting weekly insights, tutorials, and exclusive resources.
                  </p>
                  <div className="space-y-3">
                    {benefits.map((benefit, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <benefit.icon className="h-4 w-4 text-primary" />
                        </div>
                        <span>{benefit.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <form onSubmit={handleSubscribe} className="space-y-4">
                    <div className="relative">
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-14 pl-12 pr-4 text-base bg-background/50 border-border focus:border-primary"
                        required
                      />
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    </div>
                    <Button 
                      type="submit" 
                      variant="hero" 
                      className="w-full h-14 text-base font-semibold"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Subscribing...
                        </span>
                      ) : (
                        <>
                          Subscribe Now
                          <Sparkles className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      No spam, ever. Unsubscribe anytime.
                    </p>
                  </form>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center animate-[scale-in_0.3s_ease-out]">
                  <CheckCircle className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">You're In! 🎉</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Welcome to the community! Check your inbox for a welcome email with your free resources.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default NewsletterSection;
