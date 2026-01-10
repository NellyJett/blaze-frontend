import { Customer, CreditScore, ScoreFactor, Transaction } from '@/types';

interface ScoringWeights {
  income: number;
  repaymentHistory: number;
  accountAge: number;
  transactionFrequency: number;
  loanToIncomeRatio: number;
  kycStatus: number;
}

const DEFAULT_WEIGHTS: ScoringWeights = {
  income: 0.20,
  repaymentHistory: 0.30,
  accountAge: 0.15,
  transactionFrequency: 0.10,
  loanToIncomeRatio: 0.15,
  kycStatus: 0.10,
};

// Normalize a value to 0-100 scale
const normalize = (value: number, min: number, max: number): number => {
  return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
};

// Calculate income score (higher income = higher score)
const calculateIncomeScore = (income: number): { score: number; factor: ScoreFactor } => {
  const normalizedScore = normalize(income, 20000, 200000);
  
  return {
    score: normalizedScore,
    factor: {
      name: 'Annual Income',
      impact: income >= 60000 ? 'positive' : income >= 40000 ? 'neutral' : 'negative',
      weight: DEFAULT_WEIGHTS.income,
      value: normalizedScore,
      description: income >= 80000
        ? 'Strong income level supports creditworthiness'
        : income >= 50000
        ? 'Moderate income level'
        : 'Lower income may impact credit capacity',
    },
  };
};

// Calculate repayment history score
const calculateRepaymentScore = (history: number): { score: number; factor: ScoreFactor } => {
  return {
    score: history,
    factor: {
      name: 'Repayment History',
      impact: history >= 85 ? 'positive' : history >= 70 ? 'neutral' : 'negative',
      weight: DEFAULT_WEIGHTS.repaymentHistory,
      value: history,
      description: history >= 90
        ? 'Excellent payment track record'
        : history >= 75
        ? 'Good payment history with minor issues'
        : 'Payment history needs improvement',
    },
  };
};

// Calculate account age score
const calculateAccountAgeScore = (months: number): { score: number; factor: ScoreFactor } => {
  const normalizedScore = normalize(months, 0, 60);
  
  return {
    score: normalizedScore,
    factor: {
      name: 'Account Age',
      impact: months >= 24 ? 'positive' : months >= 12 ? 'neutral' : 'negative',
      weight: DEFAULT_WEIGHTS.accountAge,
      value: normalizedScore,
      description: months >= 24
        ? 'Well-established account relationship'
        : months >= 12
        ? 'Developing account history'
        : 'New account with limited history',
    },
  };
};

// Calculate transaction frequency score
const calculateTransactionScore = (
  transactions: Transaction[],
  customerId: string
): { score: number; factor: ScoreFactor } => {
  const customerTx = transactions.filter((tx) => tx.customerId === customerId);
  const last30Days = customerTx.filter(
    (tx) => new Date(tx.timestamp) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  );
  
  const frequency = last30Days.length;
  const normalizedScore = normalize(frequency, 0, 30);
  
  return {
    score: normalizedScore,
    factor: {
      name: 'Transaction Activity',
      impact: frequency >= 10 ? 'positive' : frequency >= 5 ? 'neutral' : 'negative',
      weight: DEFAULT_WEIGHTS.transactionFrequency,
      value: normalizedScore,
      description: frequency >= 15
        ? 'Active account usage demonstrates engagement'
        : frequency >= 5
        ? 'Moderate account activity'
        : 'Limited recent transaction activity',
    },
  };
};

