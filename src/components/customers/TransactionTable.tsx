import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { fetchTransactions, setCurrentPage } from '@/store/slices/transactionsSlice';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge, getTransactionStatusType } from '@/components/ui/StatusBadge';
import { Transaction } from '@/types';
import { format } from 'date-fns';
import { ArrowDownLeft, ArrowUpRight, RefreshCw, CreditCard, Wallet } from 'lucide-react';

const typeIcons: Record<Transaction['type'], React.ReactNode> = {
  deposit: <ArrowDownLeft className="h-4 w-4 text-green-600" />,
  withdrawal: <ArrowUpRight className="h-4 w-4 text-red-600" />,
  transfer: <RefreshCw className="h-4 w-4 text-blue-600" />,
  payment: <CreditCard className="h-4 w-4 text-amber-600" />,
  loan_payment: <Wallet className="h-4 w-4 text-blue-600" />,
};

export function TransactionTable() {
  const dispatch = useAppDispatch();
  const { selectedCustomer } = useAppSelector((state) => state.customers);
  const { transactions, loading, currentPage, pageSize } = useAppSelector(
    (state) => state.transactions
  );

  // NO LONGER FILTERING IN MEMORY - Relying on store state which is fetched per customer
  const customerTransactions = transactions;

  const columns = [
    {
      key: 'type',
      header: 'Type',
      render: (tx: Transaction) => (
        <div className="flex items-center gap-2">
          {typeIcons[tx.type]}
          <span className="capitalize text-gray-900">{tx.type.replace('_', ' ')}</span>
        </div>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (tx: Transaction) => (
        <span className="font-mono font-medium text-gray-900">
          ${tx.amount.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      render: (tx: Transaction) => (
        <span className="text-gray-600">{tx.description}</span>
      ),
    },
    {
      key: 'timestamp',
      header: 'Date',
      render: (tx: Transaction) => (
        <span className="text-gray-600">
          {format(new Date(tx.timestamp), 'MMM d, yyyy HH:mm')}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (tx: Transaction) => (
        <StatusBadge
          status={getTransactionStatusType(tx.status)}
          label={tx.status}
          size="sm"
        />
      ),
    },
  ];

  if (loading || !selectedCustomer) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-4 w-32 bg-gray-200 rounded" />
        <div className="h-48 bg-gray-100 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-900">
        Transaction History
      </h3>
      <DataTable
        data={customerTransactions}
        columns={columns}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={(page) => dispatch(setCurrentPage(page))}
        emptyMessage="No transactions found for this customer"
        className="bg-white"  
      />
    </div>
  );
}