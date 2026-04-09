import { useState } from "react";
import { store } from "@/lib/store";
import { useNavigate, Link } from "react-router-dom";
import { Heart, Mail, Lock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = store.login(email, password);
    if (res.success && res.user) {
      store.setUser(res.user);
      toast({ title: `Welcome back, ${res.user.name}!` });
      navigate("/");
    } else {
      toast({ title: "Login failed", description: res.error, variant: "destructive" });
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary">
            <Heart className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="font-display text-2xl font-bold">Welcome Back</h1>
          <p className="mt-1 text-muted-foreground">Sign in to your MediBook account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border bg-card p-6 shadow-sm">
          <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
            <strong>Demo:</strong> Use <code className="rounded bg-muted px-1">admin@health.com</code> for admin access, or register a new account.
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input value={email} onChange={e => setEmail(e.target.value)} type="email" required placeholder="you@example.com"
                className="w-full rounded-lg border bg-background py-2.5 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input value={password} onChange={e => setPassword(e.target.value)} type="password" required placeholder="••••••••"
                className="w-full rounded-lg border bg-background py-2.5 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
          <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
            Sign In <ArrowRight className="h-4 w-4" />
          </button>
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account? <Link to="/register" className="font-semibold text-primary hover:underline">Register</Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
