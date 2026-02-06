import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronDown, 
  ChevronUp, 
  HelpCircle,
  MessageCircle,
  Mail,
  FileText
} from "lucide-react";

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Is this course suitable for beginners?",
      answer: "Yes! While we cover advanced topics, our curriculum starts from the fundamentals. Whether you're new to React or an experienced developer, you'll find valuable content tailored to your skill level. Each module includes prerequisite checks to ensure you're ready.",
    },
    {
      question: "How long do I have access to the course?",
      answer: "You get lifetime access to all course content, including future updates. As Next.js evolves, we continuously update our materials to reflect the latest features and best practices. No recurring fees—pay once, learn forever.",
    },
    {
      question: "Do I get a certificate upon completion?",
      answer: "Absolutely! Upon completing the course and passing the final assessment, you'll receive a verified certificate that you can share on LinkedIn and include in your resume. Our certificates are recognized by top tech companies.",
    },
    {
      question: "What if I'm not satisfied with the course?",
      answer: "We offer a 30-day money-back guarantee, no questions asked. If the course doesn't meet your expectations, simply reach out to our support team for a full refund. We're confident you'll love the content.",
    },
    {
      question: "Can I learn at my own pace?",
      answer: "Yes! All content is available on-demand, allowing you to learn whenever it fits your schedule. There are no deadlines or live sessions required. However, we do offer optional live Q&A sessions for those who want real-time interaction.",
    },
    {
      question: "Is there community support available?",
      answer: "Yes! You'll get access to our private Discord community with 50,000+ developers. Get help from peers, share your projects, and network with other learners. Our team also provides support within 24 hours.",
    },
  ];

  const supportLinks = [
    { icon: MessageCircle, label: "Live Chat", desc: "Get instant help" },
    { icon: Mail, label: "Email Support", desc: "Response in 24h" },
    { icon: FileText, label: "Documentation", desc: "Detailed guides" },
  ];

  return (
    <section className="py-16 md:py-24 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 border-primary/30">
            <HelpCircle className="h-3 w-3 mr-1" />
            FAQ
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="text-muted-foreground">
            Everything you need to know about the course.
          </p>
        </div>

        <div className="space-y-4 mb-12">
          {faqs.map((faq, i) => (
            <Card 
              key={i} 
              className={`border-border/50 transition-all duration-300 cursor-pointer overflow-hidden ${
                openIndex === i ? "border-primary/30 bg-card/80" : "bg-card/50 hover:bg-card/70"
              }`}
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            >
              <CardContent className="p-0">
                <div className="flex items-center justify-between p-5">
                  <h3 className="font-semibold text-left pr-4">{faq.question}</h3>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    openIndex === i ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}>
                    {openIndex === i ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </div>
                <div className={`overflow-hidden transition-all duration-300 ${
                  openIndex === i ? "max-h-48" : "max-h-0"
                }`}>
                  <p className="px-5 pb-5 text-muted-foreground text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Support options */}
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <h3 className="font-bold text-lg mb-2">Still have questions?</h3>
              <p className="text-sm text-muted-foreground">We're here to help!</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {supportLinks.map((link, i) => (
                <Button 
                  key={i} 
                  variant="outline" 
                  className="h-auto py-4 flex-col gap-2 hover:border-primary/50 hover:bg-primary/5"
                >
                  <link.icon className="h-5 w-5 text-primary" />
                  <span className="font-medium text-sm">{link.label}</span>
                  <span className="text-xs text-muted-foreground">{link.desc}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default FAQSection;
