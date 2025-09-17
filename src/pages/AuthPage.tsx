import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { signIn, signUp } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { Shield, Heart } from "lucide-react";
import heroImage from "@/assets/hero-nehealth.jpg";

const AuthPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({ 
    email: "", 
    password: "", 
    name: "", 
    role: "community", 
    phone: "",
    district: "",
    ashaId: "",
    employeeId: ""
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const { error } = await signIn(loginForm.email, loginForm.password);
    
    if (error) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "Successfully logged in."
      });
      navigate("/");
    }
    setIsLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Create Supabase account
    const { error } = await signUp(signupForm.email, signupForm.password, {
      name: signupForm.name,
      role: signupForm.role,
      phone: signupForm.phone || undefined,
      district: signupForm.district || undefined,
      ashaId: signupForm.ashaId || undefined,
      employeeId: signupForm.employeeId || undefined
    });
    
    if (error) {
      toast({
        title: "Signup Failed",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Account Created Successfully!",
        description: "You can now log in with your credentials."
      });
      
      // Reset form and switch to login tab
      setSignupForm({ 
        email: "", 
        password: "", 
        name: "", 
        role: "community", 
        phone: "",
        district: "",
        ashaId: "",
        employeeId: ""
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{
          backgroundImage: `url(${heroImage})`
        }}
      />
      <div className="absolute inset-0 bg-gradient-hero/20" />
      
      <Card className="w-full max-w-md relative z-10 bg-card/95 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <div className="p-2 bg-primary/10 rounded-full">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <Shield className="h-8 w-8 text-secondary" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            NeHealth Platform
          </CardTitle>
          <p className="text-muted-foreground">
            Protecting Northeast India from Water-Borne Diseases
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="Enter your email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Enter your password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name *</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Enter your full name"
                    value={signupForm.name}
                    onChange={(e) => setSignupForm(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email *</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    value={signupForm.email}
                    onChange={(e) => setSignupForm(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password *</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Create a password"
                    value={signupForm.password}
                    onChange={(e) => setSignupForm(prev => ({ ...prev, password: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-phone">Phone Number (Optional)</Label>
                  <Input
                    id="signup-phone"
                    type="tel"
                    placeholder="9876543210"
                    value={signupForm.phone}
                    onChange={(e) => setSignupForm(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-district">District (Optional)</Label>
                  <Input
                    id="signup-district"
                    type="text"
                    placeholder="Enter your district"
                    value={signupForm.district}
                    onChange={(e) => setSignupForm(prev => ({ ...prev, district: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-role">Role *</Label>
                  <Select value={signupForm.role} onValueChange={(value) => setSignupForm(prev => ({ ...prev, role: value }))}>
                    <SelectTrigger id="signup-role">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="community">Community Member</SelectItem>
                      <SelectItem value="asha">ASHA Worker</SelectItem>
                      <SelectItem value="dho">District Health Officer</SelectItem>
                      <SelectItem value="authority">Health Authority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Conditional role-specific fields */}
                {signupForm.role === "asha" && (
                  <div className="space-y-2">
                    <Label htmlFor="signup-asha-id">ASHA ID Card Number</Label>
                    <Input
                      id="signup-asha-id"
                      type="text"
                      placeholder="Enter your ASHA ID Card Number"
                      value={signupForm.ashaId}
                      onChange={(e) => setSignupForm(prev => ({ ...prev, ashaId: e.target.value }))}
                    />
                  </div>
                )}
                
                {(signupForm.role === "dho" || signupForm.role === "authority") && (
                  <div className="space-y-2">
                    <Label htmlFor="signup-employee-id">Employee ID</Label>
                    <Input
                      id="signup-employee-id"
                      type="text"
                      placeholder="Enter your Employee ID"
                      value={signupForm.employeeId}
                      onChange={(e) => setSignupForm(prev => ({ ...prev, employeeId: e.target.value }))}
                    />
                  </div>
                )}
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;