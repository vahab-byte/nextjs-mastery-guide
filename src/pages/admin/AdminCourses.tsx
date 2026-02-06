import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, BookOpen, Loader2, MoreVertical, Search } from "lucide-react";
import { api } from "@/services/api";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface Course {
    id: number;
    title: string;
    description: string;
    difficulty: string;
    lessons_count: number;
}

const AdminCourses = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        difficulty: "Beginner"
    });

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const data = await api.admin.courses.getAll();
            setCourses(data);
        } catch (error) {
            console.error("Failed to fetch courses", error);
            toast.error("Failed to load courses");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (course?: Course) => {
        if (course) {
            setEditingCourse(course);
            setFormData({
                title: course.title,
                description: course.description,
                difficulty: course.difficulty
            });
        } else {
            setEditingCourse(null);
            setFormData({ title: "", description: "", difficulty: "Beginner" });
        }
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingCourse) {
                await api.admin.courses.update(editingCourse.id, formData);
                setCourses(courses.map(c => c.id === editingCourse.id ? { ...c, ...formData } : c));
                toast.success("Course updated successfully");
            } else {
                const newCourse = await api.admin.courses.create({ ...formData, lessons_count: 0 });
                setCourses([...courses, newCourse]);
                toast.success("Course created successfully");
            }
            setIsDialogOpen(false);
        } catch (error) {
            toast.error("Operation failed");
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this course? This action cannot be undone.")) return;
        try {
            await api.admin.courses.delete(id);
            setCourses(courses.filter(c => c.id !== id));
            toast.success("Course deleted");
        } catch (error) {
            toast.error("Failed to delete course");
        }
    };

    const filteredCourses = courses.filter(c =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Courses</h2>
                    <p className="text-muted-foreground">Manage your curriculum content</p>
                </div>
                <Button onClick={() => handleOpenDialog()}>
                    <Plus className="mr-2 h-4 w-4" /> New Course
                </Button>
            </div>

            <div className="flex items-center space-x-2 bg-muted/20 p-2 rounded-lg border max-w-sm">
                <Search className="h-4 w-4 text-muted-foreground ml-2" />
                <Input
                    placeholder="Search courses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-none shadow-none focus-visible:ring-0 bg-transparent"
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredCourses.map((course) => (
                    <Card key={course.id} className="group relative hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                                <Badge variant="outline" className="mb-2">{course.difficulty}</Badge>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="-mr-2 -mt-2">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleOpenDialog(course)}>
                                            <Pencil className="mr-2 h-4 w-4" /> Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(course.id)}>
                                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <CardTitle className="text-xl line-clamp-1" title={course.title}>{course.title}</CardTitle>
                            <CardDescription className="line-clamp-2 h-10">{course.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center text-sm text-muted-foreground">
                                <BookOpen className="mr-2 h-4 w-4" />
                                {course.lessons_count} Lessons
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredCourses.length === 0 && (
                <div className="text-center py-12 text-muted-foreground bg-muted/10 rounded-lg border border-dashed">
                    No courses found. Create one to get started.
                </div>
            )}

            {/* Create/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingCourse ? "Edit Course" : "Create New Course"}</DialogTitle>
                        <DialogDescription>
                            {editingCourse ? "Update course details." : "Add a new course to the curriculum."}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Course Title</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g., Next.js Mastery"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="difficulty">Difficulty</Label>
                            <Select
                                value={formData.difficulty}
                                onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select difficulty" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Beginner">Beginner</SelectItem>
                                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                                    <SelectItem value="Advanced">Advanced</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Brief summary of the course..."
                                rows={3}
                            />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button type="submit" variant="gradient">{editingCourse ? "Save Changes" : "Create Course"}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminCourses;
