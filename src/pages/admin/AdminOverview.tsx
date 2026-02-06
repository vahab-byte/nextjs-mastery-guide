import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Users, BookOpen, FolderOpen, FileText, Award, DollarSign,
    TrendingUp, BarChart3, Loader2
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from "recharts";
import { api, AdminStats } from "@/services/api";

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

const AdminOverview = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [analytics, setAnalytics] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem("jwt_token");
        // Use demo token if no real token, just to show UI if backend offline
        fetchAdminData(storedToken || "demo-token");
    }, []);

    const fetchAdminData = async (authToken: string) => {
        try {
            setLoading(true);
            try {
                const statsData = await api.admin.getStats(authToken);
                setStats(statsData);
            } catch (err) {
                console.error("Failed to fetch stats", err);
            }

            const analyticsData = await api.admin.getAnalytics(authToken);
            setAnalytics(analyticsData);

        } catch (error) {
            console.error("Error fetching admin data:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
                <p className="text-muted-foreground">Welcome back, {user?.user_metadata?.full_name || 'Admin'}!</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
            <div className="grid md:grid-cols-2 gap-6">
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
        </div>
    );
};

export default AdminOverview;
