import { useState } from 'react';
import { userApi } from '@/services/api'; 
import { toast } from '@/hooks/use-toast';

// Define the interface locally to match your updated API
interface RegisterUserData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  acceptTerms: boolean;
  organizationName: string; // American spelling
  organizationType: string;
  role: string;
}

export function useRegisterUser() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (data: RegisterUserData) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Sending registration data:', data);
      const response = await userApi.register(data);
      
      // Check for response.data instead of response.user
      if (response.success && response.data) {
        toast({
          title: 'Registration Successful',
          description: response.message || 'Account created successfully.',
        });
        
        // Store user ID for OTP verification flow
        if (response.data.userId) {
          // We don't store token here since OTP verification is required
          // Token will be stored after OTP verification
        }
        
        return { 
          success: true, 
          data: response.data,
          requiresVerification: response.data.requiresVerification || true
        };
      } else {
        // Check for error in response
        if (response.error) {
          throw new Error(response.error);
        }
        throw new Error('Invalid response from server');
      }
    } catch (err: unknown) {
      let errorMessage = 'Registration failed';
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'object' && err !== null && 'response' in err) {
        // Handle axios error
        const axiosError = err as import('axios').AxiosError;
        const responseData = axiosError.response?.data as { error?: string; message?: string } | undefined;
        errorMessage = responseData?.error || 
                      responseData?.message || 
                      axiosError.message || 
                      'Registration failed';
      }
      
      setError(errorMessage);
      toast({
        title: 'Registration Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return { register, isLoading, error };
}