// Calculate loan-to-income ratio score
const calculateLTIScore = (
  loanBalance: number,
  income: number
): { score: number; factor: ScoreFactor } => {
  if (income === 0) return { score: 50, factor: { name: 'Loan-to-Income Ratio', impact: 'neutral', weight: DEFAULT_WEIGHTS.loanToIncomeRatio, value: 50, description: 'Unable to calculate ratio' } };
  
  const ratio = loanBalance / income;
  const normalizedScore = normalize(1 - ratio, 0, 1) * 100;
  
  return {
    score: normalizedScore,
    factor: {
      name: 'Debt-to-Income Ratio',
      impact: ratio <= 0.3 ? 'positive' : ratio <= 0.5 ? 'neutral' : 'negative',
      weight: DEFAULT_WEIGHTS.loanToIncomeRatio,
      value: normalizedScore,
      description: ratio <= 0.2
        ? 'Low debt burden relative to income'
        : ratio <= 0.4
        ? 'Moderate debt level'
        : 'High debt-to-income ratio',
    },
  };
};

// Calculate KYC status score
const calculateKYCScore = (
  customer: Customer
): { score: number; factor: ScoreFactor } => {
  const statusScores = {
    verified: 100,
    pending: 60,
    failed: 20,
    not_started: 0,
  };
  
  const score = statusScores[customer.kycStatus];
  
  return {
    score,
    factor: {
      name: 'Identity Verification',
      impact: customer.kycStatus === 'verified' ? 'positive' : customer.kycStatus === 'pending' ? 'neutral' : 'negative',
      weight: DEFAULT_WEIGHTS.kycStatus,
      value: score,
      description: customer.kycStatus === 'verified'
        ? 'Identity fully verified'
        : customer.kycStatus === 'pending'
        ? 'Verification in progress'
        : 'Identity verification required',
    },
  };
};

// Get bucket label from score
const getBucket = (score: number): CreditScore['bucket'] => {
  if (score >= 80) return 'excellent';
  if (score >= 65) return 'good';
  if (score >= 50) return 'fair';
  return 'poor';
};

// Main credit scoring function
export const calculateCreditScore = (
  customer: Customer,
  transactions: Transaction[]
): CreditScore => {
  const incomeResult = calculateIncomeScore(customer.income);
  const repaymentResult = calculateRepaymentScore(customer.repaymentHistory);
  const accountAgeResult = calculateAccountAgeScore(customer.accountAge);
  const transactionResult = calculateTransactionScore(transactions, customer.id);
  const ltiResult = calculateLTIScore(customer.loanBalance, customer.income);
  const kycResult = calculateKYCScore(customer);
  
  const factors = [
    incomeResult.factor,
    repaymentResult.factor,
    accountAgeResult.factor,
    transactionResult.factor,
    ltiResult.factor,
    kycResult.factor,
  ];
  
  // Calculate weighted score
  const totalScore =
    incomeResult.score * DEFAULT_WEIGHTS.income +
    repaymentResult.score * DEFAULT_WEIGHTS.repaymentHistory +
    accountAgeResult.score * DEFAULT_WEIGHTS.accountAge +
    transactionResult.score * DEFAULT_WEIGHTS.transactionFrequency +
    ltiResult.score * DEFAULT_WEIGHTS.loanToIncomeRatio +
    kycResult.score * DEFAULT_WEIGHTS.kycStatus;
  
  const finalScore = Math.round(totalScore);
  
  return {
    customerId: customer.id,
    score: finalScore,
    bucket: getBucket(finalScore),
    factors,
    calculatedAt: new Date().toISOString(),
  };
};

// Get score color
export const getScoreColor = (bucket: CreditScore['bucket']): string => {
  switch (bucket) {
    case 'excellent':
      return 'text-success';
    case 'good':
      return 'text-primary';
    case 'fair':
      return 'text-warning';
    case 'poor':
      return 'text-destructive';
  }
};

// Get score background
export const getScoreBgColor = (bucket: CreditScore['bucket']): string => {
  switch (bucket) {
    case 'excellent':
      return 'bg-success/20';
    case 'good':
      return 'bg-primary/20';
    case 'fair':
      return 'bg-warning/20';
    case 'poor':
      return 'bg-destructive/20';
  }
};
