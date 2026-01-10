import { useAppSelector, useAppDispatch } from '@/hooks/useAppDispatch';
import { updateAlertStatus } from '@/store/slices/alertsSlice';
import { StatusBadge, getAlertSeverityType } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import {
  AlertTriangle,
  Shield,
  Clock,
  User,
  FileText,
  CheckCircle,
  XCircle,
  Search,
} from 'lucide-react';

export function AlertDetails() {
  const dispatch = useAppDispatch();
  const { selectedAlert, loading } = useAppSelector((state) => state.alerts);
  const { customers } = useAppSelector((state) => state.customers);
  const { transactions } = useAppSelector((state) => state.transactions);

  if (loading && !selectedAlert) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-gray-200 bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (!selectedAlert) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-4 text-gray-600">Select an alert to view details</p>
      </div>
    );
  }

  const customer = selectedAlert.customer || customers.find((c) => c.id === selectedAlert.customerId);
  const relatedTx = transactions.filter((tx) =>
    selectedAlert.relatedTransactionIds?.includes(tx.id)
  );

  const handleStatusUpdate = (status: typeof selectedAlert.status) => {
    dispatch(updateAlertStatus({ id: selectedAlert.id, status }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <StatusBadge
                status={getAlertSeverityType(selectedAlert.severity)}
                label={selectedAlert.severity}
              />
              <span className="text-sm capitalize text-gray-600">
                {selectedAlert.type} Alert
              </span>
            </div>
            <h2 className="mt-2 text-xl font-semibold text-gray-900">
              {selectedAlert.title}
            </h2>
            <p className="mt-2 text-gray-600">{selectedAlert.description}</p>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-4 text-sm text-gray-600">
          <span className="font-mono">{selectedAlert.id}</span>
          <span>•</span>
          <span>{format(new Date(selectedAlert.timestamp), 'MMM d, yyyy HH:mm:ss')}</span>
          <span>•</span>
          <span className="capitalize">Status: {selectedAlert.status}</span>
        </div>

        {/* Actions - UPDATED BUTTONS WITH WHITE BACKGROUND */}
        <div className="mt-6 flex gap-3">
          {selectedAlert.status === 'open' && (
            <Button
              variant="outline"
              size="sm"
              className="bg-white border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-600"
              onClick={() => handleStatusUpdate('investigating')}
            >
              <Search className="mr-2 h-4 w-4" />
              Start Investigation
            </Button>
          )}
          {selectedAlert.status !== 'resolved' && (
            <Button
              variant="outline"
              size="sm"
              className="bg-white border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700 hover:border-green-600"
              onClick={() => handleStatusUpdate('resolved')}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Mark Resolved
            </Button>
          )}
          {selectedAlert.status !== 'dismissed' && (
            <Button
              variant="outline"
              size="sm"
              className="bg-white border-gray-500 text-gray-600 hover:bg-gray-50 hover:text-gray-700 hover:border-gray-600"
              onClick={() => handleStatusUpdate('dismissed')}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Dismiss
            </Button>
          )}
        </div>
      </div>

      {/* Customer Info */}
      {customer && (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-900">
            <User className="h-4 w-4" />
            Associated Customer
          </h3>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {customer.firstName} {customer.lastName}
              </p>
              <p className="text-sm text-gray-600">{customer.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Related Transactions */}
      {relatedTx.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-900">
            <FileText className="h-4 w-4" />
            Related Transactions
          </h3>
          <div className="space-y-3">
            {relatedTx.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between rounded-lg bg-gray-100 p-3"
              >
                <div>
                  <p className="font-mono text-sm text-gray-900">{tx.id}</p>
                  <p className="text-sm text-gray-600">{tx.description}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono font-medium text-gray-900">
                    ${tx.amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-600">
                    {format(new Date(tx.timestamp), 'MMM d, HH:mm')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-900">
          <Clock className="h-4 w-4" />
          Event Timeline
        </h3>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <div className="h-full w-px bg-gray-300" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Alert Created</p>
              <p className="text-sm text-gray-600">
                {format(new Date(selectedAlert.timestamp), 'MMM d, yyyy HH:mm:ss')}
              </p>
            </div>
          </div>
          {selectedAlert.status !== 'open' && (
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <div className="h-full w-px bg-gray-300" />
              </div>
              <div>
                <p className="font-medium text-gray-900 capitalize">
                  Status: {selectedAlert.status}
                </p>
                <p className="text-sm text-gray-600">Updated</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}