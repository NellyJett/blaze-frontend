import { useEffect, useRef, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks/useAppDispatch';
import { selectCustomer, fetchCustomers } from '@/store/slices/customersSlice';
import { Customer } from '@/types';
import { cn } from '@/lib/utils';
import { StatusBadge, getKYCStatusType } from '@/components/ui/StatusBadge';
import { User, Mail, MapPin, Loader2 } from 'lucide-react';

export function CustomerList() {
  const dispatch = useAppDispatch();
  const { customers, searchQuery, selectedCustomerId, loading, loadingMore, pagination, hasMore } = useAppSelector(
    (state) => state.customers
  );
  
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Filter in memory for instantaneous search
  const filteredCustomers = customers.filter((customer) => {
    const query = searchQuery.toLowerCase();
    return (
      customer.firstName.toLowerCase().includes(query) ||
      customer.lastName.toLowerCase().includes(query) ||
      customer.email.toLowerCase().includes(query) ||
      customer.id.toLowerCase().includes(query)
    );
  });

  // Handle infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore && pagination) {
          dispatch(fetchCustomers({ 
            page: pagination.page + 1, 
            search: searchQuery
          }));
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [dispatch, hasMore, loading, loadingMore, pagination, searchQuery]);

  // Reset and fetch when search query changes
  useEffect(() => {
    dispatch(fetchCustomers({ page: 1, search: searchQuery }));
  }, [dispatch, searchQuery]);

  const handleSelectCustomer = (customer: Customer) => {
    dispatch(selectCustomer(customer.id));
  };

  if (loading && customers.length === 0) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-20 animate-pulse rounded-lg bg-gray-200"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2 pb-4">
      {filteredCustomers.map((customer) => (
        <div
          key={customer.id}
          onClick={() => handleSelectCustomer(customer)}
          className={cn(
            'cursor-pointer rounded-lg border p-4 transition-all hover:shadow-sm',
            selectedCustomerId === customer.id
              ? 'border-blue-500 bg-blue-50 shadow-sm'
              : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-gray-50'
          )}
        >
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0 flex-1">
              <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <p className="font-medium text-gray-900 truncate">
                    {customer.firstName} {customer.lastName}
                  </p>
                  <div className="sm:hidden">
                    <StatusBadge
                      status={getKYCStatusType(customer.kycStatus || 'not_started')}
                      label={(customer.kycStatus || 'not_started').replace('_', ' ')}
                      size="sm"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                  <Mail className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{customer.email}</span>
                </div>
              </div>
            </div>
            <div className="hidden sm:block flex-shrink-0">
              <StatusBadge
                status={getKYCStatusType(customer.kycStatus || 'not_started')}
                label={(customer.kycStatus || 'not_started').replace('_', ' ')}
                size="sm"
              />
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-600">
            <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
              {customer.id}
            </span>
            <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
              <MapPin className="h-3 w-3 flex-shrink-0" />
              {customer.country}
            </span>
          </div>
        </div>
      ))}

      {/* Infinite Scroll Trigger */}
      <div ref={loadMoreRef} className="py-4 flex justify-center">
        {hasMore && (loading || loadingMore) && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading more customers...</span>
          </div>
        )}
        {!hasMore && customers.length > 0 && (
          <p className="text-xs text-gray-400">All customers loaded</p>
        )}
      </div>

      {filteredCustomers.length === 0 && !loading && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
          <p className="text-gray-600">No customers found</p>
        </div>
      )}
    </div>
  );
}