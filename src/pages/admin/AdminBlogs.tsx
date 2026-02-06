import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const AdminBlogs = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Blogs</h2>
                    <p className="text-muted-foreground">Manage blog posts and articles</p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> New Post
                </Button>
            </div>

            <div className="p-8 text-center text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
                Blog management coming soon...
            </div>
        </div>
    );
};

export default AdminBlogs;
