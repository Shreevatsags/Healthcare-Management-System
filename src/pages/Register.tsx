import { useState } from "react";
import { store } from "@/lib/store";
import { useNavigate, Link } from "react-router-dom";
import { Heart, Mail, Lock, User, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = store.register(name, email, password);
    if (res.success && res.user) {
      store.setUser(res.user);
      toast({ title: "Account created!", description: `Welcome, ${res.user.name}` });
      navigate("/");
    } else {
      toast({ title: "Registration failed", description: res.error, variant: "destructive" });
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary">
            <Heart className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="font-display text-2xl font-bold">Create Account</h1>
          <p className="mt-1 text-muted-foreground">Join MediBook to book appointments</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border bg-card p-6 shadow-sm">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input value={name} onChange={e => setName(e.target.value)} required placeholder="John Doe"
                className="w-full rounded-lg border bg-background py-2.5 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
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
              <input value={password} onChange={e => setPassword(e.target.value)} type="password" required placeholder="••••••••" minLength={6}
                className="w-full rounded-lg border bg-background py-2.5 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
          <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
            Create Account <ArrowRight className="h-4 w-4" />
          </button>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account? <Link to="/login" className="font-semibold text-primary hover:underline">Sign In</Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
