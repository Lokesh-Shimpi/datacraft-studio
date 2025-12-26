import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Database, Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(searchParams.get("mode") !== "signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Placeholder - will integrate with Supabase auth
    setTimeout(() => {
      setLoading(false);
      toast({ title: isLogin ? "Login" : "Sign Up", description: "Auth will be connected to backend. Redirecting..." });
      navigate("/generator");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex">
      <div className="hidden lg:flex lg:w-1/2 gradient-header items-center justify-center p-12">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 bg-header-foreground/20 rounded-xl flex items-center justify-center mx-auto mb-6">
            <Database className="w-8 h-8 text-header-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-header-foreground mb-4">Dataset Generator</h1>
          <p className="text-header-foreground/80">Create, analyze, and export datasets with AI-powered tools.</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 justify-center mb-8">
            <Database className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">Dataset Generator</span>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-2">{isLogin ? "Welcome back" : "Create an account"}</h2>
          <p className="text-muted-foreground mb-8">{isLogin ? "Sign in to your account" : "Get started with Dataset Generator"}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" required />
              </div>
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10" required minLength={6} />
              </div>
            </div>
            <Button type="submit" className="w-full bg-success hover:bg-success-hover text-success-foreground gap-2" disabled={loading}>
              {loading ? "Please wait..." : (isLogin ? "Sign In" : "Create Account")}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button onClick={() => setIsLogin(!isLogin)} className="text-primary hover:underline font-medium">
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
