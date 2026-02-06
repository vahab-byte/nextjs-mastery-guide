import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Users, BookOpen, FolderOpen, FileText, Award, DollarSign,
    TrendingUp, BarChart3, Search, Shield, Trash2, UserCog, Loader2
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell
} from "recharts";

import { api, AdminStats, User } from "@/services/api";

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [analytics, setAnalytics] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [token, setToken] = useState<string | null>(null);

    // For demo, we'll use a simple check or the promote endpoint
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        // Check if logged in via JWT
        const storedToken = localStorage.getItem("jwt_token");
        // In offline/demo mode, allow access even without loose token check if convenient, 
        // but let's stick to simple fallbacks.
        if (storedToken) {
            setToken(storedToken);
            fetchAdminData(storedToken);
        } else {
            // Try fetching anyway to trigger offline mode? 
            // Or just allow demo access:
            fetchAdminData("demo-token");
        }
    }, []);

    const fetchAdminData = async (authToken: string) => {
        try {
            setLoading(true);

            // Fetch stats
            try {
                const statsData = await api.admin.getStats(authToken);
                setStats(statsData);
                setIsAdmin(true);
            } catch (err: any) {
                if (err.message === "Access Denied") {
                    setIsAdmin(false);
                    return;
                }
                // If it's another error, we might be in offline mode handled by api service which returned dummy data
                // but if api service throws (it shouldn't for offline except for specific logic), we catch here.
                // Actually api.admin.getStats returns dummy data if offline.
                // So if we are here, something else happened or it returned dummy data successfully.
            }

            // Fetch users
            const usersData = await api.admin.getUsers(authToken);
            setUsers(usersData.users);

            // Fetch analytics
            const analyticsData = await api.admin.getAnalytics(authToken);
            setAnalytics(analyticsData);

        } catch (error) {
            console.error("Error fetching admin data:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateUserRole = async (userId: string, newRole: string) => {
        if (!token && token !== "demo-token") return;
        try {
            await api.admin.updateUserRole(userId, newRole, token || "demo-token");
            setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
        } catch (error) {
            console.error("Error updating role:", error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="flex items-center justify-center h-[80vh]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <main className="container mx-auto px-4 py-8 pt-24 text-center">
                    <Shield className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
                    <p className="text-muted-foreground mb-4">You need admin privileges to access this page.</p>
                    <Button onClick={() => navigate("/")}>Go Home</Button>
                </main>
            </div>
        );
    }

    const statCards = [
        { title: "Total Users", value: stats?.overview.totalUsers || 0, icon: Users, color: "text-blue-500" },
        { title: "Active Users", value: stats?.overview.activeUsers || 0, icon: TrendingUp, color: "text-green-500" },
        { title: "Modules", value: stats?.overview.totalModules || 0, icon: BookOpen, color: "text-purple-500" },
        { title: "Projects", value: stats?.overview.totalProjects || 0, icon: FolderOpen, color: "text-orange-500" },
        { title: "Blogs", value: stats?.overview.totalBlogs || 0, icon: FileText, color: "text-pink-500" },
        { title: "Certificates", value: stats?.overview.totalCertificates || 0, icon: Award, color: "text-yellow-500" },
        { title: "Revenue", value: `$${stats?.overview.monthlyRevenue || 0}`, icon: DollarSign, color: "text-emerald-500" },
        { title: "New This Week", value: stats?.overview.newUsersThisWeek || 0, icon: BarChart3, color: "text-cyan-500" },
    ];

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container mx-auto px-4 py-8 pt-24">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <Shield className="h-8 w-8 text-primary" />
                            Admin Dashboard
                        </h1>
                        <p className="text-muted-foreground">Manage your platform</p>
                    </div>
                    <Badge variant="outline" className="text-sm">
                        <Shield className="h-3 w-3 mr-1" /> Admin Access
                    </Badge>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {statCards.map((stat, i) => (
                        <Card key={i}>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-muted-foreground">{stat.title}</p>
                                        <p className="text-2xl font-bold">{stat.value}</p>
                                    </div>
                                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Charts Row */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {/* User Activity Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">User Activity (30 Days)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={250}>
                                <AreaChart data={analytics?.userActivity || []}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="_id" tick={{ fontSize: 10 }} />
                                    <YAxis />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="count" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Plan Distribution */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Subscription Plans</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={analytics?.planDistribution || []}
                                        dataKey="count"
                                        nameKey="_id"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        label={({ _id, count }) => `${_id}: ${count}`}
                                    >
                                        {(analytics?.planDistribution || []).map((_: any, index: number) => (
                                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Users Table */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Users className="h-5 w-5" /> User Management
                            </CardTitle>
                            <div className="relative w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search users..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-3 px-4">User</th>
                                        <th className="text-left py-3 px-4">Email</th>
                                        <th className="text-left py-3 px-4">XP</th>
                                        <th className="text-left py-3 px-4">Role</th>
                                        <th className="text-left py-3 px-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.filter(u =>
                                        u.email.includes(searchQuery) ||
                                        u.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
                                    ).map((u) => (
                                        <tr key={u._id} className="border-b hover:bg-muted/50">
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarFallback>{u.full_name?.[0] || u.email[0]}</AvatarFallback>
                                                    </Avatar>
                                                    <span className="font-medium">{u.full_name || 'No name'}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-muted-foreground">{u.email}</td>
                                            <td className="py-3 px-4">
                                                <Badge variant="secondary">{u.xp_points} XP</Badge>
                                            </td>
                                            <td className="py-3 px-4">
                                                <Badge variant={u.role === 'admin' ? 'default' : 'outline'}>
                                                    {u.role}
                                                </Badge>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => updateUserRole(u._id, u.role === 'admin' ? 'user' : 'admin')}
                                                    >
                                                        <UserCog className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Top Learners */}
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Award className="h-5 w-5 text-yellow-500" /> Top Learners
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {stats?.topLearners.map((learner, i) => (
                                <div key={learner._id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold text-lg w-6">{i + 1}</span>
                                        <Avatar>
                                            <AvatarImage src={learner.avatar_url} />
                                            <AvatarFallback>{learner.full_name?.[0]}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{learner.full_name}</p>
                                            <p className="text-xs text-muted-foreground">{learner.email}</p>
                                        </div>
                                    </div>
                                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500">
                                        {learner.xp_points} XP
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
};

export default AdminDashboard;
