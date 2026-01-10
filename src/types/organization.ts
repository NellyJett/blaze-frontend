import { User } from '../services/api';

export interface Organization {
  id: string;
  name: string;
  countriesOfOperation: string[];
  country: string;
  address: string;
  customerSize?: string | null;
  website?: string | null;
  rcNumber?: string | null;
  tin?: string | null;
  yearIncorporated?: number | null;
  type: string;
  plan: 'FREE' | 'GROWTH' | 'ENTERPRISE';
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationSettingsResponse {
  success: boolean;
  data: Organization;
}

export interface PlanConfig {
  maxCustomers: number;
  maxTransactionsPerMonth: number;
  modules: {
    fraud: boolean;
    aml: boolean;
    compliance: boolean;
    creditScoring: boolean;
  };
}

export interface PricingConfigResponse {
  success: boolean;
  data: Record<'FREE' | 'GROWTH' | 'ENTERPRISE', PlanConfig>;
}

export interface UsageSummary {
  organization: {
    id: string;
    name: string;
    plan: string;
  };
  monthlyUsage: {
    customers: number;
    transactions: number;
    alerts: number;
    apiCalls: number;
    lastUpdated: string;
  };
  lifetimeUsage: {
    customers: number;
    transactions: number;
    alerts: number;
    complianceChecks: number;
  };
  limits: {
    maxCustomers: number;
    maxTransactions: number;
    features: Record<string, boolean>;
  };
  valueMetrics: {
    riskEventsDetected: number;
    complianceChecksPerformed: number;
    alertsResolved: number;
    potentialLossPrevented: number;
    fraudDetections: number;
  };
}

export interface UsageSummaryResponse {
  success: boolean;
  data: UsageSummary;
}

export interface TeamMembersResponse {
  success: boolean;
  data: User[];
}
