export interface OrganizationDetails {
  registeredBusinessName: string;
  countriesOfOperation: string[];
  headquarterAddress: string;
  estimatedCustomerSize: string;
  websiteUrl: string;
  rcLicenseNumber: string;
  taxIdentificationNumber: string;
  yearIncorporated: string;
}

export interface ComplianceDocument {
  id: string;
  name: string;
  type: 'certificate_of_incorporation' | 'license_certificate' | 'aml_kyc_policy' | 'data_protection_policy' | 'authorized_signatory_letter';
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  status: 'pending' | 'uploaded' | 'verified';
}

export type Permission = 
  | 'view_dashboard'
  | 'view_customer_360'
  | 'view_compliance'
  | 'view_fraud_alerts'
  | 'admin_access';

export interface TeamMember {
  id: string;
  email: string;
  role: string;
  permissions: Permission[];
  status: 'pending' | 'active';
  invitedAt: string;
}

export interface OnboardingState {
  currentStep: number;
  organizationDetails: OrganizationDetails | null;
  complianceDocuments: ComplianceDocument[];
  teamMembers: TeamMember[];
  isOnboardingComplete: boolean;
}

export const ONBOARDING_STEPS = [
  { id: 1, name: 'Organization Type', path: '/select-organization' },
  { id: 2, name: 'Create Account', path: '/signup' },
  { id: 3, name: 'Verify OTP', path: '/verify-otp' },
  { id: 4, name: 'Organization Details', path: '/organization-details' },
  { id: 5, name: 'Compliance Documents', path: '/compliance-documents' },
  { id: 6, name: 'Team Setup', path: '/team-setup' },
] as const;

export const CUSTOMER_SIZE_OPTIONS = [
  'Less than 1,000',
  '1,000 - 10,000',
  '10,000 - 50,000',
  '50,000 - 100,000',
  '100,000 - 500,000',
  'More than 500,000',
] as const;

export const COUNTRY_OPTIONS = [
  'Nigeria',
  'Kenya',
  'Ghana',
  'South Africa',
  'Tanzania',
  'Uganda',
  'Rwanda',
  'Egypt',
  'United States',
  'United Kingdom',
] as const;
