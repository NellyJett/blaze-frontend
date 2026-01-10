import { useState, useCallback } from 'react';
import { userApi, User } from '@/services/api';
import { toast } from '@/hooks/use-toast';

export interface TeamMemberInvitation {
  email: string;
  role: string;
  permissions?: string[];
}

export function useTeam() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inviteTeamMember = useCallback(async (data: TeamMemberInvitation) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await userApi.inviteTeamMember(data);
      toast({
        title: 'Team Member Invited',
        description: 'An invitation has been sent to the team member.',
      });
      return { success: true, data: response };
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to invite team member';
      setError(errorMessage);
      toast({
        title: 'Invitation Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getTeamMembers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await userApi.getTeamMembers();
      return { success: true, data: response };
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to get team members';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const removeTeamMember = useCallback(async (teamMemberId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await userApi.removeTeamMember(teamMemberId);
      toast({
        title: 'Team Member Removed',
        description: 'Team member has been removed successfully.',
      });
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to remove team member';
      setError(errorMessage);
      toast({
        title: 'Remove Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { inviteTeamMember, getTeamMembers, removeTeamMember, isLoading, error };
}

