export type RiskLevel = 'low' | 'medium' | 'high';
export type KYCStatus = 'verified' | 'pending' | 'failed' | 'not_started';
export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';
export type TransactionType = 'deposit' | 'withdrawal' | 'transfer' | 'payment' | 'loan_payment';
export type TransactionStatus = 'completed' | 'pending' | 'failed' | 'flagged';

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  country: string;
  kycStatus: KYCStatus;
  documentsProvided: string[];
  createdAt: string;
  income: number;
  employmentStatus: 'employed' | 'self_employed' | 'unemployed' | 'retired';
  loanBalance: number;
  repaymentHistory: number; // 0-100 score
  accountAge: number; // in months
}

export interface Transaction {
  id: string;
  customerId: string;
  type: TransactionType;
  amount: number;
  currency: string;
  timestamp: string;
  status: TransactionStatus;
  description: string;
  counterpartyCountry?: string;
  metadata?: Record<string, unknown>;
}

export interface Alert {
  id: string;
  customerId: string;
  customer?: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
  };
  type: 'fraud' | 'aml' | 'compliance';
  severity: AlertSeverity;
  title: string;
  description: string;
  timestamp: string;
  status: 'open' | 'investigating' | 'resolved' | 'dismissed' | 'passed' | 'review_required';
  relatedTransactionIds: string[];
  metadata?: Record<string, unknown>;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  ruleId: string;
  ruleName: string;
  customerId: string;
  transactionId?: string;
  result: 'pass' | 'fail' | 'flag';
  details: string;
  metadata?: Record<string, unknown>;
}

export interface CreditScore {
  customerId: string;
  score: number;
  bucket: 'poor' | 'fair' | 'good' | 'excellent';
  factors: ScoreFactor[];
  calculatedAt: string;
}

export interface ScoreFactor {
  name: string;
  impact: 'positive' | 'negative' | 'neutral';
  weight: number;
  value: number;
  description: string;
}

export interface DashboardMetrics {
  totalTransactionVolume: number;
  complianceFails: number;
  loanPerformance: {
    totalLoans: number;
    activeLoans: number;
    defaultRate: number;
    totalDisbursed: number;
  };
  fraudAlerts: {
    total: number;
    high: number;
    medium: number;
    low: number;
    resolved: number;
  };
  complianceStatus: {
    kycCompliance: number;
    amlChecks: number;
    documentationComplete: number;
  };
  riskSummary: {
    totalCustomers: number;
    averageRiskScore: number;
    highRiskCustomers: number;
    mediumRiskCustomers: number;
    lowRiskCustomers: number;
  };
}

export interface TimeSeriesDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface ChartData {
  loanPerformance: TimeSeriesDataPoint[];
  fraudAlertsByDay: TimeSeriesDataPoint[];
  complianceBreakdown: { name: string; value: number; color: string }[];
  transactionVolume: TimeSeriesDataPoint[];
}

export interface IngestPayload {
  type: 'customer' | 'transaction' | 'event';
  data: Customer | Transaction | Record<string, unknown>;
}
