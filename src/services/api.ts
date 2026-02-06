import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// --- Types ---
export interface Project {
    _id: string;
    title: string;
    description: string;
    image: string;
    author: {
        name: string;
        avatar: string;
    };
    techStack: string[];
    liveUrl: string;
    githubUrl: string;
    stars: number;
    views: number;
    likes: number;
    featured?: boolean;
    category: string;
}

export interface ProjectStats {
    totalProjects: number;
    totalStars: number;
    totalViews: number;
    featuredCount: number;
}

export interface Plan {
    id: string;
    name: string;
    price: number;
    period: string;
    description: string;
    features: string[];
    popular: boolean;
}

export interface Snippet {
    _id: string;
    title: string;
    code: string;
    createdAt: string;
    language?: string;
}

export interface AdminStats {
    overview: {
        totalUsers: number;
        activeUsers: number;
        totalModules: number;
        totalProjects: number;
        totalBlogs: number;
        totalCertificates: number;
        monthlyRevenue: number;
        newUsersThisWeek: number;
    };
    topLearners: Array<{
        _id: string;
        full_name: string;
        email: string;
        xp_points: number;
        avatar_url?: string;
    }>;
}

export interface User {
    _id: string;
    email: string;
    full_name: string;
    role: string;
    xp_points: number;
    avatar_url?: string;
    current_streak?: number;
}

export interface Module {
    id: number;
    title: string;
    description: string;
    lessons_count: number;
    difficulty: "Beginner" | "Intermediate" | "Advanced";
    content_overview: string;
    content_code_example: string;
    content_topics: string[];
    created_at: string;
}

export interface Question {
    id: number;
    module_id: number;
    question: string;
    options: string[];
    correct_answer: number;
    explanation: string;
}

export interface UserProgress {
    user_id: string;
    module_id: number;
    is_completed: boolean;
    last_accessed_at: string;
    lesson_details: any | null;
    exam_passed: boolean;
    exam_score: number | null;
}

export interface Note {
    _id: string;
    user_id: string;
    module_id?: number;
    lesson_id?: string;
    title: string;
    content: string;
    tags: string[];
    createdAt: string;
    updatedAt: string;
}

