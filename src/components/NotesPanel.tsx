import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNotes, Note } from "@/hooks/useNotes";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Notebook,
  Plus,
  Search,
  Trash2,
  Edit2,
  Clock,
  Tag,
  X,
  Save,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface NotesPanelProps {
  moduleId?: number;
  lessonId?: string;
  compact?: boolean;
}

const NotesPanel = ({ moduleId, lessonId, compact = false }: NotesPanelProps) => {
  const { user } = useAuth();
  const { notes, addNote, updateNote, deleteNote, searchNotes } = useNotes(user?.id);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [newNote, setNewNote] = useState({ title: "", content: "", tags: "" });

  const filteredNotes = searchQuery ? searchNotes(searchQuery) : notes;
  const displayNotes = compact ? filteredNotes.slice(0, 3) : filteredNotes;

  const handleAddNote = () => {
    if (!newNote.title.trim() || !newNote.content.trim()) {
      toast.error("Please fill in title and content");
      return;
    }

    addNote({
      title: newNote.title.trim(),
      content: newNote.content.trim(),
      tags: newNote.tags.split(",").map(t => t.trim()).filter(Boolean),
      moduleId,
      lessonId,
    });

    setNewNote({ title: "", content: "", tags: "" });
    setIsAddingNote(false);
    toast.success("Note added!");
  };

  const handleUpdateNote = () => {
    if (!editingNote) return;

    updateNote(editingNote.id, {
      title: editingNote.title,
      content: editingNote.content,
      tags: editingNote.tags,
    });

    setEditingNote(null);
    toast.success("Note updated!");
  };

  const handleDeleteNote = (id: string) => {
    deleteNote(id);
    toast.success("Note deleted");
  };

  return (
    <Card className={compact ? "border-primary/10" : ""}>
      <CardHeader className={compact ? "pb-2" : ""}>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Notebook className="h-5 w-5 text-primary" />
              {compact ? "Recent Notes" : "Learning Notes"}
            </CardTitle>
            {!compact && (
              <CardDescription>
                {notes.length} notes • Keep track of your learning insights
              </CardDescription>
            )}
          </div>
          <Dialog open={isAddingNote} onOpenChange={setIsAddingNote}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Plus className="h-4 w-4" />
                {!compact && "Add Note"}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Note</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Input
                    placeholder="Note title"
                    value={newNote.title}
                    onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Textarea
                    placeholder="Write your note..."
                    value={newNote.content}
                    onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                    rows={6}
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    placeholder="Tags (comma separated)"
                    value={newNote.tags}
                    onChange={(e) => setNewNote({ ...newNote, tags: e.target.value })}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddingNote(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddNote}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Note
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {!compact && (
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        )}
      </CardHeader>

      <CardContent>
        {displayNotes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Notebook className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p className="text-sm">No notes yet</p>
            <p className="text-xs">Start taking notes to track your learning!</p>
          </div>
        ) : (
          <ScrollArea className={compact ? "h-auto" : "h-[400px]"}>
            <div className="space-y-3">
              {displayNotes.map((note) => (
                <div
                  key={note.id}
                  className="p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-medium text-sm line-clamp-1">{note.title}</h4>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => setEditingNote(note)}
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-destructive"
                        onClick={() => handleDeleteNote(note.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                    {note.content}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1 flex-wrap">
                      {note.tags.slice(0, 2).map((tag, i) => (
                        <Badge key={i} variant="secondary" className="text-[10px] px-1.5 py-0">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {format(new Date(note.updatedAt), "MMM d")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        {compact && notes.length > 3 && (
          <Button variant="ghost" className="w-full mt-3 text-xs">
            View all {notes.length} notes
          </Button>
        )}
      </CardContent>

      {/* Edit Dialog */}
      <Dialog open={!!editingNote} onOpenChange={() => setEditingNote(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Note</DialogTitle>
          </DialogHeader>
          {editingNote && (
            <div className="space-y-4 pt-4">
              <Input
                placeholder="Note title"
                value={editingNote.title}
                onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
              />
              <Textarea
                placeholder="Write your note..."
                value={editingNote.content}
                onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                rows={6}
              />
              <Input
                placeholder="Tags (comma separated)"
                value={editingNote.tags.join(", ")}
                onChange={(e) =>
                  setEditingNote({
                    ...editingNote,
                    tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean),
                  })
                }
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingNote(null)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateNote}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default NotesPanel;
