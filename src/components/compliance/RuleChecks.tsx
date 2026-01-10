import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks/useAppDispatch';
import { fetchAlerts } from '@/store/slices/alertsSlice';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, AlertTriangle, Shield } from 'lucide-react';

export function RuleChecks() {
  const dispatch = useAppDispatch();
  const { selectedCustomerId } = useAppSelector((state) => state.customers);
  const { alerts, loading } = useAppSelector((state) => state.alerts);

  useEffect(() => {
    if (selectedCustomerId) {
      dispatch(fetchAlerts({ customerId: selectedCustomerId }));
    }
  }, [dispatch, selectedCustomerId]);

  if (!selectedCustomerId) {
    return (
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 text-center">
        <Shield className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-4 text-gray-600">
          Select a customer to view compliance checks
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 text-center">
        <p className="text-gray-600">Loading compliance data...</p>
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 text-center">
        <p className="text-gray-600">No compliance flags found for this customer</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 shadow-sm">
          <div className="flex items-center gap-2 text-blue-700">
            <Shield className="h-4 w-4" />
            <span className="text-sm">Active Alerts</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-blue-700">
            {alerts.length}
          </p>
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 shadow-sm">
          <div className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm">Risk Severity</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-red-700 uppercase">
            {alerts.some(a => a.severity === 'critical') ? 'CRITICAL' : 
             alerts.some(a => a.severity === 'high') ? 'HIGH' : 
             alerts.some(a => a.severity === 'medium') ? 'MEDIUM' : 'LOW'}
          </p>
        </div>
      </div>

      {/* Alert Results */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900">Compliance Findings</h3>
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={cn(
              'rounded-lg border p-4 shadow-sm',
              alert.status === 'passed' || alert.status === 'resolved'
                ? 'border-green-200 bg-green-50/50'
                : alert.status === 'review_required'
                ? 'border-blue-200 bg-blue-50/50'
                : 'border-amber-200 bg-amber-50/50'
            )}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1">
                {alert.status === 'passed' || alert.status === 'resolved' ? (
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                ) : alert.status === 'review_required' ? (
                  <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900">{alert.title}</p>
                    <span className="text-[10px] text-gray-400 font-mono">
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">
                    {alert.description}
                  </p>
                  {alert.rule && (
                    <p className="mt-1 text-xs font-mono text-gray-500 bg-white/50 w-fit px-1.5 rounded border border-gray-100">
                      ID: {alert.rule}
                    </p>
                  )}
                </div>
              </div>
              <span
                className={cn(
                  'rounded-full px-3 py-1 text-xs font-medium h-fit self-start sm:self-center uppercase tracking-wider',
                  (alert.status === 'passed' || alert.status === 'resolved')
                    ? 'bg-green-100 text-green-800'
                    : alert.status === 'review_required'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-amber-100 text-amber-800'
                )}
              >
                {alert.status.replace('_', ' ')}
              </span>
            </div>
            {alert.severity && (
              <div className="mt-3 text-xs flex items-center gap-2">
                <span className="text-gray-500 uppercase font-semibold">Priority:</span>
                <span
                  className={cn(
                    'font-bold capitalize',
                    (alert.severity === 'critical' || alert.severity === 'high') && 'text-red-700',
                    alert.severity === 'medium' && 'text-amber-700',
                    alert.severity === 'low' && 'text-blue-700'
                  )}
                >
                  {alert.severity}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
