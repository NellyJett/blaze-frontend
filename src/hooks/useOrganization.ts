import { useState } from 'react';
import axios from 'axios';
import { userApi } from '@/services/api';
import { toast } from '@/hooks/use-toast';
import { OrganizationDetails } from '@/types/onboarding';

export function useOrganization() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveOrganizationDetails = async (data: OrganizationDetails) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await userApi.saveOrganizationDetails(data);
      toast({
        title: 'Organization Details Saved',
        description: 'Your organization details have been saved successfully.',
      });
      return { success: true, data: response };
    } catch (err: unknown) {
      const errorMessage = axios.isAxiosError(err) 
        ? err.response?.data?.error || err.message 
        : err instanceof Error ? err.message : 'Failed to save organization details';
      setError(errorMessage);
      toast({
        title: 'Save Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const getOrganizationDetails = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await userApi.getOrganizationDetails();
      return { success: true, data: response };
    } catch (err: unknown) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.error || err.message
        : err instanceof Error ? err.message : 'Failed to get organization details';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return { saveOrganizationDetails, getOrganizationDetails, isLoading, error };
}

