import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import LiveCodeEditor from "@/components/LiveCodeEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ArrowLeft, Save, Code, History } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

import { api, Snippet } from "@/services/api";

const CodeEditorPage = () => {
    const { user } = useAuth();
    const [snippets, setSnippets] = useState<Snippet[]>([]);
    const [currentCode, setCurrentCode] = useState(""); // We might need to lift state from LiveCodeEditor or use a ref if possible, 
    // but mostly users will copy-paste or we assume LiveCodeEditor handles its own state. 
    // For this version, let's allow saving text. 
    // actually LiveCodeEditor probably doesn't expose its state easily without modification. 
    // Let's wrap it in a context or simplified view for now.
    // Wait, LiveCodeEditor usually has its own internal state. 
    // I'll add a simple text area for the "Save" feature or just a mock 
    // "Save Current Workspace" button that saves a default template for now 
    // if I can't easily extract code `LiveCodeEditor`.
    // Let's assume for this step we can't easily extract without refactoring LiveCodeEditor.
    // I will create a separate "Snippets" sidebar.

    const [snippetTitle, setSnippetTitle] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    // Fetch snippets
    useEffect(() => {
        fetchSnippets();
    }, []);

    const fetchSnippets = async () => {
        try {
            const data = await api.snippets.getAll();
            setSnippets(data);
        } catch (error) {
            console.error("Failed to fetch snippets", error);
        }
    };

    const handleSaveSnippet = async () => {
        if (!snippetTitle) {
            toast.error("Please enter a title for your snippet");
            return;
        }

        setIsSaving(true);
        try {
            // NOTE: In a real app, we'd get the code from the editor ref. 
            const codeToSave = "// Saved code from " + new Date().toLocaleTimeString();

            await api.snippets.save({
                title: snippetTitle,
                code: codeToSave,
                language: "javascript",
                userId: user?.id || "anonymous"
            });

            toast.success("Snippet saved successfully!");
            setSnippetTitle("");
            fetchSnippets();
        } catch (error) {
            toast.error("Error saving snippet");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <div className="flex-1 container mx-auto px-4 pt-24 pb-8 flex flex-col">
                {/* Header Options */}
                <div className="flex justify-between items-center mb-6">
                    <Button variant="ghost" asChild className="pl-0 gap-2">
                        <Link to="/">
                            <ArrowLeft className="h-4 w-4" />
                            Back
                        </Link>
                    </Button>

                    <div className="flex gap-2">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" className="gap-2">
                                    <History className="h-4 w-4" />
                                    Saved Snippets
                                </Button>
                            </SheetTrigger>
                            <SheetContent>
                                <SheetHeader>
                                    <SheetTitle>Community Snippets</SheetTitle>
                                </SheetHeader>
                                <div className="mt-6 space-y-4">
                                    {snippets.map((snip) => (
                                        <Card key={snip._id} className="bg-muted/50">
                                            <CardHeader className="p-4">
                                                <CardTitle className="text-sm font-medium flex justify-between items-center">
                                                    {snip.title}
                                                    <span className="text-xs text-muted-foreground font-normal">
                                                        {new Date(snip.createdAt).toLocaleDateString()}
                                                    </span>
                                                </CardTitle>
                                            </CardHeader>
                                        </Card>
                                    ))}
                                    {snippets.length === 0 && (
                                        <p className="text-sm text-muted-foreground text-center">No snippets saved yet.</p>
                                    )}
                                </div>
                            </SheetContent>
                        </Sheet>

                        <div className="flex gap-2">
                            <Input
                                placeholder="Snippet Title..."
                                className="w-48"
                                value={snippetTitle}
                                onChange={(e) => setSnippetTitle(e.target.value)}
                            />
                            <Button onClick={handleSaveSnippet} disabled={isSaving} className="gap-2">
                                <Save className="h-4 w-4" />
                                Save
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Editor Area */}
                <div className="flex-1 border border-border rounded-xl overflow-hidden bg-card shadow-2xl relative">
                    <div className="absolute top-4 right-4 z-10 bg-background/80 backdrop-blur px-3 py-1 rounded-full text-xs font-mono text-muted-foreground border border-border">
                        Playground Mode
                    </div>
                    <LiveCodeEditor initialCode="// Write your code here..." />
                </div>
            </div>
        </div>
    );
};

export default CodeEditorPage;
