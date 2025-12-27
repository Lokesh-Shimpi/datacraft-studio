import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Database, Mail, Lock, ArrowRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { z } from "zod";

const authSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  fullName: z.string().optional(),
});

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signIn, signUp, loading: authLoading } = useAuth();
  
  const [isLogin, setIsLogin] = useState(searchParams.get("mode") !== "signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; fullName?: string }>({});

  // Redirect if already logged in
  useEffect(() => {
    if (user && !authLoading) {
      navigate("/generator");
    }
  }, [user, authLoading, navigate]);

  const validateForm = () => {
    try {
      authSchema.parse({ email, password, fullName: !isLogin ? fullName : undefined });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: { email?: string; password?: string; fullName?: string } = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof typeof fieldErrors] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast({ 
              title: "Login Failed", 
              description: "Invalid email or password. Please try again.",
              variant: "destructive" 
            });
          } else {
            toast({ 
              title: "Login Failed", 
              description: error.message,
              variant: "destructive" 
            });
          }
        } else {
          toast({ title: "Welcome back!", description: "You have successfully signed in." });
          navigate("/generator");
        }
      } else {
        const { error } = await signUp(email, password, fullName);
        if (error) {
          if (error.message.includes("User already registered")) {
            toast({ 
              title: "Sign Up Failed", 
              description: "This email is already registered. Please sign in instead.",
              variant: "destructive" 
            });
          } else {
            toast({ 
              title: "Sign Up Failed", 
              description: error.message,
              variant: "destructive" 
            });
          }
        } else {
          toast({ title: "Account created!", description: "Welcome to Dataset Generator." });
          navigate("/generator");
        }
      }
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

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
            {!isLogin && (
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    id="fullName" 
                    type="text" 
                    placeholder="John Doe" 
                    value={fullName} 
                    onChange={(e) => setFullName(e.target.value)} 
                    className="pl-10" 
                  />
                </div>
                {errors.fullName && <p className="text-sm text-destructive mt-1">{errors.fullName}</p>}
              </div>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="you@example.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="pl-10" 
                  required 
                />
              </div>
              {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="pl-10" 
                  required 
                  minLength={6} 
                />
              </div>
              {errors.password && <p className="text-sm text-destructive mt-1">{errors.password}</p>}
            </div>
            <Button 
              type="submit" 
              className="w-full bg-success hover:bg-success-hover text-success-foreground gap-2" 
              disabled={loading}
            >
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
