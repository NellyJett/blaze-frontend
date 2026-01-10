import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { fetchCustomers, fetchCustomerById } from '@/store/slices/customersSlice';
import { fetchTransactions } from '@/store/slices/transactionsSlice';
import { fetchAlerts } from '@/store/slices/alertsSlice';
import { fetchAuditLogs } from '@/store/slices/auditLogsSlice';
import { CustomerSearch } from '@/components/customers/CustomerSearch';
import { CustomerList } from '@/components/customers/CustomerList';
import { CustomerProfile } from '@/components/customers/CustomerProfile';
import { TransactionTable } from '@/components/customers/TransactionTable';
import { CreditScoreDisplay } from '@/components/scoring/CreditScoreDisplay';
import { Search, Bell, ChevronDown, Zap } from 'lucide-react';
import { RootState } from '@/store';

import Logo  from '@/components/icons/logo';

export function Customer360() {
  const dispatch = useAppDispatch();
  const { selectedCustomerId, selectedCustomer } = useAppSelector((state) => state.customers);
  const user = useAppSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (selectedCustomerId) {
      dispatch(fetchCustomerById(selectedCustomerId));
      dispatch(fetchTransactions(selectedCustomerId));
      dispatch(fetchAlerts({ customerId: selectedCustomerId }));
      dispatch(fetchAuditLogs(selectedCustomerId));
    }
  }, [dispatch, selectedCustomerId]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar - Reduced padding on mobile */}
      <div className="fixed top-0 left-0 right-0 z-40 px-2 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-sm">
        <div className="flex items-center gap-2">
          <Logo />
          <span className="hidden sm:block text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            BlazeTech
          </span>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          {/* User Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="h-11 w-11 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
              {user?.firstName?.[0] || 'U'}
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900">{user?.firstName || 'User'}</p>
              <p className="text-xs text-gray-500">{user?.role || 'Admin'}</p>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-500 hidden md:block" />
          </div>
        </div>
      </div>

      {/* Main Content - Reduced padding even more on mobile */}
      <div className="pt-14 px-2 sm:px-4 lg:px-6">
        <div className="space-y-4 pt-2">
          {/* Header - Responsive */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Customer 360</h1>
              <p className="text-sm text-gray-600">
                Complete customer view with profiles, transactions, and risk assessment
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              {selectedCustomer && (
                <div className="flex items-center gap-2 px-2 py-1 bg-blue-50 rounded-lg border border-blue-100">
                  <span className="text-xs font-medium text-blue-700">
                    Active: {selectedCustomer.firstName} {selectedCustomer.lastName}
                  </span>
                </div>
              )}
              <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-600/30 transition-all duration-300 whitespace-nowrap text-sm">
                Add New Customer
              </button>
            </div>
          </div>

          {/* Main Grid - Reduced gap on mobile */}
          <div className="flex flex-col lg:grid lg:grid-cols-3 lg:gap-4" style={{ height: 'calc(100vh - 160px)' }}>
            {/* Customer List - Full width on mobile, 1/3 on lg+ */}
            <div className="lg:col-span-1 h-full flex flex-col min-h-0 mb-4 lg:mb-0">
              <div className="mb-3">
                <CustomerSearch />
              </div>
              <div className="flex-1 overflow-y-auto bg-white rounded-lg border border-gray-200 shadow-sm min-h-0">
                <div className="p-3">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Customers</h3>
                  <CustomerList />
                </div>
              </div>
            </div>

            {/* Customer Details - Full width on mobile, 2/3 on lg+ */}
            <div className="lg:col-span-2 h-full flex flex-col min-h-0">
              <div className="flex-1 overflow-y-auto space-y-4 min-h-0">
                {/* Customer Profile */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-2 sm:p-4">
                  <CustomerProfile />
                </div>

                {selectedCustomerId && (
                  <>
                    {/* Credit Score */}
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-2 sm:p-4">
                      <CreditScoreDisplay />
                    </div>

                    {/* Transactions */}
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-2 sm:p-4">
                      <div className="mb-3">
                        <h2 className="text-base sm:text-lg font-semibold text-gray-900">Recent Transactions</h2>
                        <p className="text-xs sm:text-sm text-gray-600">Customer transaction history and analysis</p>
                      </div>
                      <div className="overflow-x-auto -mx-2 sm:mx-0">
                        <TransactionTable />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}