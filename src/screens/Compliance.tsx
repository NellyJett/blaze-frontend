import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { fetchCustomers } from '@/store/slices/customersSlice';
import { fetchTransactions } from '@/store/slices/transactionsSlice';
import { fetchAuditLogs } from '@/store/slices/auditLogsSlice';
import { CustomerSearch } from '@/components/customers/CustomerSearch';
import { CustomerList } from '@/components/customers/CustomerList';
import { RuleChecks } from '@/components/compliance/RuleChecks';
import { AuditLogTable } from '@/components/compliance/AuditLogTable';

export function Compliance() {
  const dispatch = useAppDispatch();
  const { selectedCustomer } = useAppSelector((state) => state.customers);

  useEffect(() => {
    dispatch(fetchCustomers());
    dispatch(fetchTransactions());
    dispatch(fetchAuditLogs());
  }, [dispatch]);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">KYC/AML Compliance</h1>
        <p className="text-sm sm:text-base text-gray-600">
          Automated compliance checks and audit trail
        </p>
      </div>

      {/* Main Grid - Stack on mobile, 3-col on lg+ */}
      <div className="flex flex-col lg:grid lg:grid-cols-3 lg:gap-6 gap-4">
        {/* Customer List - Full width on mobile, 1/3 on lg+ */}
        <div className="space-y-3 sm:space-y-4 lg:col-span-1">
          <CustomerSearch />
          <div className="max-h-[300px] sm:max-h-[400px] overflow-y-auto bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-3 sm:p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Customers</h3>
              <CustomerList />
            </div>
          </div>
        </div>

        {/* Rule Checks - Full width on mobile, 2/3 on lg+ */}
        <div className="lg:col-span-2">
          <RuleChecks />
        </div>
      </div>

      {/* Audit Logs */}
      <AuditLogTable />
    </div>
  );
}