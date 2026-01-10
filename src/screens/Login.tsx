import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Zap, Eye, EyeOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useLogin } from '@/hooks/useLogin';
import Logo  from '@/components/icons/logo';

// Demo credentials
const DEMO_USERS = [
  {
    email: 'admin@blazetech.com',
    password: 'demo123',
    user: {
      id: 'user_demo_1',
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@blazetech.com',
      phone: '+234 800 123 4567',
      organisationName: 'BlazeTech Demo',
      organisationType: 'fintech_lending' as const,
      role: 'executive' as const,
    },
  },
];

export function Login() {
  const navigate = useNavigate();
  const { login: loginUser, isLoading } = useLogin();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: 'Error',
        description: 'Please enter both email and password',
        variant: 'destructive',
      });
      return;
    }

    await loginUser({ email, password });
  };

  const handleDemoLogin = () => {
    setEmail('admin@blazetech.com');
    setPassword('demo123');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
      {/* Background pattern/image - similar to welcome page */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-20 left-20 w-64 h-64 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

      {/* Header with Logo and Back Button - with semi-transparent background */}
      <div className="absolute top-0 left-0 right-0 px-6 py-4 flex items-center justify-between bg-white/80 backdrop-blur-sm z-50">
        {/* Logo on the left */}
        <div className="flex items-center gap-2">
          <Logo />
          <span className="text-xl font-bold text-gray-900">BlazeTech</span>
        </div>

        {/* Back Button on the right */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/welcome')}
          className="text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        {/* Form Card - with glass effect */}
        <div className="w-full max-w-md bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-xl p-8 shadow-xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600 text-sm">
              Sign in to your BlazeTech account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/80 border-gray-300 focus:border-primary focus:ring-primary text-gray-900"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-gray-700">Password</Label>
                <button 
                  type="button"
                  className="text-xs text-primary hover:underline text-primary-600"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white/80 border-gray-300 focus:border-primary focus:ring-primary text-gray-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Demo Login Button */}
          <div className="mt-4">
            <Button 
              type="button"
              variant="outline"
              className="w-full bg-white/80 border-gray-300 text-gray-700 hover:bg-white hover:text-gray-900"
              onClick={handleDemoLogin}
            >
              Use Demo Credentials
            </Button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <button 
                onClick={() => navigate('/select-organization')}
                className="text-primary-600 hover:underline font-medium"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-600">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}