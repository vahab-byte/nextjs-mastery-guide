import { createContext, useContext, useEffect, useState, useRef, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (data: { displayName?: string; avatarUrl?: string; bio?: string; location?: string; website?: string; github?: string; linkedin?: string }) => Promise<{ error: Error | null }>;
  uploadAvatar: (file: File) => Promise<{ url: string | null; error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Sync Supabase user with MongoDB backend
const syncUserToBackend = async (user: User) => {
  try {
    await fetch(`${API_URL}/auth/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.display_name || user.user_metadata?.full_name || user.email?.split('@')[0],
        avatar_url: user.user_metadata?.avatar_url
      })
    });
  } catch (error) {
    // Silent fail for connection refused (backend offline) to avoid console spam
    // Only log if it's not a connection error
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      // Backend likely down, ignore
    } else {
      console.warn('Failed to sync user to backend:', error);
    }
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Track last synced user to prevent duplicate calls
  const lastSyncedUserId = useRef<string | null>(null);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Sync user to MongoDB when logged in, but avoid duplicate calls
        if (session?.user && session.user.id !== lastSyncedUserId.current) {
          lastSyncedUserId.current = session.user.id;
          syncUserToBackend(session.user);
        } else if (!session?.user) {
          lastSyncedUserId.current = null;
        }
      }
    );

    // Get initial session
    // Note: onAuthStateChange usually handles the initial session too, 
    // but explicit getSession is safer for immediate state.
    // We remove the duplicate sync call here and let the listener handle it 
    // or rely on the ref check.
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // We don't need to sync here explicitly if the listener covers it,
      // but to be safe with the Ref check, we can try.
      if (session?.user && session.user.id !== lastSyncedUserId.current) {
        lastSyncedUserId.current = session.user.id;
        syncUserToBackend(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error as Error | null };
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const updateProfile = async (updates: { displayName?: string; avatarUrl?: string; bio?: string; location?: string; website?: string; github?: string; linkedin?: string }) => {
    const { error, data } = await supabase.auth.updateUser({
      data: {
        display_name: updates.displayName,
        avatar_url: updates.avatarUrl,
        bio: updates.bio,
        location: updates.location,
        website: updates.website,
        github: updates.github,
        linkedin: updates.linkedin
      }
    });

    if (!error && data.user) {
      setUser(data.user);
    }

    return { error: error as Error | null };
  };

  const uploadAvatar = async (file: File) => {
    try {
      if (!user) throw new Error("No user logged in");

      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);

      return { url: data.publicUrl, error: null };
    } catch (error: any) {
      return { url: null, error: error as Error };
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut, updateProfile, uploadAvatar }}>
      {children}
    </AuthContext.Provider>
  );
};
