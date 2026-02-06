import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, User, LayoutDashboard, Shield } from "lucide-react";
import { Button } from "./ui/button";
import { useState, Suspense, lazy } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import ThemeSwitcher from "./ThemeSwitcher";

const Logo3D = lazy(() => import("./Logo3D"));

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  const userInitial = user?.email?.charAt(0).toUpperCase() || "U";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 md:h-20 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 md:gap-3 text-lg md:text-xl font-bold group">
            <div className="relative">
              <Suspense fallback={
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">N</span>
                </div>
              }>
                <Logo3D size="sm" className="!h-10 !w-10 md:!h-12 md:!w-12" />
              </Suspense>
            </div>
            <div className="flex flex-col">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight">
                NextJS Mastery
              </span>
              <span className="text-[10px] md:text-xs text-muted-foreground font-normal">Enterprise Training 2026</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <Link to="/" className="text-foreground/80 hover:text-foreground transition-colors font-medium">
              Home
            </Link>
            <Link to="/curriculum" className="text-foreground/80 hover:text-foreground transition-colors font-medium">
              Curriculum
            </Link>
            {user && (
              <Link to="/dashboard" className="text-foreground/80 hover:text-foreground transition-colors font-medium">
                Dashboard
              </Link>
            )}
            <Link to="/pricing" className="text-foreground/80 hover:text-foreground transition-colors font-medium">
              Pricing
            </Link>
            <Link to="/community" className="text-foreground/80 hover:text-foreground transition-colors font-medium">
              Community
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="text-foreground/80 hover:text-foreground transition-colors font-medium flex items-center gap-1 outline-none">
                More <span className="text-xs">▼</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link to="/blog">Blog</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/projects">Projects</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/jobs">Jobs</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="hidden lg:flex items-center gap-4">
            <ThemeSwitcher />
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 border-2 border-primary/30">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground">
                        {userInitial}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.email?.split("@")[0]}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="cursor-pointer">
                      <Shield className="mr-2 h-4 w-4" />
                      Admin Panel
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/curriculum" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      My Courses
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/signin">Sign In</Link>
                </Button>
                <Button variant="gradient" size="sm" asChild>
                  <Link to="/signup">Start Free Trial</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="border-t border-border py-6 lg:hidden animate-in slide-in-from-top-2">
            <div className="flex flex-col gap-4">
              <Link
                to="/"
                className="text-foreground/80 hover:text-foreground transition-colors py-2 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/curriculum"
                className="text-foreground/80 hover:text-foreground transition-colors py-2 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Curriculum
              </Link>
              {user && (
                <Link
                  to="/dashboard"
                  className="text-foreground/80 hover:text-foreground transition-colors py-2 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              <Link
                to="/pricing"
                className="text-foreground/80 hover:text-foreground transition-colors py-2 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              <div className="flex flex-col gap-3 pt-4 border-t border-border">
                {user ? (
                  <>
                    <div className="flex items-center gap-2 py-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground text-sm">
                          {userInitial}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{user.email}</span>
                    </div>
                    <Button variant="outline" onClick={() => { handleSignOut(); setIsMenuOpen(false); }}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" asChild>
                      <Link to="/signin" onClick={() => setIsMenuOpen(false)}>Sign In</Link>
                    </Button>
                    <Button variant="gradient" asChild>
                      <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                        Start Free Trial
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
