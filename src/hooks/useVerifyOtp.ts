import { useState } from 'react';
import { userApi, VerifyOTPData } from '@/services/api';
import { toast } from '@/hooks/use-toast';
import { AxiosError } from 'axios';

export function useVerifyOtp() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verify = async (data: VerifyOTPData) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Verifying OTP with data:', { email: data.email, otp: '***' });
      const response = await userApi.verifyOTP(data);
      
      console.log('Backend OTP verification response:', response);
      
      // ✅ FIX: Handle different response structures
      if (response.success) {
        // Check if we have user and token data
        if (response.data?.user && response.data?.token) {
          toast({
            title: 'Email Verified',
            description: response.message || 'Your email has been verified successfully.',
          });
          return { 
            success: true, 
            data: response // Contains { success, message, data: { user, token } }
          };
        } else if (response.data?.userId) {
          // Alternative structure: just has userId
          toast({
            title: 'Email Verified',
            description: response.message || 'Your email has been verified successfully.',
          });
          return { 
            success: true, 
            data: response
          };
        } else {
          // Unexpected structure but still success
          console.warn('Unexpected OTP verification response structure:', response);
          toast({
            title: 'Email Verified',
            description: 'Verification completed successfully.',
          });
          return { 
            success: true, 
            data: response
          };
        }
      } else {
        // Handle case where backend returns success: false
        const errorMessage = response.message || response.error || 'OTP verification failed';
        setError(errorMessage);
        toast({
          title: 'Verification Failed',
          description: errorMessage,
          variant: 'destructive',
        });
        return { success: false, error: errorMessage };
      }
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ error?: string; message?: string }>;
      const errorMessage = 
        axiosError.response?.data?.error || 
        axiosError.response?.data?.message || 
        axiosError.message || 
        'OTP verification failed';
      
      console.error('OTP verification error:', {
        message: errorMessage,
        response: axiosError.response?.data,
        status: axiosError.response?.status,
      });
      
      setError(errorMessage);
      toast({
        title: 'Verification Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return { verify, isLoading, error };
}