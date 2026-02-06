import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import AnimatedCursor from "@/components/AnimatedCursor";
import ScrollProgress from "@/components/ScrollProgress";
import SmoothScroll from "@/components/SmoothScroll";
import ScrollToTop from "@/components/ScrollToTop";
import PageLoader from "@/components/PageLoader";
import Index from "./pages/Index";

import Curriculum from "./pages/Curriculum";
import Lesson from "./pages/Lesson";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import ResourcesPage from "./pages/ResourcesPage";
import CertificationsPage from "./pages/CertificationsPage";
import CodeEditorPage from "./pages/CodeEditorPage";
import Pricing from "./pages/Pricing";
import Community from "./pages/Community";
import Blog from "./pages/Blog";
import Projects from "./pages/Projects";
import Jobs from "./pages/Jobs";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/admin/AdminOverview"; // Keep for now as fallback or remove if unused, but let's alias it or import new ones
import AdminLayout from "./layouts/AdminLayout";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminCourses from "./pages/admin/AdminCourses";
import AdminBlogs from "./pages/admin/AdminBlogs";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminRoute from "./components/AdminRoute";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();
const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <AuthProvider>
        <TooltipProvider>
          {/* <SmoothScroll> */}
          <PageLoader />
          <AnimatedCursor />
          <ScrollProgress />
          <Toaster />
          <Sonner />
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/curriculum" element={<Curriculum />} />
              <Route path="/lesson/:id" element={<Lesson />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/resources" element={<ResourcesPage />} />
              <Route path="/certifications" element={<CertificationsPage />} />
              <Route path="/code-editor" element={<CodeEditorPage />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/community" element={<Community />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile" element={<Profile />} />

              {/* Admin Routes */}
              <Route path="/admin" element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }>
                <Route index element={<AdminOverview />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="courses" element={<AdminCourses />} />
                <Route path="blogs" element={<AdminBlogs />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          {/* </SmoothScroll> */}
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