// --- API Client ---

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API Error: ${response.statusText}`);
    }
    return response.json();
};

export const api = {
    // Projects
    projects: {
        getAll: async (selectedTech: string, searchQuery: string): Promise<Project[]> => {
            let url = `${API_URL}/projects?`;
            if (selectedTech !== "all") {
                url += `tech=${selectedTech}&`;
            }
            if (searchQuery) {
                url += `search=${encodeURIComponent(searchQuery)}&`;
            }
            return handleResponse(await fetch(url));
        },
        getStats: async (): Promise<ProjectStats> => {
            return handleResponse(await fetch(`${API_URL}/project-stats`));
        }
    },

    // Pricing
    pricing: {
        getPlans: async (): Promise<Plan[]> => {
            return handleResponse(await fetch(`${API_URL}/plans`));
        },
        getSubscription: async (userId?: string): Promise<any> => {
            if (!userId) return null;
            return handleResponse(await fetch(`${API_URL}/subscription/${userId}`));
        },
        subscribe: async (userId: string, planId: string, billingCycle: string): Promise<any> => {
            return handleResponse(await fetch(`${API_URL}/subscription/subscribe`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, plan: planId, billingCycle })
            }));
        }
    },

    // Snippets
    snippets: {
        getAll: async (): Promise<Snippet[]> => {
            return handleResponse(await fetch(`${API_URL}/snippets`));
        },
        save: async (snippet: Partial<Snippet> & { userId: string }): Promise<any> => {
            return handleResponse(await fetch(`${API_URL}/snippets`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(snippet)
            }));
        }
    },

    // Auth Sync
    auth: {
        syncUser: async (userData: any) => {
            return handleResponse(await fetch(`${API_URL}/auth/sync`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            }));
        },
        getMe: async (token: string) => {
            // If using custom JWT
            return handleResponse(await fetch(`${API_URL}/auth/me`, {
                headers: { Authorization: `Bearer ${token}` }
            }));
        }
    },

    // Modules & Learning
    modules: {
        getAll: async (): Promise<Module[]> => {
            return handleResponse(await fetch(`${API_URL}/modules`));
        },
        getById: async (id: number): Promise<Module> => {
            return handleResponse(await fetch(`${API_URL}/modules/${id}`));
        },
        getQuestions: async (moduleId: number): Promise<Question[]> => {
            return handleResponse(await fetch(`${API_URL}/modules/${moduleId}/questions`));
        }
    },

    // User Progress
    progress: {
        getByUser: async (userId: string): Promise<UserProgress[]> => {
            return handleResponse(await fetch(`${API_URL}/progress/${userId}`));
        },
        update: async (userId: string, moduleId: number, updates: Partial<UserProgress>) => {
            return handleResponse(await fetch(`${API_URL}/progress`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId, module_id: moduleId, ...updates })
            }));
        },
        markComplete: async (userId: string, moduleId: number) => {
            return handleResponse(await fetch(`${API_URL}/progress`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId, module_id: moduleId, is_completed: true })
            }));
        }
    },

    // Notes
    notes: {
        getAll: async (userId: string): Promise<Note[]> => {
            return handleResponse(await fetch(`${API_URL}/notes/${userId}`));
        },
        create: async (note: any) => {
            return handleResponse(await fetch(`${API_URL}/notes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(note)
            }));
        },
        update: async (id: string, updates: any) => {
            return handleResponse(await fetch(`${API_URL}/notes/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            }));
        },
        delete: async (id: string) => {
            return handleResponse(await fetch(`${API_URL}/notes/${id}`, {
                method: 'DELETE'
            }));
        }
    },

    // Achievements & Rewards
    achievements: {
        getAll: async (userId: string) => {
            return handleResponse(await fetch(`${API_URL}/achievements/${userId}`));
        },
        unlock: async (userId: string, achievementKey: string) => {
            return handleResponse(await fetch(`${API_URL}/achievements/unlock`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, achievementKey })
            }));
        },
        updateProgress: async (userId: string, achievementKey: string, progress: number) => {
            return handleResponse(await fetch(`${API_URL}/achievements/progress`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, achievementKey, progress })
            }));
        }
    },

    dailyReward: {
        getStatus: async (userId: string) => {
            return handleResponse(await fetch(`${API_URL}/daily-reward/status/${userId}`));
        },
        claim: async (userId: string) => {
            return handleResponse(await fetch(`${API_URL}/daily-reward/claim`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId })
            }));
        }
    },

    // Stats & Leaderboard
    stats: {
        getUserStats: async (userId: string) => {
            return handleResponse(await fetch(`${API_URL}/users/${userId}`));
        },
        getUserStreak: async (userId: string) => {
            return handleResponse(await fetch(`${API_URL}/user-streak/${userId}`));
        },
        getLeaderboard: async (limit = 10) => {
            return handleResponse(await fetch(`${API_URL}/leaderboard?limit=${limit}`));
        },
        logActivity: async (userId: string, action: string, description: string) => {
            return handleResponse(await fetch(`${API_URL}/users/${userId}/activity`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action, description })
            }));
        }
    },

    // Certificates
    certificates: {
        getAll: async (userId: string) => {
            return handleResponse(await fetch(`${API_URL}/certificates/${userId}`));
        },
        earn: async (data: { userId: string, type: string, name: string, level: string, requirements: number }) => {
            return handleResponse(await fetch(`${API_URL}/certificates`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            }));
        }
    },

    // Admin
    admin: {
        getStats: async (token: string): Promise<AdminStats> => {
            return handleResponse(await fetch(`${API_URL}/admin/stats`, {
                headers: { Authorization: `Bearer ${token}` }
            }));
        },
        getUsers: async (token: string): Promise<{ users: User[] }> => {
            return handleResponse(await fetch(`${API_URL}/admin/users?limit=10`, {
                headers: { Authorization: `Bearer ${token}` }
            }));
        },
        getAnalytics: async (token: string): Promise<any> => {
            return handleResponse(await fetch(`${API_URL}/admin/analytics`, {
                headers: { Authorization: `Bearer ${token}` }
            }));
        },
        updateUserRole: async (userId: string, role: string, token: string): Promise<void> => {
            const res = await fetch(`${API_URL}/admin/users/${userId}/role`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ role })
            });
            if (!res.ok) throw new Error("Failed to update role");
        }
    }
};
