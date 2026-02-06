import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

const AdminRoute = ({ children }: { children?: React.ReactNode }) => {
    const { user, loading } = useAuth();

    // Also check for token in localStorage as a fallback/initial check if auth context is still syncing
    const token = localStorage.getItem("jwt_token");

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    // Simplified check: validation should ideally happen on backend or via robust claims
    if (!user || user.role !== "admin") {
        // Double check specific demo/admin email for dev convenience if needed, 
        // but relying on role from context is best.
        return <Navigate to="/" replace />;
    }

    return children ? <>{children}</> : <Outlet />;
};

export default AdminRoute;
