import { Link, useLocation, useNavigate } from "react-router-dom";
import { store } from "@/lib/store";
import { Heart, Calendar, Stethoscope, LogOut, Shield, Bell, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const user = store.getUser();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const notifications = store.getNotifications();

  const handleLogout = () => {
    store.setUser(null);
    navigate("/login");
  };

  const navLinks = [
    { to: "/", label: "Doctors", icon: Stethoscope },
    { to: "/appointments", label: "Appointments", icon: Calendar },
    ...(user?.role === "admin" ? [{ to: "/admin/doctors", label: "Manage Doctors", icon: Shield }] : []),
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Heart className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">MediBook</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-1 md:flex">
            {user && navLinks.map(l => (
              <Link
                key={l.to}
                to={l.to}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(l.to) ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <l.icon className="h-4 w-4" />
                {l.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            {user ? (
              <>
                <div className="relative">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  {notifications.length > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                      {Math.min(notifications.length, 9)}
                    </span>
                  )}
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {user.name.charAt(0)}
                </div>
                <button onClick={handleLogout} className="rounded-lg p-2 text-muted-foreground hover:bg-muted">
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            ) : (
              <Link to="/login" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="border-t p-4 md:hidden">
            {user && navLinks.map(l => (
              <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium ${
                  isActive(l.to) ? "bg-primary/10 text-primary" : "text-muted-foreground"
                }`}>
                <l.icon className="h-4 w-4" />{l.label}
              </Link>
            ))}
            {user ? (
              <button onClick={handleLogout} className="mt-2 flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-destructive">
                <LogOut className="h-4 w-4" />Logout
              </button>
            ) : (
              <Link to="/login" onClick={() => setMobileOpen(false)} className="block rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground">
                Sign In
              </Link>
            )}
          </div>
        )}
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">{children}</main>
    </div>
  );
}
