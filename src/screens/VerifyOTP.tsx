import { useState, useRef, useEffect, KeyboardEvent, ClipboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentStep } from '@/store/slices/onboardingSlice';
import { RootState } from '@/store';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Zap, Mail, CheckCircle2, ChevronRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { login, clearPendingUser } from '@/store/slices/authSlice';
// ✅ FIX: Import types from authSlice
import type { OrganizationType as OrgType, UserRole } from '@/store/slices/authSlice';
// ✅ FIX: Import the actual hooks
import { useVerifyOtp } from '@/hooks/useVerifyOtp';
import { useResendOtp } from '@/hooks/useResendOtp';
import Logo from '@/components/icons/logo';

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60;

export function VerifyOTP() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const pendingUser = useSelector((state: RootState) => state.auth.pendingUser);
  
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [resendCooldown, setResendCooldown] = useState(RESEND_COOLDOWN);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { verify, isLoading } = useVerifyOtp();
  const { resend: resendOtp } = useResendOtp();

  // ✅ FIX: Use consistent field names
  const userEmail = pendingUser?.email || '';

  // Redirect if no pending user - only after initial render check
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!pendingUser) {
        navigate('/signup');
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [pendingUser, navigate]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendCooldown]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }

    if (value && !/^\d$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    
    if (pastedData) {
      const newOtp = [...otp];
      pastedData.split('').forEach((char, index) => {
        if (index < OTP_LENGTH) {
          newOtp[index] = char;
        }
      });
      setOtp(newOtp);
      
      const nextEmptyIndex = newOtp.findIndex(val => !val);
      if (nextEmptyIndex !== -1) {
        inputRefs.current[nextEmptyIndex]?.focus();
      } else {
        inputRefs.current[OTP_LENGTH - 1]?.focus();
      }
    }
  };

  const handleResendOTP = async () => {
    if (!canResend || !pendingUser) return;
    
    const result = await resendOtp(pendingUser.email);
    
    if (result.success) {
      setResendCooldown(RESEND_COOLDOWN);
      setCanResend(false);
      setOtp(Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    
    if (otpString.length !== OTP_LENGTH) {
      toast({
        title: 'Error',
        description: 'Please enter the complete 6-digit code',
        variant: 'destructive',
      });
      return;
    }
  
    if (!pendingUser) {
      toast({
        title: 'Error',
        description: 'No pending user found',
        variant: 'destructive',
      });
      return;
    }
  
    const result = await verify({
      email: pendingUser.email,
      otp: otpString,
    });
  
    if (result.success && result.data) {
      const backendResponse = result.data;
      
      // Check if we have the expected nested structure
      if (backendResponse.data && backendResponse.data.user && backendResponse.data.token) {
        const { user, token } = backendResponse.data;
        
        // ✅ FIX: Use updated field names from pendingUser
        const mappedUser = {
          id: user.id,
          firstName: user.firstName || pendingUser.firstName,
          lastName: user.lastName || pendingUser.lastName,
          email: user.email || pendingUser.email,
          phone: user.phone || pendingUser.phone,
          organizationName: user.organizationName || pendingUser.organizationName || '',
          organizationType: (user.organizationType?.toLowerCase() as OrgType) || pendingUser.organizationType,
          role: (user.role?.toLowerCase() as UserRole) || pendingUser.role,
        };
    
        // ✅ FIX: Store token for auto-login
        if (token) {
          localStorage.setItem('blazetech_token', token);
        }
        
        dispatch(login(mappedUser));
        dispatch(clearPendingUser());
        dispatch(setCurrentStep(4));
        
        toast({
          title: 'Email Verified',
          description: 'Your email has been verified successfully!',
        });
        
        navigate('/organization-details');
      } else {
        // Handle unexpected response format
        toast({
          title: 'Error',
          description: 'Unexpected response from server',
          variant: 'destructive',
        });
      }
    }
  };

  const isOtpComplete = otp.every(digit => digit !== '');

  const onboardingSteps = [
    { number: 1, title: 'Organization Type', completed: true },
    { number: 2, title: 'Create Account', completed: true },
    { number: 3, title: 'Verify OTP', completed: false, active: true },
    { number: 4, title: 'Organization Details', completed: false },
    { number: 5, title: 'Compliance Documents', completed: false },
    { number: 6, title: 'Team Setup', completed: false },
  ];

  // Show loading while checking for pending user
  if (!pendingUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/50 relative overflow-hidden">
      {/* Enhanced background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-indigo-50/30" />
      
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-10 w-64 h-64 bg-blue-200/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-10 w-64 h-64 bg-indigo-200/10 rounded-full blur-3xl" />
      </div>

      {/* Modern Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-sm">
        <div className="flex items-center gap-2">
          <Logo />
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            BlazeTech
          </span>
        </div>

        <button
          onClick={() => navigate('/signup')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group"
          aria-label="Back to signup"
        >
          <ArrowLeft className="h-4 w-4 text-gray-600 group-hover:text-blue-600 transition-colors" />
          <span className="text-gray-700 group-hover:text-blue-700 text-sm font-medium transition-colors">
            Back
          </span>
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12 pt-24">
        {/* Progress Steps - Centered like in the image */}
        <div className="w-full max-w-4xl mb-10">
          <div className="flex items-center justify-center mb-8">
            <div className="p-4">
              <div className="flex items-center space-x-6">
                {onboardingSteps.map((step, index) => (
                  <div key={step.number} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${step.active ? 'border-blue-600 bg-blue-600 text-white' : step.completed ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 bg-white text-gray-400'} font-medium`}>
                        {step.completed ? <CheckCircle2 className="h-5 w-5" /> : step.number}
                      </div>
                      <span className={`text-xs font-medium mt-2 ${step.active || step.completed ? 'text-blue-700' : 'text-gray-500'}`}>
                        {step.title}
                      </span>
                    </div>
                    {index < onboardingSteps.length - 1 && (
                      <div className="w-16 mx-2">
                        <div className={`h-0.5 ${step.completed ? 'bg-blue-600' : 'bg-gray-300'}`} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="w-full max-w-md bg-white border border-gray-200/80 rounded-2xl p-8 shadow-xl shadow-blue-100/10">
          <div className="text-center mb-8">
            <div className="relative inline-flex mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-blue-50 border border-blue-200">
                <Mail className="h-7 w-7 text-blue-600" />
              </div>
              <div className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-2.5 w-2.5 text-white" />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Email</h1>
            <p className="text-gray-600 text-sm mb-3">
              We've sent a 6-digit verification code to
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-50 rounded-lg border border-blue-100">
              <Mail className="h-4 w-4 text-blue-600" />
              <span className="text-blue-700 font-medium">{userEmail}</span>
            </div>
          </div>

          {/* OTP Input Section */}
          <div className="mb-8">
            <div className="flex justify-center gap-2 mb-4">
              {otp.map((digit, index) => (
                <div key={index} className="relative">
                  <input
                    ref={el => { inputRefs.current[index] = el }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-12 h-12 text-center text-xl font-bold bg-white border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-gray-900 hover:border-gray-400"
                    autoFocus={index === 0}
                  />
                  {digit && (
                    <div className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none" />
                  )}
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-500">Enter the 6-digit code</p>
            </div>
          </div>

          {/* Verify Button */}
          <Button 
            onClick={handleVerify}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-600/30 transition-all duration-200" 
            size="lg"
            disabled={isLoading || !isOtpComplete}
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Verifying...
              </>
            ) : (
              'Verify Email'
            )}
          </Button>

          {/* Resend OTP Section */}
          <div className="text-center mt-6 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-600 mb-2">
              Didn't receive the code?
            </p>
            {canResend ? (
              <button 
                onClick={handleResendOTP}
                className="text-blue-600 hover:text-blue-700 hover:underline font-medium text-sm transition-colors"
              >
                Resend OTP
              </button>
            ) : (
              <div className="inline-flex items-center gap-2 text-sm">
                <span className="text-gray-600">
                  Resend in <span className="font-medium text-blue-600">{resendCooldown}s</span>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            By verifying, you agree to our{' '}
            <button className="text-blue-600 hover:text-blue-700 font-medium">Terms of Service</button>
            {' '}and{' '}
            <button className="text-blue-600 hover:text-blue-700 font-medium">Privacy Policy</button>
          </p>
        </div>
      </div>
    </div>
  );
}