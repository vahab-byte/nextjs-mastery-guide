import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, UserCog, Users, Loader2 } from "lucide-react";
import { api, User } from "@/services/api";

const AdminUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // Demo token fallback
    const token = localStorage.getItem("jwt_token") || "demo-token";

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const usersData = await api.admin.getUsers(token);
            setUsers(usersData.users);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateUserRole = async (userId: string, newRole: string) => {
        try {
            await api.admin.updateUserRole(userId, newRole, token);
            setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
        } catch (error) {
            console.error("Error updating role:", error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const filteredUsers = users.filter(u =>
        u.email.includes(searchQuery) ||
        u.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
                    <p className="text-muted-foreground">Manage users and their roles</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Users className="h-5 w-5" /> All Users
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
                                {filteredUsers.map((u) => (
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
                                                    <UserCog className="h-3 w-3 mr-1" />
                                                    {u.role === 'admin' ? 'Demote' : 'Promote'}
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredUsers.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="text-center py-8 text-muted-foreground">
                                            No users found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminUsers;
