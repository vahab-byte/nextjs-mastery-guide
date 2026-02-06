import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Bookmark,
    BookmarkCheck,
    Trash2,
    ExternalLink,
    Clock,
    Sparkles,
    FolderOpen
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface BookmarkItem {
    id: string;
    moduleId: string;
    title: string;
    type: "lesson" | "note" | "code";
    savedAt: string;
    progress?: number;
}

const BookmarksPanel = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
    const [filter, setFilter] = useState<"all" | "lesson" | "note" | "code">("all");

    useEffect(() => {
        // Load bookmarks from localStorage
        const saved = localStorage.getItem(`bookmarks_${user?.id}`);
        if (saved) {
            setBookmarks(JSON.parse(saved));
        } else {
            // Demo bookmarks
            setBookmarks([
                {
                    id: "1",
                    moduleId: "nextjs-1",
                    title: "Next.js Fundamentals",
                    type: "lesson",
                    savedAt: new Date(Date.now() - 86400000).toISOString(),
                    progress: 65
                },
                {
                    id: "2",
                    moduleId: "nextjs-2",
                    title: "Server Components Deep Dive",
                    type: "lesson",
                    savedAt: new Date(Date.now() - 172800000).toISOString(),
                    progress: 30
                },
                {
                    id: "3",
                    moduleId: "nextjs-3",
                    title: "API Routes Best Practices",
                    type: "note",
                    savedAt: new Date(Date.now() - 259200000).toISOString()
                },
                {
                    id: "4",
                    moduleId: "nextjs-4",
                    title: "Custom useAuth Hook",
                    type: "code",
                    savedAt: new Date(Date.now() - 345600000).toISOString()
                }
            ]);
        }
    }, [user?.id]);

    const handleRemoveBookmark = (id: string) => {
        const updated = bookmarks.filter(b => b.id !== id);
        setBookmarks(updated);
        localStorage.setItem(`bookmarks_${user?.id}`, JSON.stringify(updated));
        toast.success("Bookmark removed");
    };

    const handleOpenBookmark = (bookmark: BookmarkItem) => {
        navigate(`/lesson/${bookmark.moduleId}`);
    };

    const filteredBookmarks = bookmarks.filter(b =>
        filter === "all" ? true : b.type === filter
    );

    const getRelativeTime = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Yesterday";
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString();
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case "lesson": return "bg-primary/10 text-primary border-primary/30";
            case "note": return "bg-secondary/10 text-secondary border-secondary/30";
            case "code": return "bg-accent/10 text-accent border-accent/30";
            default: return "bg-muted text-muted-foreground";
        }
    };

    return (
        <Card className="bg-card/50 backdrop-blur">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-accent/10">
                            <BookmarkCheck className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">Bookmarks</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                {bookmarks.length} saved items
                            </p>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Filter Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {[
                        { id: "all", label: "All" },
                        { id: "lesson", label: "Lessons" },
                        { id: "note", label: "Notes" },
                        { id: "code", label: "Code" }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setFilter(tab.id as typeof filter)}
                            className={cn(
                                "px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                                filter === tab.id
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Bookmarks List */}
                <ScrollArea className="h-[300px] pr-4">
                    {filteredBookmarks.length > 0 ? (
                        <div className="space-y-3">
                            {filteredBookmarks.map((bookmark) => (
                                <div
                                    key={bookmark.id}
                                    className="group p-3 rounded-lg border border-border hover:border-primary/30 hover:bg-primary/5 transition-all"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Badge variant="outline" className={cn("text-xs", getTypeColor(bookmark.type))}>
                                                    {bookmark.type}
                                                </Badge>
                                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {getRelativeTime(bookmark.savedAt)}
                                                </span>
                                            </div>
                                            <h4 className="font-medium text-sm truncate">{bookmark.title}</h4>
                                            {bookmark.progress !== undefined && (
                                                <div className="mt-2">
                                                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                                        <span>Progress</span>
                                                        <span>{bookmark.progress}%</span>
                                                    </div>
                                                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-primary to-secondary transition-all"
                                                            style={{ width: `${bookmark.progress}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => handleOpenBookmark(bookmark)}
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-destructive hover:text-destructive"
                                                onClick={() => handleRemoveBookmark(bookmark.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="p-4 rounded-full bg-muted/50 mb-4">
                                <FolderOpen className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <p className="text-muted-foreground">No bookmarks yet</p>
                            <p className="text-sm text-muted-foreground/70">
                                Save lessons, notes, or code snippets for quick access
                            </p>
                        </div>
                    )}
                </ScrollArea>
            </CardContent>
        </Card>
    );
};

export default BookmarksPanel;
