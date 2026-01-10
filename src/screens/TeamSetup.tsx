import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Users, Mail, Plus, Trash2, ArrowRight, ArrowLeft, Check, Shield, Zap, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { addTeamMember, removeTeamMember, completeOnboarding } from '@/store/slices/onboardingSlice';
import { useTeam } from '@/hooks/useTeam';
import type { Permission, TeamMember } from '@/types/onboarding';
import type { UserRole } from '@/store/slices/authSlice';
import type { RootState } from '@/store';

import Logo  from '@/components/icons/logo';

const ROLES: { value: UserRole; label: string }[] = [
  { value: 'compliance_officer', label: 'Compliance Officer' },
  { value: 'fraud_analyst', label: 'Fraud Analyst' },
  { value: 'risk_manager', label: 'Risk Manager' },
  { value: 'operations_admin', label: 'Operations / Admin' },
  { value: 'developer_technical', label: 'Developer / Technical' },
  { value: 'executive', label: 'Executive' },
];

const PERMISSIONS: { value: Permission; label: string; description: string }[] = [
  { value: 'view_dashboard', label: 'View Dashboard', description: 'Access main dashboard and metrics' },
  { value: 'view_customer_360', label: 'View Customer 360', description: 'Access customer profiles and data' },
  { value: 'view_compliance', label: 'View Compliance', description: 'Access compliance reports and audits' },
  { value: 'view_fraud_alerts', label: 'View Fraud Alerts', description: 'Access fraud detection alerts' },
  { value: 'admin_access', label: 'Admin Access', description: 'Full administrative privileges' },
];

