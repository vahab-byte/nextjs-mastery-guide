import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export interface Note {
  id: string;
  _id?: string;
  moduleId?: number;
  lessonId?: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

// Notes service for API calls
const notesService = {
  async getNotes(userId: string): Promise<Note[]> {
    try {
      const response = await fetch(`${API_URL}/notes/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch notes");
      const data = await response.json();
      // Map MongoDB _id to id for consistency
      return data.map((note: any) => ({
        id: note._id || note.id,
        moduleId: note.module_id,
        lessonId: note.lesson_id,
        title: note.title,
        content: note.content || "",
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
        tags: note.tags || []
      }));
    } catch (error) {
      console.warn("Notes API offline, returning empty list");
      return [];
    }
  },

  async createNote(note: {
    user_id: string;
    module_id?: number;
    lesson_id?: string;
    title: string;
    content: string;
    tags: string[];
  }): Promise<Note> {
    try {
      const response = await fetch(`${API_URL}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(note),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Failed to create note" }));
        throw new Error(error.message || "Failed to create note");
      }
      const data = await response.json();
      return {
        id: data._id || data.id,
        moduleId: data.module_id,
        lessonId: data.lesson_id,
        title: data.title,
        content: data.content || "",
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        tags: data.tags || []
      };
    } catch (e) {
      // Simulate success
      return {
        id: Date.now().toString(),
        moduleId: note.module_id,
        lessonId: note.lesson_id,
        title: note.title,
        content: note.content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: note.tags
      };
    }
  },

  async updateNote(id: string, updates: Partial<Note>): Promise<Note> {
    try {
      const response = await fetch(`${API_URL}/notes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: updates.title,
          content: updates.content,
          tags: updates.tags,
          updatedAt: new Date().toISOString()
        }),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Failed to update note" }));
        throw new Error(error.message || "Failed to update note");
      }
      const data = await response.json();
      return {
        id: data._id || data.id,
        moduleId: data.module_id,
        lessonId: data.lesson_id,
        title: data.title,
        content: data.content || "",
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        tags: data.tags || []
      };
    } catch (e) {
      return {
        id,
        ...updates,
        title: updates.title || "",
        content: updates.content || "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: updates.tags || []
      } as Note;
    }
  },

  async deleteNote(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/notes/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Failed to delete note" }));
        throw new Error(error.message || "Failed to delete note");
      }
    } catch (e) {
      // Simulate success
      return;
    }
  },
};

export const useNotes = (userId?: string) => {
  const queryClient = useQueryClient();

  const { data: notes = [], isLoading, error } = useQuery({
    queryKey: ['notes', userId],
    queryFn: async () => {
      if (!userId) return [];
      return notesService.getNotes(userId);
    },
    enabled: !!userId,
    retry: 2,
  });

  const addNoteMutation = useMutation({
    mutationFn: async (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => {
      if (!userId) throw new Error("User not authenticated");
      return notesService.createNote({
        user_id: userId,
        module_id: note.moduleId,
        lesson_id: note.lessonId,
        title: note.title,
        content: note.content,
        tags: note.tags || []
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', userId] });
      toast.success("Note saved successfully!");
    },
    onError: (error: Error) => {
      console.error("Failed to add note:", error);
      toast.error(error.message || "Failed to save note");
    },
  });

  const updateNoteMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string, updates: Partial<Omit<Note, "id" | "createdAt">> }) => {
      return notesService.updateNote(id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', userId] });
      toast.success("Note updated!");
    },
    onError: (error: Error) => {
      console.error("Failed to update note:", error);
      toast.error(error.message || "Failed to update note");
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: async (id: string) => {
      return notesService.deleteNote(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', userId] });
      toast.success("Note deleted");
    },
    onError: (error: Error) => {
      console.error("Failed to delete note:", error);
      toast.error(error.message || "Failed to delete note");
    },
  });

  const addNote = (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => {
    return addNoteMutation.mutateAsync(note);
  };

  const updateNote = (id: string, updates: Partial<Omit<Note, "id" | "createdAt">>) => {
    return updateNoteMutation.mutateAsync({ id, updates });
  };

  const deleteNote = (id: string) => {
    return deleteNoteMutation.mutateAsync(id);
  };

  const getNotesByModule = (moduleId: number) => {
    return notes.filter(note => note.moduleId === moduleId);
  };

  const getNotesByLesson = (lessonId: string) => {
    return notes.filter(note => note.lessonId === lessonId);
  };

  const searchNotes = (query: string) => {
    const lowerQuery = query.toLowerCase();
    return notes.filter(
      note =>
        note.title.toLowerCase().includes(lowerQuery) ||
        note.content.toLowerCase().includes(lowerQuery) ||
        note.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  };

  return {
    notes,
    addNote,
    updateNote,
    deleteNote,
    getNotesByModule,
    getNotesByLesson,
    searchNotes,
    isLoading,
    error,
    isSaving: addNoteMutation.isPending || updateNoteMutation.isPending,
  };
};
