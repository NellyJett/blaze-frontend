import { Customer, Transaction, AuditLog, Alert } from '@/types';
import { blacklistedCountries } from '@/constants/compliance';

export interface RuleResult {
  passed: boolean;
  ruleId: string;
  ruleName: string;
  details: string;
  severity?: Alert['severity'];
}

// Rule: Large single transaction threshold
export const checkLargeTransaction = (
  transaction: Transaction,
  threshold: number = 10000
): RuleResult => {
  const passed = transaction.amount <= threshold;
  return {
    passed,
    ruleId: 'RULE_001',
    ruleName: 'Large Transaction Threshold',
    details: passed
      ? `Transaction amount $${transaction.amount.toLocaleString()} within threshold`
      : `Transaction amount $${transaction.amount.toLocaleString()} exceeds threshold of $${threshold.toLocaleString()}`,
    severity: passed ? undefined : transaction.amount > threshold * 5 ? 'critical' : 'high',
  };
};

// Rule: Rapid transaction velocity
export const checkTransactionVelocity = (
  transactions: Transaction[],
  customerId: string,
  windowMinutes: number = 60,
  maxTransactions: number = 5
): RuleResult => {
  const now = new Date();
  const windowStart = new Date(now.getTime() - windowMinutes * 60 * 1000);
  
  const recentTx = transactions.filter(
    (tx) =>
      tx.customerId === customerId &&
      new Date(tx.timestamp) >= windowStart
  );
  
  const passed = recentTx.length <= maxTransactions;
  return {
    passed,
    ruleId: 'RULE_002',
    ruleName: 'Rapid Transaction Velocity',
    details: passed
      ? `${recentTx.length} transactions in ${windowMinutes}-minute window (within limit)`
      : `${recentTx.length} transactions detected within ${windowMinutes}-minute window`,
    severity: passed ? undefined : recentTx.length > maxTransactions * 2 ? 'critical' : 'high',
  };
};

// Rule: Blacklisted country check
export const checkCountryRestriction = (
  transaction: Transaction
): RuleResult => {
  const passed = !transaction.counterpartyCountry || 
    !blacklistedCountries.includes(transaction.counterpartyCountry);
  
  return {
    passed,
    ruleId: 'RULE_003',
    ruleName: 'Blacklisted Country Check',
    details: passed
      ? 'Transaction does not involve restricted jurisdictions'
      : `Transaction involves restricted jurisdiction: ${transaction.counterpartyCountry}`,
    severity: passed ? undefined : 'critical',
  };
};

// Rule: KYC document verification
export const checkKYCDocuments = (
  customer: Customer,
  requiredDocs: string[] = ['passport', 'utility_bill']
): RuleResult => {
  const missingDocs = requiredDocs.filter(
    (doc) => !customer.documentsProvided.includes(doc)
  );
  
  const passed = missingDocs.length === 0;
  return {
    passed,
    ruleId: 'RULE_004',
    ruleName: 'KYC Document Verification',
    details: passed
      ? 'All required documents provided'
      : `Missing required documents: ${missingDocs.join(', ')}`,
    severity: passed ? undefined : 'medium',
  };
};

// Rule: Account age verification
export const checkAccountAge = (
  customer: Customer,
  minMonths: number = 3
): RuleResult => {
  const passed = customer.accountAge >= minMonths;
  return {
    passed,
    ruleId: 'RULE_005',
    ruleName: 'Account Age Verification',
    details: passed
      ? `Account age ${customer.accountAge} months meets minimum requirement`
      : `Account age ${customer.accountAge} months below minimum of ${minMonths} months`,
    severity: passed ? undefined : 'low',
  };
};

// Rule: Transaction amount vs income ratio
export const checkIncomeRatio = (
  transaction: Transaction,
  customer: Customer,
  maxRatio: number = 0.5
): RuleResult => {
  const monthlyIncome = customer.income / 12;
  const ratio = transaction.amount / monthlyIncome;
  const passed = ratio <= maxRatio;
  
  return {
    passed,
    ruleId: 'RULE_006',
    ruleName: 'Income Ratio Check',
    details: passed
      ? `Transaction is ${(ratio * 100).toFixed(1)}% of monthly income (within limit)`
      : `Transaction is ${(ratio * 100).toFixed(1)}% of monthly income (exceeds ${maxRatio * 100}% threshold)`,
    severity: passed ? undefined : ratio > maxRatio * 2 ? 'high' : 'medium',
  };
};

// Run all rules on a transaction
export const runAllTransactionRules = (
  transaction: Transaction,
  customer: Customer,
  allTransactions: Transaction[]
): RuleResult[] => {
  return [
    checkLargeTransaction(transaction),
    checkTransactionVelocity(allTransactions, customer.id),
    checkCountryRestriction(transaction),
    checkAccountAge(customer),
    checkIncomeRatio(transaction, customer),
  ];
};

// Generate audit log from rule result
export const createAuditLog = (
  result: RuleResult,
  customerId: string,
  transactionId?: string
): AuditLog => {
  return {
    id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    ruleId: result.ruleId,
    ruleName: result.ruleName,
    customerId,
    transactionId,
    result: result.passed ? 'pass' : 'flag',
    details: result.details,
  };
};
