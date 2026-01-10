// hooks/useLogin.ts - Updated version
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { userApi, LoginData } from '@/services/api';
import { login, User, OrganizationType, UserRole } from '@/store/slices/authSlice';
import { toast } from '@/hooks/use-toast';

// Helper to normalize backend response
interface RawBackendUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  organizationName?: string;
  organisationName?: string;
  organizationType?: string;
  organisationType?: string;
  role?: string;
}

const normalizeBackendUser = (backendUser: RawBackendUser): User => ({
  id: backendUser.id,
  firstName: backendUser.firstName,
  lastName: backendUser.lastName,
  email: backendUser.email,
  phone: backendUser.phone || '',
  // ✅ FIXED: Handle both spellings
  organizationName: backendUser.organizationName || backendUser.organisationName || '',
  organizationType: (backendUser.organizationType || backendUser.organisationType || 'fintech_lending') as OrganizationType,
  // ✅ FIXED: Normalize role to lowercase and cast
  role: (backendUser.role || 'compliance_officer').toLowerCase() as UserRole,
});

export function useLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loginUser = async (data: LoginData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await userApi.login(data);
      
      // Store token
      localStorage.setItem('blazetech_token', response.token);
      
      // Normalize user data
      const user = normalizeBackendUser(response.user);

      // Update Redux store
      dispatch(login(user));

      toast({
        title: 'Welcome back!',
        description: `Logged in as ${user.firstName}`,
      });

      navigate('/dashboard');
      return { success: true, user };
    } catch (err) {
      let errorMessage = 'Login failed';
      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.error || err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      toast({
        title: 'Login Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return { login: loginUser, isLoading, error };
}