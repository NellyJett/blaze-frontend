import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { fetchCustomers } from '@/store/slices/customersSlice';
import { fetchTransactions } from '@/store/slices/transactionsSlice';
import { CustomerSearch } from '@/components/customers/CustomerSearch';
import { CustomerList } from '@/components/customers/CustomerList';
import { CreditScoreDisplay } from '@/components/scoring/CreditScoreDisplay';
import { CustomerProfile } from '@/components/customers/CustomerProfile';

import { Badge } from '@/components/ui/badge';

export function CreditScoring() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCustomers());
    dispatch(fetchTransactions());
  }, [dispatch]);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header - Responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3 flex-wrap">
            Credit Scoring
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs sm:text-sm">
              ENTERPRISE FEATURE
            </Badge>
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Deterministic credit assessment based on customer profile and behavior
          </p>
        </div>
      </div>

      {/* Main Grid - Stack on mobile, 3-col on lg+ */}
      <div className="flex flex-col lg:grid lg:grid-cols-3 lg:gap-6 gap-4">
        {/* Customer List - Full width on mobile, 1/3 on lg+ */}
        <div className="space-y-3 sm:space-y-4 lg:col-span-1">
          <CustomerSearch />
          <div className="max-h-[300px] sm:max-h-[400px] lg:max-h-[calc(100vh-240px)] overflow-y-auto bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-3 sm:p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Customers</h3>
              <CustomerList />
            </div>
          </div>
        </div>

        {/* Credit Score & Profile - Full width on mobile, 2/3 on lg+ */}
        <div className="space-y-4 sm:space-y-6 lg:col-span-2">
          <CreditScoreDisplay />
          <CustomerProfile />
        </div>
      </div>
    </div>
  );
}