export const TeamSetup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { teamMembers } = useSelector((state: RootState) => state.onboarding);
  const { inviteTeamMember, getTeamMembers, removeTeamMember: removeMember, isLoading } = useTeam();

  const [showInviteForm, setShowInviteForm] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole | ''>('');
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>([]);
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handlePermissionToggle = (permission: Permission) => {
    setSelectedPermissions(prev =>
      prev.includes(permission)
        ? prev.filter(p => p !== permission)
        : [...prev, permission]
    );
  };

  const handleAddMember = async () => {
    if (!email.trim()) {
      setEmailError('Email is required');
      return;
    }
    if (!validateEmail(email)) {
      setEmailError('Invalid email format');
      return;
    }
    if (!role) {
      setEmailError('Please select a role');
      return;
    }
    if (teamMembers.some(m => m.email.toLowerCase() === email.toLowerCase())) {
      setEmailError('This email has already been invited');
      return;
    }

    const result = await inviteTeamMember({
      email: email.trim(),
      role: role as string,
      permissions: selectedPermissions,
    });

    if (result.success) {
      const newMember: TeamMember = {
        id: result.data.teamMember.id,
        email: email.trim(),
        role: ROLES.find(r => r.value === role)?.label || role,
        permissions: selectedPermissions,
        status: 'pending',
        invitedAt: new Date().toISOString(),
      };

      dispatch(addTeamMember(newMember));
      
      // Reset form
      setEmail('');
      setRole('');
      setSelectedPermissions([]);
      setEmailError('');
      setShowInviteForm(false);
      
      // Refresh team members from backend
      await getTeamMembers();
    }
  };

  const handleRemoveMember = async (id: string) => {
    const result = await removeMember(id);
    if (result.success) {
      dispatch(removeTeamMember(id));
      await getTeamMembers();
    }
  };

  const handleComplete = () => {
    dispatch(completeOnboarding());
    navigate('/dashboard');
  };

  // Steps for the progress bar
  const onboardingSteps = [
    { number: 1, title: 'Organization Type', completed: true },
    { number: 2, title: 'Create Account', completed: true },
    { number: 3, title: 'Verify OTP', completed: true },
    { number: 4, title: 'Organization Details', completed: true },
    { number: 5, title: 'Compliance Documents', completed: true },
    { number: 6, title: 'Team Setup', completed: false, active: true },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-transparent to-indigo-50/10" />
      
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-10 w-64 h-64 bg-blue-100/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-10 w-64 h-64 bg-indigo-100/20 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-sm">
        <div className="flex items-center gap-2">
          <Logo />
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            BlazeTech
          </span>
        </div>

        <button
          onClick={() => navigate('/compliance-documents')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group"
          aria-label="Back to Compliance Documents"
        >
          <ArrowLeft className="h-4 w-4 text-gray-600 group-hover:text-blue-600 transition-colors" />
          <span className="text-gray-700 group-hover:text-blue-700 text-sm font-medium transition-colors">
            Back
          </span>
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12 pt-24">
        {/* Progress Steps */}
        <div className="w-full max-w-6xl mb-10">
          <div className="flex items-center justify-center mb-8">
            <div className="pt-6 w-full max-w-5xl">
              <div className="flex items-center justify-between">
                {onboardingSteps.map((step, index) => (
                  <div key={step.number} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${step.active ? 'border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-500/30' : step.completed ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 bg-white text-gray-400'} font-medium transition-all duration-300`}>
                        {step.completed ? <CheckCircle2 className="h-5 w-5" /> : step.number}
                      </div>
                      <span className={`text-xs font-medium mt-2 ${step.active ? 'text-blue-700 font-semibold' : step.completed ? 'text-blue-700' : 'text-gray-500'} transition-colors`}>
                        {step.title}
                      </span>
                    </div>
                    {index < onboardingSteps.length - 1 && (
                      <div className="w-16 mx-4">
                        <div className={`h-0.5 ${step.completed ? 'bg-blue-600' : 'bg-gray-300'} transition-colors`} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="w-full max-w-4xl">
          <Card className="border border-gray-200 rounded-2xl shadow-xl overflow-visible bg-white">
            {/* Card Header with White Background */}
            <div className="bg-white border-b border-gray-200">
              <CardHeader className="text-center pb-6">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center mb-4 border border-blue-200">
                  <Users className="w-10 h-10 text-blue-600" />
                </div>
                <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                  Team Setup
                </CardTitle>
                <CardDescription className="text-gray-600 text-base">
                  Invite team members and assign permissions (optional)
                </CardDescription>
              </CardHeader>
            </div>

            <CardContent className="p-8 bg-white">
              <div className="space-y-8">
                {/* Team Members List */}
                {teamMembers.length > 0 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-8 w-1 bg-blue-500 rounded-r-full" />
                      <h3 className="text-lg font-semibold text-gray-900">Invited Members</h3>
                    </div>
                    
                    <div className="space-y-3">
                      {teamMembers.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg hover:border-blue-300 transition-all duration-200"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200">
                              <Mail className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{member.email}</p>
                              <p className="text-sm text-gray-600">{member.role}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs px-3 py-1 bg-amber-100 text-amber-700 rounded-full border border-amber-200">
                              Pending
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveMember(member.id)}
                              className="h-8 px-2.5 border-red-300 hover:bg-red-50 hover:border-red-400 hover:text-red-700 text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Invite Form */}
                {showInviteForm ? (
                  <div className="space-y-6 p-5 border border-gray-300 rounded-xl bg-gray-50/50">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-8 w-1 bg-blue-500 rounded-r-full" />
                      <h3 className="text-lg font-semibold text-gray-900">Invite New Member</h3>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-700 font-medium flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            setEmailError('');
                          }}
                          placeholder="colleague@company.com"
                          className={`h-12 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 bg-white ${emailError ? 'border-red-500' : ''}`}
                        />
                        {emailError && (
                          <p className="text-sm text-red-600 flex items-center gap-1">
                            <span className="text-xs">⚠</span> {emailError}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-gray-700 font-medium">Role</Label>
                        <div className="relative">
                          <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
                            <SelectTrigger className={`h-12 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 bg-white ${role ? 'text-gray-900' : 'text-gray-500'}`}>
                              <SelectValue placeholder="Select role">
                                {role ? (
                                  <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-blue-600" />
                                    <span>{ROLES.find(r => r.value === role)?.label}</span>
                                  </div>
                                ) : null}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-gray-300 shadow-lg z-50">
                              {ROLES.map((r) => (
                                <SelectItem 
                                  key={r.value} 
                                  value={r.value} 
                                  className="flex items-center py-3 px-4 text-gray-900 hover:bg-blue-50 cursor-pointer"
                                >
                                  <Users className="w-3 h-3 mr-2 text-gray-500 flex-shrink-0" />
                                  <span>{r.label}</span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-gray-700 font-medium flex items-center gap-2">
                          <Shield className="w-4 h-4" />
                          Permissions
                        </Label>
                        <div className="space-y-2">
                          {PERMISSIONS.map((permission) => (
                            <label
                              key={permission.value}
                              className="flex items-start gap-3 p-3 rounded-lg border border-gray-300 hover:border-blue-300 hover:bg-blue-50/50 bg-white cursor-pointer transition-all duration-200"
                            >
                              <Checkbox
                                checked={selectedPermissions.includes(permission.value)}
                                onCheckedChange={() => handlePermissionToggle(permission.value)}
                                className="mt-0.5 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                              />
                              <div className="flex-1">
                                <p className="font-medium text-sm text-gray-900">{permission.label}</p>
                                <p className="text-xs text-gray-600 mt-0.5">{permission.description}</p>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowInviteForm(false);
                          setEmail('');
                          setRole('');
                          setSelectedPermissions([]);
                          setEmailError('');
                        }}
                        className="flex-1 h-12 rounded-lg border-gray-300 hover:border-blue-500 hover:bg-blue-50 text-gray-700 bg-white"
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleAddMember}
                        disabled={isLoading}
                        className="flex-1 h-12 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-600/30 transition-all duration-300"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        {isLoading ? 'Inviting...' : 'Add Team Member'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => setShowInviteForm(true)}
                    className="w-full h-12 rounded-lg border-gray-300 border-dashed hover:border-blue-500 hover:bg-blue-50 text-gray-700 bg-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Invite Team Member
                  </Button>
                )}

                {/* Skip Notice */}
                <div className="flex items-center gap-3 p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">
                      Optional Step
                    </p>
                    <p className="text-xs text-blue-700 mt-0.5">
                      You can skip this step and invite team members later from settings
                    </p>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/compliance-documents')}
                    className="flex-1 h-12 rounded-lg border-gray-300 hover:border-blue-500 hover:bg-blue-50 text-gray-700 bg-white"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button 
                    onClick={handleComplete}
                    className="flex-1 h-12 rounded-lg bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg shadow-green-500/20 hover:shadow-green-600/30 transition-all duration-300"
                  >
                    Complete Setup
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Info Note */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Team members will receive an email invitation to join. {' '}
              <button className="text-blue-600 hover:text-blue-700 font-medium underline underline-offset-2">
                Learn about team roles
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};