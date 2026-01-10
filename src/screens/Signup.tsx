import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setPendingUser, OrganizationType, UserRole } from '@/store/slices/authSlice';
import { RootState } from '@/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Zap, Eye, EyeOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useRegisterUser } from '@/hooks/useRegisterUser';
import Logo  from '@/components/icons/logo';

const industryLabels: Record<OrganizationType, string> = {
  fintech_lending: 'Fintech Lending Platform',
  microfinance_bank: 'Microfinance Bank',
  digital_lender: 'Digital / Online Lender',
  investment_trading: 'Investment / Trading App',
  credit_bureau: 'Credit Bureau',
  insurance: 'Insurance',
  pfi: 'PFI (Participating Financial Institution)',
  bnpl_provider: 'BNPL Provider',
};

const roleOptions: { value: UserRole; label: string }[] = [
  { value: 'compliance_officer', label: 'Compliance Officer' },
  { value: 'fraud_analyst', label: 'Fraud Analyst' },
  { value: 'risk_manager', label: 'Risk Manager' },
  { value: 'operations_admin', label: 'Operations / Admin' },
  { value: 'developer_technical', label: 'Developer / Technical' },
  { value: 'executive', label: 'Executive' },
];

export function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedOrganizationType = useSelector((state: RootState) => state.auth.selectedOrganizationType);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    organizationName: '', 
    role: '' as UserRole | '',
    acceptTerms: false, 
  });
  const [showPassword, setShowPassword] = useState(false);
  const { register, isLoading } = useRegisterUser();

  // Redirect if no organization type selected
  if (!selectedOrganizationType) {
    navigate('/select-organization');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRoleChange = (value: UserRole) => {
    setFormData(prev => ({ ...prev, role: value }));
  };

  const isFormValid = 
    formData.firstName.trim() !== '' &&
    formData.lastName.trim() !== '' &&
    formData.email.trim() !== '' &&
    formData.phone.trim() !== '' &&
    formData.password.trim() !== '' &&
    formData.confirmPassword.trim() !== '' &&
    formData.organizationName.trim() !== '' && 
    formData.role !== '' &&
    formData.acceptTerms; 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.role) {
      toast({
        title: 'Error',
        description: 'Please select your role',
        variant: 'destructive',
      });
      return;
    }
  
    if (!formData.acceptTerms) {
      toast({
        title: 'Error',
        description: 'Please agree to the Terms and Conditions',
        variant: 'destructive',
      });
      return;
    }
  
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        variant: 'destructive',
      });
      return;
    }
  
    if (formData.password.length < 6) {
      toast({
        title: 'Error',
        description: 'Password must be at least 6 characters',
        variant: 'destructive',
      });
      return;
    }
  
    // Add debug logging
    console.log('Submitting form with data:', {
      ...formData,
      password: '[HIDDEN]',
      confirmPassword: '[HIDDEN]',
      organizationType: selectedOrganizationType,
    });
  
    // Register user with backend
    const result = await register({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      acceptTerms: formData.acceptTerms,
      organizationName: formData.organizationName,
      organizationType: selectedOrganizationType,
      role: formData.role as UserRole,
    });
  
    console.log('Registration result:', result);
  
    if (result.success) {
      // Check if OTP verification is required
      if (result.requiresVerification) {
        // Store pending user data and navigate to OTP verification
        const pendingUser = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          organizationName: formData.organizationName,
          organizationType: selectedOrganizationType,
          role: formData.role as UserRole,
        };
  
        dispatch(setPendingUser(pendingUser));
        navigate('/verify-otp');
      } else {
        // If no verification needed, go to dashboard
        toast({
          title: 'Welcome!',
          description: 'Your account has been created successfully.',
        });
        navigate('/dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Light gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      
      {/* Subtle background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-1/4 left-1/4 w-56 h-56 bg-accent/5 rounded-full blur-3xl opacity-30" />
      </div>

      {/* Fixed Top Navigation Bar - Stays while scrolling */}
      <div className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        {/* Logo on the left */}
        <div className="flex items-center gap-2">
          <Logo />
          <span className="text-xl font-bold text-[#3F6F5E]">BlazeTech</span>
        </div>

        {/* Back button on the right */}
        <button
          onClick={() => navigate('/select-organization')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:border-primary hover:bg-primary/5 transition-all hover:scale-105 group"
          aria-label="Back to organization selection"
        >
          <ArrowLeft className="h-4 w-4 text-gray-600 group-hover:text-primary group-hover:-translate-x-0.5 transition-all" />
          <span className="text-gray-700 group-hover:text-primary text-sm font-medium transition-colors">
            Back
          </span>
        </button>
      </div>

      {/* Main Content Container - Adjusted for fixed header */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12 pt-24">
        {/* Form Card - Light theme */}
        <div className="w-full max-w-lg bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Create Your Account</h1>
            <p className="text-gray-600 text-base">
              Setting up for <span className="text-primary font-semibold">{industryLabels[selectedOrganizationType]}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2.5">
                <Label htmlFor="firstName" className="text-gray-700 text-sm font-medium">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:ring-primary"
                />
              </div>
              <div className="space-y-2.5">
                <Label htmlFor="lastName" className="text-gray-700 text-sm font-medium">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:ring-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2.5">
                <Label htmlFor="email" className="text-gray-700 text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:ring-primary"
                />
              </div>
              <div className="space-y-2.5">
                <Label htmlFor="phone" className="text-gray-700 text-sm font-medium">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+234 800 000 0000"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:ring-primary"
                />
              </div>
            </div>

            {/* ✅ FIXED: Organization Name input */}
            <div className="space-y-2.5">
              <Label htmlFor="organizationName" className="text-gray-700 text-sm font-medium">Organization Name</Label>
              <Input
                id="organizationName"
                name="organizationName" 
                placeholder="Your Company Ltd"
                value={formData.organizationName}
                onChange={handleChange}
                required
                className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2.5">
                <Label htmlFor="industry" className="text-gray-700 text-sm font-medium">Industry</Label>
                <Input
                  id="industry"
                  value={industryLabels[selectedOrganizationType]}
                  disabled
                  className="bg-gray-50 border-gray-300 text-gray-600"
                />
              </div>
              <div className="space-y-2.5">
                <Label htmlFor="role" className="text-gray-700 text-sm font-medium">Select Your Role</Label>
                <Select onValueChange={handleRoleChange} value={formData.role}>
                  <SelectTrigger className="w-full bg-white border-gray-300 text-gray-900 placeholder:text-gray-400">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-300 text-gray-900">
                    {roleOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value} className="focus:bg-primary/10 focus:text-primary">
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2.5">
                <Label htmlFor="password" className="text-gray-700 text-sm font-medium">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:ring-primary pr-10"
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
              <div className="space-y-2.5">
                <Label htmlFor="confirmPassword" className="text-gray-700 text-sm font-medium">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:ring-primary"
                />
              </div>
            </div>

            {/* Terms & Conditions Checkbox */}
            <div className="flex items-start space-x-3 pt-4">
              <Checkbox
                id="terms"
                checked={formData.acceptTerms}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, acceptTerms: checked === true }))
                }
                className="mt-0.5 border-gray-400 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />

              <Label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed cursor-pointer">
                I agree to the{' '}
                <a href="#" className="text-primary hover:text-primary/80 hover:underline font-medium">Terms and Conditions</a>
                {' '}and{' '}
                <a href="#" className="text-primary hover:text-primary/80 hover:underline font-medium">Privacy Policy</a>
              </Label>
            </div>

            <Button 
              type="submit" 
              className="w-full mt-8 bg-primary hover:bg-primary/90 text-white font-medium" 
              size="lg"
              disabled={isLoading || !isFormValid}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <button 
              onClick={() => navigate('/login')}
              className="text-primary hover:text-primary/80 hover:underline font-medium"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}