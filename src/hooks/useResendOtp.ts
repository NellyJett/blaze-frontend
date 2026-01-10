import { useState } from 'react';
import { userApi } from '@/services/api';
import { toast } from '@/hooks/use-toast';

export function useResendOtp() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resend = async (email: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await userApi.resendOTP(email);
      toast({
        title: 'OTP Resent',
        description: 'A new verification code has been sent to your email.',
      });
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to resend OTP';
      setError(errorMessage);
      toast({
        title: 'Resend Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return { resend, isLoading, error };
}

