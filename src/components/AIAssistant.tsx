import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Bot,
  Send,
  Sparkles,
  Code2,
  BookOpen,
  Lightbulb,
  Loader2,
  User,
  Zap,
  Copy,
  Check,
  Trash2,
  RotateCcw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AIAssistantProps {
  className?: string;
  variant?: "compact" | "full";
  context?: {
    currentModule?: string;
    skillLevel?: string;
  };
}

const CHAT_URL = `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/chat`;

const AIAssistant = ({ className, variant = "full", context }: AIAssistantProps) => {
  // ... (keep existing state)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "👋 Hello! I'm your **AI Learning Assistant** powered by advanced AI. I can help you with:\n\n- 📚 **Explaining Next.js concepts**\n- 🔧 **Debugging code issues**\n- 💡 **Best practices & patterns**\n- 🎯 **Learning roadmap guidance**\n\nAsk me anything about Next.js, React, or web development!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const quickPrompts = [
    { icon: Code2, label: "Server Components", prompt: "Explain React Server Components in Next.js with examples" },
    { icon: Lightbulb, label: "Best Practices", prompt: "What are the best practices for data fetching in Next.js 15?" },
    { icon: BookOpen, label: "SSR vs SSG", prompt: "Compare SSR and SSG in Next.js. When should I use each?" },
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const apiMessages = messages
      .filter(m => m.id !== "1")
      .concat(userMessage)
      .map(m => ({ role: m.role, content: m.content }));

    const assistantId = (Date.now() + 1).toString();

    try {
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // No Authorization header needed for local dev, or add if you implement auth middleware
        },
        body: JSON.stringify({
          messages: apiMessages,
          context: context || { currentModule: "General", skillLevel: "intermediate" },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
      }

      const data = await response.json();
      const assistantContent = data.response;

      setMessages((prev) => [...prev, {
        id: assistantId,
        role: "assistant",
        content: assistantContent,
        timestamp: new Date(),
      }]);

    } catch (error: any) {
      console.error("AI Chat Error:", error);
      toast.error(error.message || "Failed to get AI response");

      setMessages((prev) => [...prev, {
        id: assistantId,
        role: "assistant",
        content: `❌ ${error.message || "I'm having trouble connecting. Please try again."}`,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, context]);

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
    textareaRef.current?.focus();
  };

  const copyMessage = async (content: string, id: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    setMessages([{
      id: "1",
      role: "assistant",
      content: "👋 Hello! I'm your **AI Learning Assistant** powered by advanced AI. I can help you with:\n\n- 📚 **Explaining Next.js concepts**\n- 🔧 **Debugging code issues**\n- 💡 **Best practices & patterns**\n- 🎯 **Learning roadmap guidance**\n\nAsk me anything about Next.js, React, or web development!",
      timestamp: new Date(),
    }]);
    toast.info("Chat cleared");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (variant === "compact") {
    return (
      <Card className={cn("border-primary/20 bg-card/50 backdrop-blur", className)}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center animate-pulse">
              <Bot className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold">AI Assistant</h3>
              <p className="text-xs text-muted-foreground">Powered by Gemini</p>
            </div>
            <Sparkles className="h-4 w-4 text-accent ml-auto" />
          </div>
          <div className="flex gap-2">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about Next.js..."
              className="flex-1 min-h-[40px] max-h-[100px] resize-none"
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              rows={1}
            />
            <Button size="icon" onClick={handleSend} disabled={isLoading || !input.trim()}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("border-primary/20 bg-card/50 backdrop-blur h-[600px] flex flex-col", className)}>
      <CardHeader className="border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center relative">
            <Bot className="h-6 w-6 text-primary-foreground" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full flex items-center justify-center">
              <Zap className="h-2.5 w-2.5 text-primary-foreground" />
            </div>
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg">AI Learning Assistant</CardTitle>
            <p className="text-sm text-muted-foreground">Powered by Gemini • Next.js Expert</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={clearChat} title="Clear chat">
              <Trash2 className="h-4 w-4 text-muted-foreground" />
            </Button>
            <span className="flex items-center gap-1 text-xs text-secondary">
              <span className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
              Online
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3 group",
                  message.role === "user" && "flex-row-reverse"
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                    message.role === "assistant"
                      ? "bg-gradient-to-br from-primary to-secondary"
                      : "bg-muted"
                  )}
                >
                  {message.role === "assistant" ? (
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  ) : (
                    <User className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div
                  className={cn(
                    "rounded-xl px-4 py-3 max-w-[85%] relative",
                    message.role === "assistant"
                      ? "bg-muted/50"
                      : "bg-primary text-primary-foreground"
                  )}
                >
                  <div className={cn(
                    "text-sm prose prose-sm max-w-none",
                    message.role === "assistant" ? "prose-invert" : ""
                  )}>
                    {message.role === "assistant" ? (
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
                        {message.content}
                      </ReactMarkdown>
                    ) : (
                      <span className="whitespace-pre-wrap">{message.content}</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] opacity-50">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    {message.role === "assistant" && message.id !== "1" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => copyMessage(message.content, message.id)}
                      >
                        {copiedId === message.id ? (
                          <Check className="h-3 w-3 text-secondary" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="bg-muted/50 rounded-xl px-4 py-3">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce [animation-delay:0.15s]" />
                    <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce [animation-delay:0.3s]" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-border space-y-3">
          <div className="flex gap-2 flex-wrap">
            {quickPrompts.map((item, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs hover:border-primary/50 transition-colors"
                onClick={() => handleQuickPrompt(item.prompt)}
                disabled={isLoading}
              >
                <item.icon className="h-3 w-3 mr-1" />
                {item.label}
              </Button>
            ))}
          </div>
          <div className="flex gap-2">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about Next.js..."
              className="flex-1 min-h-[44px] max-h-[120px] resize-none"
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              rows={1}
            />
            <Button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="self-end"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIAssistant;
