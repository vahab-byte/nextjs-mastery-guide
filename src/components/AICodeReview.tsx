import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Bot,
  Code2,
  Sparkles,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Info,
  Zap,
  Copy,
  Check
} from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

interface ReviewResult {
  summary: string;
  issues: Array<{
    type: "error" | "warning" | "suggestion";
    message: string;
    line?: number;
  }>;
  score: number;
  improvedCode?: string;
}

const CHAT_URL = `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/chat`;

const AICodeReview = () => {
  // ... (keep existing state)
  const [code, setCode] = useState("");
  const [isReviewing, setIsReviewing] = useState(false);
  const [review, setReview] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const reviewCode = async () => {
    if (!code.trim()) {
      toast.error("Please enter some code to review");
      return;
    }

    setIsReviewing(true);
    setReview(null);

    try {
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // No Authorization header needed for local dev
        },
        body: JSON.stringify({
          messages: [{
            role: "user",
            content: `Review this Next.js/React code and provide feedback. Analyze for:
1. Best practices and patterns
2. Performance issues
3. Security concerns
4. TypeScript improvements
5. Code readability

Provide a score out of 100 and specific recommendations.

Code to review:
\`\`\`
${code}
\`\`\`

Format your response with:
- Overall score (X/100)
- Summary
- Issues found (with severity: 🔴 Error, 🟡 Warning, 🔵 Suggestion)
- Improved code if applicable`
          }],
          context: { currentModule: "Code Review", skillLevel: "advanced" },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
      }

      const data = await response.json();
      setReview(data.response);
      toast.success("Code review complete!");

    } catch (error: any) {
      console.error("Code review error:", error);
      toast.error(error.message || "Failed to review code");
    } finally {
      setIsReviewing(false);
    }
  };

  const copyReview = async () => {
    if (review) {
      await navigator.clipboard.writeText(review);
      setCopied(true);
      toast.success("Review copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card className="border-primary/20 bg-card/50 backdrop-blur">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
            <Code2 className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="flex items-center gap-2">
              AI Code Review
              <Badge variant="secondary" className="gap-1">
                <Sparkles className="h-3 w-3" />
                AI Powered
              </Badge>
            </CardTitle>
            <CardDescription>
              Get instant feedback on your React/Next.js code
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Paste your code</label>
          <Textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={`// Paste your React/Next.js code here
function MyComponent() {
  // ...
}`}
            className="min-h-[200px] font-mono text-sm"
          />
        </div>

        <Button
          onClick={reviewCode}
          disabled={isReviewing || !code.trim()}
          className="w-full"
          variant="gradient"
        >
          {isReviewing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Analyzing Code...
            </>
          ) : (
            <>
              <Zap className="h-4 w-4 mr-2" />
              Review My Code
            </>
          )}
        </Button>

        {review && (
          <div className="space-y-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                AI Review Results
              </h3>
              <Button variant="ghost" size="sm" onClick={copyReview}>
                {copied ? (
                  <Check className="h-4 w-4 text-secondary" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="bg-muted/30 rounded-lg p-4 prose prose-sm prose-invert max-w-none">
              <ReactMarkdown
                components={{
                  pre: ({ children }) => (
                    <pre className="bg-background/80 rounded-md p-3 my-2 overflow-x-auto text-xs">
                      {children}
                    </pre>
                  ),
                  code: ({ children, className }) => {
                    const isBlock = className?.includes("language-");
                    return isBlock ? (
                      <code className="text-xs">{children}</code>
                    ) : (
                      <code className="bg-background/80 px-1.5 py-0.5 rounded text-xs">
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {review}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AICodeReview;
